'use client'

import { useState, useEffect } from 'react'
import { useSupabaseSession } from '@/hooks/useSupabaseAuth'
import { Plane, MapPin, Calendar, Users, Wallet, Sparkles, Loader2, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import TravelPlan from '@/components/TravelPlan'
import LanguageSelector from '@/components/LanguageSelector'
import VoiceInput from '@/components/VoiceInput'
import BudgetManager from '@/components/BudgetManager'
import UserMenu from '@/components/UserMenu'
import AuthModal from '@/components/AuthModal'
import MapView from '@/components/MapView'
import { Language, detectFormLanguage } from '@/lib/languageDetection'
import { getTranslations } from '@/lib/i18n'

interface TravelFormData {
  destination: string
  duration: string
  travelers: string
  budget: string
  interests: string
  startDate: string
  specialRequests: string
}

// 语音识别文本转数字的辅助函数
function extractNumber(text: string): number | null {
  // 移除空格并转小写
  const cleaned = text.replace(/\s+/g, '').toLowerCase()
  
  // 直接匹配数字
  const directMatch = cleaned.match(/\d+/)
  if (directMatch) {
    return parseInt(directMatch[0], 10)
  }
  
  // 中文数字映射
  const chineseNumbers: Record<string, number> = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
    '两': 2, '俩': 2, '仨': 3,
    '百': 100, '千': 1000, '万': 10000,
  }
  
  // 处理特殊表达
  if (cleaned.includes('一周') || cleaned.includes('1周')) return 7
  if (cleaned.includes('两周') || cleaned.includes('2周')) return 14
  if (cleaned.includes('一个月') || cleaned.includes('1个月')) return 30
  if (cleaned.includes('半个月')) return 15
  if (cleaned.includes('一家三口')) return 3
  if (cleaned.includes('一家四口')) return 4
  
  // 简单的中文数字转换
  for (const [chinese, value] of Object.entries(chineseNumbers)) {
    if (cleaned.includes(chinese)) {
      // 处理"十"的特殊情况
      if (chinese === '十') {
        const beforeTen = cleaned.split('十')[0]
        const afterTen = cleaned.split('十')[1]
        let result = 10
        
        // 前面有数字，如"二十"
        if (beforeTen && chineseNumbers[beforeTen]) {
          result = chineseNumbers[beforeTen] * 10
        }
        // 后面有数字，如"十五"
        if (afterTen && chineseNumbers[afterTen]) {
          result += chineseNumbers[afterTen]
        }
        return result
      }
      
      // 处理"千"、"万"
      if (chinese === '千' || chinese === '万' || chinese === '百') {
        const beforeUnit = cleaned.split(chinese)[0]
        let multiplier = 1
        if (beforeUnit && chineseNumbers[beforeUnit]) {
          multiplier = chineseNumbers[beforeUnit]
        }
        return multiplier * value
      }
      
      return value
    }
  }
  
  return null
}

// 语音识别文本转日期的辅助函数
function parseVoiceToDate(text: string): string | null {
  const today = new Date()
  const cleaned = text.replace(/\s+/g, '').toLowerCase()
  
  // 处理相对日期
  if (cleaned.includes('今天') || cleaned.includes('今日')) {
    return formatDate(today)
  }
  
  if (cleaned.includes('明天') || cleaned.includes('明日')) {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return formatDate(tomorrow)
  }
  
  if (cleaned.includes('后天')) {
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    return formatDate(dayAfterTomorrow)
  }
  
  // 处理"下周一"等
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekdayMatch = cleaned.match(/下周([一二三四五六日])/)
  if (weekdayMatch) {
    const targetDay = weekdays.indexOf(weekdayMatch[1])
    const daysUntilNextWeek = 7 - today.getDay()
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysUntilNextWeek + targetDay)
    return formatDate(targetDate)
  }
  
  // 尝试匹配具体日期格式：YYYY年MM月DD日、YYYY-MM-DD等
  const datePatterns = [
    /(\d{4})年(\d{1,2})月(\d{1,2})日?/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    /(\d{4})\/(\d{1,2})\/(\d{1,2})/,
  ]
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      const year = parseInt(match[1], 10)
      const month = parseInt(match[2], 10) - 1
      const day = parseInt(match[3], 10)
      const date = new Date(year, month, day)
      if (!isNaN(date.getTime())) {
        return formatDate(date)
      }
    }
  }
  
  return null
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function Home() {
  const { data: session } = useSupabaseSession()
  const [formData, setFormData] = useState<TravelFormData>({
    destination: '',
    duration: '',
    travelers: '',
    budget: '',
    interests: '',
    startDate: '',
    specialRequests: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [travelPlan, setTravelPlan] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('auto')
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('zh')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [mapLocations, setMapLocations] = useState<Array<{ name: string; address: string; lng: number; lat: number }>>([])
  const [destinationCoords, setDestinationCoords] = useState<{ lng: number; lat: number } | null>(null)

  // 获取翻译文本
  const t = getTranslations(selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage)

  // 自动检测语言
  useEffect(() => {
    if (selectedLanguage === 'auto') {
      const detected = detectFormLanguage(formData)
      setDetectedLanguage(detected)
    }
  }, [formData, selectedLanguage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTravelPlan('')
    setSaved(false)

    // 确定最终使用的语言
    const finalLanguage = selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: finalLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error(t.errorTitle)
      }

      const data = await response.json()
      setTravelPlan(data.plan)
      
      // 生成计划后，自动获取目的地坐标并显示地图
      if (formData.destination) {
        fetchDestinationCoords(formData.destination)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorTitle)
    } finally {
      setLoading(false)
    }
  }

  // 获取目的地坐标
  const fetchDestinationCoords = async (destination: string) => {
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(destination)}`)
      const data = await response.json()

      if (data.success && data.location) {
        const coords = { lng: data.location.lng, lat: data.location.lat }
        setDestinationCoords(coords)
        setMapLocations([{
          name: destination,
          address: data.location.formattedAddress || destination,
          lng: coords.lng,
          lat: coords.lat,
        }])
        setShowMap(true)
        console.log('✅ 目的地坐标:', coords)
      } else {
        console.warn('⚠️ 未找到目的地坐标')
      }
    } catch (error) {
      console.error('❌ 获取坐标失败:', error)
    }
  }

  const handleSavePlan = async () => {
    if (!session) {
      setShowAuthModal(true)
      return
    }

    if (!travelPlan) {
      alert('请先生成旅行计划')
      return
    }

    setSaving(true)

    try {
      // 计算结束日期
      const endDate = new Date(formData.startDate)
      endDate.setDate(endDate.getDate() + parseInt(formData.duration) - 1)

      const response = await fetch('/api/travel-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${formData.destination} ${parseInt(formData.duration)}日游`,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: endDate.toISOString().split('T')[0],
          duration: parseInt(formData.duration),
          travelers: parseInt(formData.travelers),
          budget: parseFloat(formData.budget),
          interests: formData.interests,
          specialRequests: formData.specialRequests,
          plan: travelPlan,
          status: 'draft',
          language: selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSaved(true)
        // 保存计划 ID，用于费用管理的云端同步
        if (data.plan && data.plan.id) {
          setSavedPlanId(data.plan.id)
          console.log('✅ 旅行计划已保存，ID:', data.plan.id)
        }
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert(data.message || '保存失败')
      }
    } catch (error) {
      console.error('保存计划失败:', error)
      alert('保存失败，请稍后再试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t.appTitle}
                </h1>
                <p className="text-sm text-gray-600">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector
                currentLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
              <UserMenu onSignInClick={() => setShowAuthModal(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t.heroTitle}
          </h2>
          <p className="text-base text-gray-600">
            {t.heroDescription}
          </p>
        </div>
      </section>

      {/* Four Components Layout - 2x2 Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1600px] mx-auto">
          {/* Component 1: Map Navigation */}
          <Card className="shadow-xl border-2 border-blue-100 flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  🗺️ 地图导航
                </CardTitle>
                <Button
                  variant={showMap ? "default" : "outline"}
                  onClick={() => setShowMap(!showMap)}
                  size="sm"
                  className="h-8"
                >
                  {showMap ? '隐藏' : '显示'}
                </Button>
              </div>
              <CardDescription className="text-xs mt-1">
                搜索地点、规划路线
              </CardDescription>
            </CardHeader>
            {showMap && (
              <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
                <MapView
                  locations={mapLocations}
                  center={destinationCoords ? [destinationCoords.lng, destinationCoords.lat] : undefined}
                  zoom={12}
                  enableSearch={true}
                  enableNavigation={true}
                  className="h-full space-y-4"
                />
              </CardContent>
            )}
            {!showMap && (
              <CardContent className="pt-0 flex-1 flex items-center justify-center">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">点击&quot;显示&quot;查看地图</p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Component 2: Travel Plan Form */}
          <Card className="shadow-xl flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                {t.formTitle}
              </CardTitle>
              <CardDescription>
                {t.formDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t.destination} *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="destination"
                      name="destination"
                      placeholder={t.destinationPlaceholder}
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                      className="flex-1"
                    />
                    <VoiceInput
                      onTranscript={(text) => {
                        setFormData(prev => ({ ...prev, destination: text }))
                      }}
                      language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                      fieldName={t.destination}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t.startDate} *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="flex-1"
                      />
                      <VoiceInput
                        onTranscript={(text) => {
                          // 尝试解析日期文本，例如 "明天"、"下周一"、"2024年1月1日" 等
                          const parsedDate = parseVoiceToDate(text)
                          if (parsedDate) {
                            setFormData(prev => ({ ...prev, startDate: parsedDate }))
                          } else {
                            setFormData(prev => ({ ...prev, startDate: text }))
                          }
                        }}
                        language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                        fieldName={t.startDate}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      {t.duration} *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        placeholder={t.durationPlaceholder}
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="flex-1"
                      />
                      <VoiceInput
                        onTranscript={(text) => {
                          // 提取数字，例如 "三天"、"5天"、"一周" 等
                          const number = extractNumber(text)
                          if (number) {
                            setFormData(prev => ({ ...prev, duration: number.toString() }))
                          }
                        }}
                        language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                        fieldName={t.duration}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelers" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t.travelers} *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="travelers"
                        name="travelers"
                        type="number"
                        placeholder={t.travelersPlaceholder}
                        value={formData.travelers}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="flex-1"
                      />
                      <VoiceInput
                        onTranscript={(text) => {
                          // 提取数字，例如 "两个人"、"4人"、"一家三口" 等
                          const number = extractNumber(text)
                          if (number) {
                            setFormData(prev => ({ ...prev, travelers: number.toString() }))
                          }
                        }}
                        language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                        fieldName={t.travelers}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      {t.budget} *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        placeholder={t.budgetPlaceholder}
                        value={formData.budget}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="flex-1"
                      />
                      <VoiceInput
                        onTranscript={(text) => {
                          // 提取数字，例如 "五千元"、"10000"、"一万块" 等
                          const number = extractNumber(text)
                          if (number) {
                            setFormData(prev => ({ ...prev, budget: number.toString() }))
                          }
                        }}
                        language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                        fieldName={t.budget}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">
                    {t.interests} *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="interests"
                      name="interests"
                      placeholder={t.interestsPlaceholder}
                      value={formData.interests}
                      onChange={handleInputChange}
                      required
                      className="flex-1"
                    />
                    <VoiceInput
                      onTranscript={(text) => {
                        setFormData(prev => ({ ...prev, interests: text }))
                      }}
                      language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                      fieldName={t.interests}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">
                    {t.specialRequests}
                  </Label>
                  <div className="flex gap-2">
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      placeholder={t.specialRequestsPlaceholder}
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      className="flex-1"
                    />
                    <VoiceInput
                      onTranscript={(text) => {
                        setFormData(prev => ({
                          ...prev,
                          specialRequests: prev.specialRequests
                            ? `${prev.specialRequests} ${text}`
                            : text
                        }))
                      }}
                      language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                      fieldName={t.specialRequests}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t.generating}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {t.generateButton}
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Component 3: Travel Plan Result */}
          <Card className="shadow-xl flex flex-col h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plane className="h-5 w-5 text-purple-600" />
                {t.resultTitle}
              </CardTitle>
              <CardDescription className="text-xs">
                {t.resultDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
              {travelPlan ? (
                <div className="space-y-4 flex flex-col flex-1 min-h-0">
                  {/* Save Button */}
                  {session && (
                    <Button
                      onClick={handleSavePlan}
                      disabled={saving || saved}
                      className="w-full"
                      variant={saved ? "outline" : "default"}
                      size="sm"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          保存中...
                        </>
                      ) : saved ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          已保存
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          保存计划
                        </>
                      )}
                    </Button>
                  )}
                  <div className="flex-1 overflow-y-auto">
                    <TravelPlan plan={travelPlan} destination={formData.destination} showCard={false} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 flex-1">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full">
                    <Plane className="h-10 w-10 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {t.resultPlaceholder}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Component 4: Budget Manager */}
          <Card className="shadow-xl flex flex-col h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-green-600" />
                费用预算
              </CardTitle>
              <CardDescription className="text-xs">
                记录开销、AI分析
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
              {formData.budget && parseFloat(formData.budget) > 0 ? (
                <div className="flex-1 overflow-y-auto">
                  <BudgetManager
                    totalBudget={parseFloat(formData.budget)}
                    language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
                    travelPlanId={savedPlanId || undefined}
                    showCard={false}
                    translations={{
                      budgetTitle: t.budgetTitle,
                      budgetDescription: t.budgetDescription,
                      totalBudget: t.totalBudget,
                      spent: t.spent,
                      remaining: t.remaining,
                      addExpense: t.addExpense,
                      category: t.category,
                      amount: t.amount,
                      description: t.description,
                      categoryFood: t.categoryFood,
                      categoryTransport: t.categoryTransport,
                      categoryAccommodation: t.categoryAccommodation,
                      categoryActivity: t.categoryActivity,
                      categoryShopping: t.categoryShopping,
                      categoryOther: t.categoryOther,
                      noExpenses: t.noExpenses,
                      analyzeButton: t.analyzeButton,
                      analyzing: t.analyzing,
                      aiAnalysis: t.aiAnalysis,
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 flex-1">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 p-4 rounded-full">
                    <Wallet className="h-10 w-10 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">
                    填写预算后显示费用管理
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </main>
  )
}


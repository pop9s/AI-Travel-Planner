'use client'

import { useState, useEffect } from 'react'
import { Plane, MapPin, Calendar, Users, Wallet, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import TravelPlan from '@/components/TravelPlan'
import LanguageSelector from '@/components/LanguageSelector'
import VoiceInput from '@/components/VoiceInput'
import BudgetManager from '@/components/BudgetManager'
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
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorTitle)
    } finally {
      setLoading(false)
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
            <LanguageSelector
              currentLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            {t.heroTitle}
          </h2>
          <p className="text-lg text-gray-600">
            {t.heroDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                {t.formTitle}
              </CardTitle>
              <CardDescription>
                {t.formDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
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

          {/* Result Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            {travelPlan ? (
              <TravelPlan plan={travelPlan} destination={formData.destination} />
            ) : (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>{t.resultTitle}</CardTitle>
                  <CardDescription>
                    {t.resultDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full">
                      <Plane className="h-12 w-12 text-blue-600" />
                    </div>
                    <p className="text-gray-500 max-w-sm">
                      {t.resultPlaceholder}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Budget Manager Section */}
      {formData.budget && parseFloat(formData.budget) > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <BudgetManager
              totalBudget={parseFloat(formData.budget)}
              language={selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage}
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
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </main>
  )
}


'use client'

import { useState } from 'react'
import { Plane, MapPin, Calendar, Users, Wallet, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import TravelPlan from '@/components/TravelPlan'

interface TravelFormData {
  destination: string
  duration: string
  travelers: string
  budget: string
  interests: string
  startDate: string
  specialRequests: string
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTravelPlan('')

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('生成旅行计划失败')
      }

      const data = await response.json()
      setTravelPlan(data.plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Travel Planner
              </h1>
              <p className="text-sm text-gray-600">智能旅行规划助手</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            让AI为你规划完美旅程
          </h2>
          <p className="text-lg text-gray-600">
            只需告诉我们你的需求，AI将为你量身定制专属旅行计划
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
                填写旅行需求
              </CardTitle>
              <CardDescription>
                请填写以下信息,AI将为您生成个性化旅行计划
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    目的地 *
                  </Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="例如: 日本东京"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      出发日期 *
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      旅行天数 *
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      placeholder="例如: 7"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelers" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      旅行人数 *
                    </Label>
                    <Input
                      id="travelers"
                      name="travelers"
                      type="number"
                      placeholder="例如: 2"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      预算(CNY) *
                    </Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="例如: 10000"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">
                    兴趣爱好 *
                  </Label>
                  <Input
                    id="interests"
                    name="interests"
                    placeholder="例如: 美食、历史文化、自然风光"
                    value={formData.interests}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">
                    特殊要求
                  </Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="例如: 希望入住高评分酒店、需要无障碍设施、素食餐厅推荐等..."
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      AI正在生成规划中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      生成AI旅行计划
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
                  <CardTitle>你的专属旅行计划</CardTitle>
                  <CardDescription>
                    填写左侧表单后,AI将在这里生成详细的旅行计划
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full">
                      <Plane className="h-12 w-12 text-blue-600" />
                    </div>
                    <p className="text-gray-500 max-w-sm">
                      填写您的旅行偏好,让AI为您创建一个难忘的旅行体验
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Powered by AI • 让每一次旅行都成为美好回忆</p>
        </div>
      </footer>
    </main>
  )
}


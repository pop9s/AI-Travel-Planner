/**
 * 旅行计划详情页面
 */

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TravelPlan from '@/components/TravelPlan'
import { ArrowLeft, Calendar, Users, Wallet, MapPin, Loader2, Edit } from 'lucide-react'

interface PlanData {
  _id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  duration: number
  travelers: number
  budget: number
  interests: string
  specialRequests: string
  plan: string
  status: string
  createdAt: string
}

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const { status } = useSession()
  const router = useRouter()
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchPlan()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router, params.id])

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/travel-plans/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setPlan(data.plan)
      } else {
        alert('无法加载计划')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('获取计划详情失败:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回我的计划
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Plan Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{plan.title}</CardTitle>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{plan.destination}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">出发日期</p>
                    <p className="font-medium">{new Date(plan.startDate).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">旅行天数</p>
                    <p className="font-medium">{plan.duration} 天</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">同行人数</p>
                    <p className="font-medium">{plan.travelers} 人</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Wallet className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">预算</p>
                    <p className="font-medium">¥{plan.budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {plan.interests && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">旅行兴趣</p>
                  <p className="font-medium">{plan.interests}</p>
                </div>
              )}

              {plan.specialRequests && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">特殊要求</p>
                  <p className="font-medium">{plan.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Travel Plan Content */}
          <TravelPlan plan={plan.plan} destination={plan.destination} />
        </div>
      </main>
    </div>
  )
}


/**
 * 旅行计划详情页面
 */

'use client'

import { useEffect, useState } from 'react'
import { useSupabaseSession } from '@/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TravelPlan from '@/components/TravelPlan'
import MapView from '@/components/MapView'
import { ArrowLeft, Calendar, Users, Wallet, MapPin, Loader2, Edit, Map } from 'lucide-react'

interface PlanData {
  id: string // Supabase 使用 id
  title: string
  destination: string
  start_date: string // Supabase 蛇形命名
  end_date: string
  duration: number
  travelers: number
  budget: number
  interests: string
  special_requests: string
  plan: string
  status: string
  created_at: string // Supabase 蛇形命名
}

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const { status } = useSupabaseSession()
  const router = useRouter()
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([116.397428, 39.90923])
  const [destinationCoords, setDestinationCoords] = useState<{ lng: number; lat: number } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchPlan()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router, params.id])

  // 获取目的地坐标
  useEffect(() => {
    if (plan?.destination) {
      fetchDestinationCoords(plan.destination)
    }
  }, [plan?.destination])

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

  const fetchDestinationCoords = async (destination: string) => {
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(destination)}`)
      const data = await response.json()

      if (data.success && data.location) {
        const coords = { lng: data.location.lng, lat: data.location.lat }
        setDestinationCoords(coords)
        setMapCenter([coords.lng, coords.lat])
        console.log('✅ 目的地坐标:', coords)
      } else {
        console.warn('⚠️ 未找到目的地坐标，使用默认位置')
      }
    } catch (error) {
      console.error('❌ 获取坐标失败:', error)
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
                    <p className="font-medium">{new Date(plan.start_date).toLocaleDateString('zh-CN')}</p>
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

              {plan.special_requests && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">特殊要求</p>
                  <p className="font-medium">{plan.special_requests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map Toggle Button */}
          <div className="flex justify-end">
            <Button
              variant={showMap ? 'default' : 'outline'}
              onClick={() => setShowMap(!showMap)}
              className="gap-2"
            >
              <Map className="h-4 w-4" />
              {showMap ? '隐藏地图' : '显示地图'}
            </Button>
          </div>

          {/* Map View */}
          {showMap && (
            <MapView
              locations={
                destinationCoords
                  ? [
                      {
                        name: plan.destination,
                        address: plan.destination,
                        lng: destinationCoords.lng,
                        lat: destinationCoords.lat,
                        type: 'destination',
                      },
                    ]
                  : []
              }
              center={mapCenter}
              zoom={12}
              enableSearch={true}
              enableNavigation={true}
            />
          )}

          {/* Travel Plan Content */}
          <TravelPlan plan={plan.plan} destination={plan.destination} />
        </div>
      </main>
    </div>
  )
}


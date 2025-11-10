/**
 * 用户中心 - 我的旅行计划
 */

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plane, 
  Calendar, 
  Users, 
  Wallet, 
  MapPin, 
  Loader2, 
  Trash2,
  Eye,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  FileText
} from 'lucide-react'

interface TravelPlan {
  _id: string
  title: string
  destination: string
  startDate: string
  duration: number
  travelers: number
  budget: number
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchPlans()
    }
  }, [status, router])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/travel-plans')
      const data = await response.json()
      
      if (data.success) {
        setPlans(data.plans)
      }
    } catch (error) {
      console.error('获取计划失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('确定要删除这个旅行计划吗？')) return

    setDeleting(planId)
    try {
      const response = await fetch(`/api/travel-plans?id=${planId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPlans(plans.filter(p => p._id !== planId))
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请稍后再试')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { icon: FileText, text: '草稿', class: 'bg-gray-100 text-gray-700' },
      confirmed: { icon: CheckCircle2, text: '已确认', class: 'bg-blue-100 text-blue-700' },
      completed: { icon: CheckCircle2, text: '已完成', class: 'bg-green-100 text-green-700' },
      cancelled: { icon: XCircle, text: '已取消', class: 'bg-red-100 text-red-700' },
    }
    const badge = badges[status as keyof typeof badges]
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  我的旅行计划
                </h1>
                <p className="text-sm text-gray-600">管理您的所有旅行</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                创建新计划
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {plans.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full w-fit mx-auto mb-6">
                <Plane className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">还没有旅行计划</h3>
              <p className="text-gray-600 mb-6">开始规划您的第一次旅行吧！</p>
              <Link href="/">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  创建第一个计划
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan._id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    {getStatusBadge(plan.status)}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {plan.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(plan.startDate).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{plan.duration} 天</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{plan.travelers} 人</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Wallet className="h-4 w-4" />
                      <span>¥{plan.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Link href={`/dashboard/plans/${plan._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        查看
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan._id)}
                      disabled={deleting === plan._id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleting === plan._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}


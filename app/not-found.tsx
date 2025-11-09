import Link from 'next/link'
import { Home, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-full">
            <MapPin className="h-24 w-24 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">页面未找到</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            抱歉，您访问的页面不存在。让我们帮您回到正确的路线上。
          </p>
        </div>

        <Link href="/">
          <Button size="lg" className="mt-4">
            <Home className="mr-2 h-5 w-5" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  )
}


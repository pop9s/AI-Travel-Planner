'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-6 px-4 max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 p-8 rounded-full">
            <AlertTriangle className="h-24 w-24 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">出错了</h1>
          <p className="text-gray-600">
            应用程序遇到了一个错误。请尝试刷新页面。
          </p>
          {error.message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-mono">{error.message}</p>
            </div>
          )}
        </div>

        <Button onClick={reset} size="lg">
          <RefreshCcw className="mr-2 h-5 w-5" />
          重试
        </Button>
      </div>
    </div>
  )
}


'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  title?: string
}

export default function ErrorMessage({ message, title = '发生错误' }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">{title}</h3>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  )
}


'use client'

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ text = '加载中...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}


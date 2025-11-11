/**
 * 用户菜单组件
 */

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSupabaseSession } from '@/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, BookOpen, Settings, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserMenuProps {
  onSignInClick: () => void
}

export default function UserMenu({ onSignInClick }: UserMenuProps) {
  const { data: session, status } = useSupabaseSession()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setLoggingOut(true)
    try {
      // 关闭菜单
      setShowMenu(false)
      
      // 退出登录
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('退出登录失败:', error)
        setLoggingOut(false)
        alert('退出登录失败: ' + error.message)
        return
      }

      // 清除本地存储（Supabase 会自动清除，但为了确保，我们也手动清除）
      try {
        // Supabase 使用特定的 key 存储 session
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        sessionStorage.clear()
      } catch (e) {
        // 忽略清除存储的错误
        console.warn('清除存储时出错:', e)
      }
      
      // 使用完整页面刷新确保清除所有状态
      window.location.href = '/'
    } catch (error) {
      console.error('退出登录错误:', error)
      setLoggingOut(false)
      alert('退出登录时发生错误，请刷新页面')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!session || !session.user) {
    return (
      <Button onClick={onSignInClick} size="sm">
        <User className="h-4 w-4 mr-2" />
        登录
      </Button>
    )
  }

  const userName = session.user.name || session.user.email?.split('@')[0] || 'User'
  const userEmail = session.user.email || ''

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {userName[0]?.toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
            <div className="p-3 border-b bg-gray-50">
              <p className="font-medium text-sm">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            
            <div className="py-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <BookOpen className="h-4 w-4 text-gray-600" />
                <span className="text-sm">我的计划</span>
              </Link>
              
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="text-sm">设置</span>
              </Link>
            </div>

            <div className="border-t p-2">
              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-red-50 text-red-600 rounded transition-colors"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="text-sm">{loggingOut ? '退出中...' : '退出登录'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


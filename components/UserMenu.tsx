/**
 * 用户菜单组件
 */

'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, BookOpen, Settings, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserMenuProps {
  onSignInClick: () => void
}

export default function UserMenu({ onSignInClick }: UserMenuProps) {
  const { data: session, status } = useSession()
  const [showMenu, setShowMenu] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setLoggingOut(true)
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!session) {
    return (
      <Button onClick={onSignInClick} size="sm">
        <User className="h-4 w-4 mr-2" />
        登录
      </Button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {session.user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{session.user?.name}</p>
          <p className="text-xs text-gray-500">{session.user?.email}</p>
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
              <p className="font-medium text-sm">{session.user?.name}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
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


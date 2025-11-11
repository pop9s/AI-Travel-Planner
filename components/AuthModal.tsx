/**
 * 认证模态框组件（登录/注册）
 */

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, UserPlus, Loader2, X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    language: 'zh' as 'zh' | 'en' | 'ja' | 'ko',
  })

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message === 'Invalid login credentials' ? '邮箱或密码错误' : error.message)
        setLoading(false)
        return
      }

      if (data.user && data.session) {
        // 登录成功，等待认证状态更新
        // 使用 Promise 等待 onAuthStateChange 事件触发
        const waitForAuthState = new Promise<void>((resolve) => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
              subscription.unsubscribe()
              resolve()
            }
          })
          
          // 超时保护：如果 2 秒内没有触发事件，仍然继续
          setTimeout(() => {
            subscription.unsubscribe()
            resolve()
          }, 2000)
        })
        
        await waitForAuthState
        
        // 确保 session 已更新
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // 刷新页面以更新所有组件状态
          router.refresh()
          // 短暂延迟后关闭模态框，确保状态已更新
          setTimeout(() => {
            onClose()
          }, 200)
        } else {
          // Session 未更新，但仍然关闭模态框并刷新
          console.warn('Session 未更新，强制刷新')
          router.refresh()
          onClose()
        }
      } else {
        setError('登录失败，请稍后再试')
        setLoading(false)
      }
    } catch (err) {
      console.error('登录错误:', err)
      setError('登录失败，请稍后再试')
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError('该邮箱已被注册')
        } else {
          setError(error.message)
        }
        setLoading(false)
        return
      }

      if (data.user) {
        // 注册成功，Supabase 会自动登录
        // 等待认证状态更新
        const waitForAuthState = new Promise<void>((resolve) => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
              subscription.unsubscribe()
              resolve()
            }
          })
          
          // 超时保护
          setTimeout(() => {
            subscription.unsubscribe()
            resolve()
          }, 2000)
        })
        
        await waitForAuthState
        
        // 确保 session 已更新
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          router.refresh()
          setTimeout(() => {
            onClose()
          }, 200)
        } else {
          console.warn('Session 未更新，强制刷新')
          router.refresh()
          onClose()
        }
      }
    } catch (err) {
      console.error('注册错误:', err)
      setError('注册失败，请稍后再试')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md w-full mx-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {mode === 'signin' ? (
                    <>
                      <LogIn className="h-5 w-5" />
                      登录账户
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      注册账户
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {mode === 'signin'
                    ? '登录后可保存和管理您的旅行计划'
                    : '创建账户以保存您的旅行计划'}
                </CardDescription>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">用户名</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="请输入用户名"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={mode === 'signin' ? '请输入密码' : '至少6个字符'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'signin' ? '登录中...' : '注册中...'}
                  </>
                ) : (
                  <>
                    {mode === 'signin' ? (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        登录
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        注册
                      </>
                    )}
                  </>
                )}
              </Button>

              <div className="text-center text-sm">
                {mode === 'signin' ? (
                  <p>
                    还没有账户？{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      立即注册
                    </button>
                  </p>
                ) : (
                  <p>
                    已有账户？{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      立即登录
                    </button>
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


/**
 * Supabase 认证 Hooks
 */

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name: string
  language: string
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    // 获取当前用户
    const getUser = async () => {
      try {
        // 首先尝试获取 session（更快，不需要查询数据库）
        const { data: { session: authSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (sessionError) {
          console.error('获取 session 失败:', sessionError)
          setUser(null)
          setLoading(false)
          return
        }

        if (authSession?.user) {
          // 尝试获取用户资料（如果表存在），但不阻塞
          // 使用 metadata 作为默认值，然后异步更新
          const defaultUser = {
            id: authSession.user.id,
            email: authSession.user.email || '',
            name: authSession.user.user_metadata?.name || authSession.user.email?.split('@')[0] || 'User',
            language: authSession.user.user_metadata?.language || 'zh',
          }
          
          setUser(defaultUser)
          setLoading(false) // 先设置 loading 为 false，让 UI 显示
          
          // 异步尝试获取用户资料
          try {
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', authSession.user.id)
              .single()

            if (mounted && !profileError && profile) {
              const userProfile = profile as { name: string; language: string }
              setUser({
                id: authSession.user.id,
                email: authSession.user.email || '',
                name: userProfile.name,
                language: userProfile.language,
              })
            }
          } catch (profileErr) {
            // 忽略查询错误，使用 metadata
            console.warn('查询用户资料失败，使用 metadata')
          }
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('认证状态变化:', event, session ? '有 session' : '无 session')
        
        // 对于 SIGNED_IN 事件，立即更新状态
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // 有用户，先快速设置基本信息
            const defaultUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              language: session.user.user_metadata?.language || 'zh',
            }
            
            setUser(defaultUser)
            setLoading(false)
            
            // 异步尝试获取用户资料
            try {
              const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()

              if (mounted && !profileError && profile) {
                const userProfile = profile as { name: string; language: string }
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userProfile.name,
                  language: userProfile.language,
                })
              }
            } catch (profileErr) {
              // 忽略查询错误，使用 metadata
              console.warn('查询用户资料失败，使用 metadata')
            }
          }
        } else if (session?.user) {
          // 其他事件但有 session
          const defaultUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            language: session.user.user_metadata?.language || 'zh',
          }
          
          setUser(defaultUser)
          setLoading(false)
          
          // 异步尝试获取用户资料
          try {
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (mounted && !profileError && profile) {
              const userProfile = profile as { name: string; language: string }
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: userProfile.name,
                language: userProfile.language,
              })
            }
          } catch (profileErr) {
            console.warn('查询用户资料失败，使用 metadata')
          }
        } else {
          // 没有 session，清除用户信息
          console.log('清除用户信息')
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

export function useSupabaseSession() {
  const { user, loading } = useSupabaseAuth()
  const [timeoutReached, setTimeoutReached] = useState(false)

  // 添加超时机制，防止无限加载
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('⚠️ 认证状态加载超时（2秒），显示登录按钮')
        setTimeoutReached(true)
      }, 2000) // 2秒超时，更快响应

      return () => clearTimeout(timer)
    } else {
      setTimeoutReached(false)
    }
  }, [loading])

  // 如果超时或加载完成，显示相应状态
  // 超时后强制显示未登录状态，让用户可以看到登录按钮
  const effectiveLoading = loading && !timeoutReached
  const effectiveUser = timeoutReached ? null : user

  return {
    data: effectiveUser ? { user: effectiveUser } : null,
    status: effectiveLoading ? 'loading' : effectiveUser ? 'authenticated' : 'unauthenticated',
  }
}


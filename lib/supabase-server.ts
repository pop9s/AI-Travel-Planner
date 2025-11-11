/**
 * Supabase 服务器端辅助函数
 */

import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 在某些情况下 set 可能会失败（比如在 Server Component 中）
            // 这是预期行为，可以忽略
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 同上
          }
        },
      },
    }
  )
}

export async function getSupabaseUser() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('服务器端获取用户失败:', error.message)
      return null
    }
    
    if (!user) {
      console.log('服务器端：无用户 session')
      return null
    }
    
    console.log('服务器端：获取到用户', user.id, user.email)
    return user
  } catch (error) {
    console.error('服务器端 Supabase 认证错误:', error)
    return null
  }
}


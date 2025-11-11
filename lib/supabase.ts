/**
 * Supabase 客户端配置
 * 使用 @supabase/ssr 包来确保 cookies 正确设置
 */

'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// 提供默认值以避免构建时错误
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if (typeof window !== 'undefined') {
  // 只在客户端检查
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL 未配置')
  } else {
    console.log('✅ Supabase URL 已配置:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...')
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY 未配置')
  } else {
    console.log('✅ Supabase Anon Key 已配置')
  }
}

// 创建 Supabase 客户端（客户端使用）
// 使用 createBrowserClient 确保 cookies 正确设置
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)


/**
 * Supabase 数据库类型定义
 * 这些类型由 Supabase CLI 自动生成或手动定义
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string | null
          language: 'zh' | 'en' | 'ja' | 'ko'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar?: string | null
          language?: 'zh' | 'en' | 'ja' | 'ko'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar?: string | null
          language?: 'zh' | 'en' | 'ja' | 'ko'
          created_at?: string
          updated_at?: string
        }
      }
      travel_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          duration: number
          travelers: number
          budget: number
          interests: string
          special_requests: string | null
          plan: string
          status: 'draft' | 'confirmed' | 'completed' | 'cancelled'
          language: 'zh' | 'en' | 'ja' | 'ko'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          duration: number
          travelers: number
          budget: number
          interests: string
          special_requests?: string | null
          plan: string
          status?: 'draft' | 'confirmed' | 'completed' | 'cancelled'
          language?: 'zh' | 'en' | 'ja' | 'ko'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          destination?: string
          start_date?: string
          end_date?: string
          duration?: number
          travelers?: number
          budget?: number
          interests?: string
          special_requests?: string | null
          plan?: string
          status?: 'draft' | 'confirmed' | 'completed' | 'cancelled'
          language?: 'zh' | 'en' | 'ja' | 'ko'
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          travel_plan_id: string | null
          category: 'food' | 'transport' | 'accommodation' | 'activity' | 'shopping' | 'other'
          amount: number
          currency: string
          description: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          travel_plan_id?: string | null
          category: 'food' | 'transport' | 'accommodation' | 'activity' | 'shopping' | 'other'
          amount: number
          currency?: string
          description: string
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          travel_plan_id?: string | null
          category?: 'food' | 'transport' | 'accommodation' | 'activity' | 'shopping' | 'other'
          amount?: number
          currency?: string
          description?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}


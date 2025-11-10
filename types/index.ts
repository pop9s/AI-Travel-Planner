/**
 * 全局类型定义
 */

import { Document, Types } from 'mongoose'

// ==================== 用户相关类型 ====================

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  name: string
  avatar?: string
  language: 'zh' | 'en' | 'ja' | 'ko'
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

export interface UserPreferences {
  language: 'zh' | 'en' | 'ja' | 'ko'
  currency: string
  theme: 'light' | 'dark'
  notifications: boolean
}

// ==================== 旅行计划相关类型 ====================

export interface ITravelPlan extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  title: string
  destination: string
  startDate: Date
  endDate: string
  duration: number
  travelers: number
  budget: number
  interests: string
  specialRequests?: string
  plan: string // AI 生成的旅行计划（Markdown 格式）
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled'
  language: 'zh' | 'en' | 'ja' | 'ko'
  createdAt: Date
  updatedAt: Date
}

export interface TravelPlanFormData {
  destination: string
  startDate: string
  duration: string
  travelers: string
  budget: string
  interests: string
  specialRequests: string
}

// ==================== 费用记录相关类型 ====================

export interface IExpense extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  travelPlanId?: Types.ObjectId
  category: 'food' | 'transport' | 'accommodation' | 'activity' | 'shopping' | 'other'
  amount: number
  currency: string
  description: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseFormData {
  category: string
  amount: string
  description: string
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
    language: string
  }
}

export interface TravelPlanResponse {
  success: boolean
  message?: string
  plan?: ITravelPlan
  plans?: ITravelPlan[]
}

export interface ExpenseResponse {
  success: boolean
  message?: string
  expense?: IExpense
  expenses?: IExpense[]
  total?: number
}

// ==================== Session 类型 ====================

export interface SessionUser {
  id: string
  email: string
  name: string
  language: string
}

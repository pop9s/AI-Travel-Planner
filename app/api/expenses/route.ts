/**
 * 费用记录 API - 使用 Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSupabaseUser } from '@/lib/supabase-server'
import { z } from 'zod'

// 创建费用记录验证
const createExpenseSchema = z.object({
  travel_plan_id: z.string().optional().nullable(),
  category: z.enum(['food', 'transport', 'accommodation', 'activity', 'shopping', 'other']),
  amount: z.number().min(0, '金额不能为负数'),
  currency: z.string().default('CNY'),
  description: z.string().min(1, '描述不能为空').max(500, '描述不能超过500个字符'),
  date: z.string().optional(),
})

/**
 * GET - 获取用户的费用记录
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSupabaseUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      )
    }

    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const travelPlanId = searchParams.get('travelPlanId')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = parseInt(searchParams.get('skip') || '0')

    // 构建查询
    let query = supabase
      .from('expenses')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .range(skip, skip + limit - 1)

    if (travelPlanId) {
      query = query.eq('travel_plan_id', travelPlanId)
    }
    if (category) {
      query = query.eq('category', category)
    }

    const { data: expenses, error, count } = await query

    if (error) {
      throw error
    }

    // 计算总金额
    const totalAmount = (expenses || []).reduce((sum, expense) => sum + expense.amount, 0)

    return NextResponse.json({
      success: true,
      expenses: expenses || [],
      total: count || 0,
      totalAmount,
      limit,
      skip,
    })
  } catch (error) {
    console.error('获取费用记录错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取费用记录失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

/**
 * POST - 创建新的费用记录
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSupabaseUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // 验证请求数据
    const validationResult = createExpenseSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: '输入数据验证失败',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // 创建费用记录
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        ...validationResult.data,
        date: validationResult.data.date || new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        message: '费用记录已保存',
        expense,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('创建费用记录错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '保存费用记录失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE - 删除费用记录
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSupabaseUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const expenseId = searchParams.get('id')

    if (!expenseId) {
      return NextResponse.json(
        { success: false, message: '缺少费用ID' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '费用记录已删除',
    })
  } catch (error) {
    console.error('删除费用记录错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '删除费用记录失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

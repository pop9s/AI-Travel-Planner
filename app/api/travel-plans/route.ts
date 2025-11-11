/**
 * 旅行计划 CRUD API (使用 Supabase)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSupabaseUser } from '@/lib/supabase-server'
import { z } from 'zod'

// 创建旅行计划验证
const createPlanSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200个字符'),
  destination: z.string().min(1, '目的地不能为空'),
  startDate: z.string(),
  endDate: z.string(),
  duration: z.number().min(1, '旅行天数至少为1天'),
  travelers: z.number().min(1, '同行人数至少为1人'),
  budget: z.number().min(0, '预算不能为负数'),
  interests: z.string().min(1, '旅行兴趣不能为空'),
  specialRequests: z.string().optional(),
  plan: z.string().min(1, '旅行计划内容不能为空'),
  status: z.enum(['draft', 'confirmed', 'completed', 'cancelled']).optional(),
  language: z.enum(['zh', 'en', 'ja', 'ko']).optional(),
})

/**
 * GET - 获取用户的所有旅行计划
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
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    // 构建查询
    let query = supabase
      .from('travel_plans')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: plans, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      plans: plans || [],
      total: count || 0,
      limit,
      skip,
    })
  } catch (error) {
    console.error('获取旅行计划错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取旅行计划失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

/**
 * POST - 创建新的旅行计划
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
    const validationResult = createPlanSchema.safeParse(body)
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

    // 转换字段名：驼峰 -> 蛇形
    const planData = {
      user_id: user.id,
      title: validationResult.data.title,
      destination: validationResult.data.destination,
      start_date: validationResult.data.startDate,
      end_date: validationResult.data.endDate,
      duration: validationResult.data.duration,
      travelers: validationResult.data.travelers,
      budget: validationResult.data.budget,
      interests: validationResult.data.interests,
      special_requests: validationResult.data.specialRequests || null,
      plan: validationResult.data.plan,
      status: validationResult.data.status || 'draft',
      language: validationResult.data.language || 'zh',
    }

    console.log('准备插入数据库:', planData)

    // 创建旅行计划
    const { data: plan, error } = await supabase
      .from('travel_plans')
      .insert(planData)
      .select()
      .single()

    if (error) {
      console.error('数据库插入错误:', error)
      throw error
    }

    console.log('保存成功:', plan)

    return NextResponse.json(
      {
        success: true,
        message: '旅行计划已保存',
        plan,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('创建旅行计划错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '保存旅行计划失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE - 删除旅行计划
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
    const planId = searchParams.get('id')

    if (!planId) {
      return NextResponse.json(
        { success: false, message: '缺少计划ID' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from('travel_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '旅行计划已删除',
    })
  } catch (error) {
    console.error('删除旅行计划错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '删除旅行计划失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}


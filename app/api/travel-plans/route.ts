/**
 * 旅行计划 CRUD API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import TravelPlan from '@/models/TravelPlan'
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    // 构建查询条件
    const query: { userId: string; status?: string } = {
      userId: session.user.id,
    }
    if (status) {
      query.status = status
    }

    const plans = await TravelPlan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await TravelPlan.countDocuments(query)

    return NextResponse.json({
      success: true,
      plans,
      total,
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
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

    await connectDB()

    // 创建旅行计划
    const plan = await TravelPlan.create({
      userId: session.user.id,
      ...validationResult.data,
    })

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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
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

    await connectDB()

    const plan = await TravelPlan.findOneAndDelete({
      _id: planId,
      userId: session.user.id,
    })

    if (!plan) {
      return NextResponse.json(
        { success: false, message: '计划不存在或无权删除' },
        { status: 404 }
      )
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


/**
 * 单个旅行计划 API (获取详情、更新)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import TravelPlan from '@/models/TravelPlan'
import { z } from 'zod'

// 更新旅行计划验证
const updatePlanSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  destination: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.number().min(1).optional(),
  travelers: z.number().min(1).optional(),
  budget: z.number().min(0).optional(),
  interests: z.string().min(1).optional(),
  specialRequests: z.string().optional(),
  plan: z.string().optional(),
  status: z.enum(['draft', 'confirmed', 'completed', 'cancelled']).optional(),
})

/**
 * GET - 获取单个旅行计划详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      )
    }

    await connectDB()

    const plan = await TravelPlan.findOne({
      _id: params.id,
      userId: session.user.id,
    }).lean()

    if (!plan) {
      return NextResponse.json(
        { success: false, message: '计划不存在或无权访问' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      plan,
    })
  } catch (error) {
    console.error('获取旅行计划详情错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取计划详情失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH - 更新旅行计划
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validationResult = updatePlanSchema.safeParse(body)
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

    const plan = await TravelPlan.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      { $set: validationResult.data },
      { new: true, runValidators: true }
    )

    if (!plan) {
      return NextResponse.json(
        { success: false, message: '计划不存在或无权修改' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '旅行计划已更新',
      plan,
    })
  } catch (error) {
    console.error('更新旅行计划错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '更新计划失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}


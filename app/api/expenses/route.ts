/**
 * 费用记录 API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Expense from '@/models/Expense'
import { z } from 'zod'

// 创建费用记录验证
const createExpenseSchema = z.object({
  travelPlanId: z.string().optional(),
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const travelPlanId = searchParams.get('travelPlanId')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = parseInt(searchParams.get('skip') || '0')

    // 构建查询条件
    const query: {
      userId: string
      travelPlanId?: string
      category?: string
    } = {
      userId: session.user.id,
    }
    if (travelPlanId) {
      query.travelPlanId = travelPlanId
    }
    if (category) {
      query.category = category
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Expense.countDocuments(query)

    // 计算总金额
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    return NextResponse.json({
      success: true,
      expenses,
      total,
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
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

    await connectDB()

    // 创建费用记录
    const expense = await Expense.create({
      userId: session.user.id,
      ...validationResult.data,
      date: validationResult.data.date ? new Date(validationResult.data.date) : new Date(),
    })

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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
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

    await connectDB()

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId: session.user.id,
    })

    if (!expense) {
      return NextResponse.json(
        { success: false, message: '费用记录不存在或无权删除' },
        { status: 404 }
      )
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


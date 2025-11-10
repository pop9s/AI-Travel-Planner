/**
 * 用户注册 API
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { z } from 'zod'

// 注册表单验证
const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  name: z.string().min(2, '用户名至少需要2个字符').max(50, '用户名不能超过50个字符'),
  language: z.enum(['zh', 'en', 'ja', 'ko']).optional().default('zh'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validationResult = registerSchema.safeParse(body)
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

    const { email, password, name, language } = validationResult.data

    // 连接数据库
    await connectDB()

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: '该邮箱已被注册',
        },
        { status: 409 }
      )
    }

    // 创建新用户
    const user = await User.create({
      email,
      password,
      name,
      language,
    })

    return NextResponse.json(
      {
        success: true,
        message: '注册成功',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          language: user.language,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '注册失败，请稍后再试',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}


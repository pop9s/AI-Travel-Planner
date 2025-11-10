/**
 * 用户数据模型
 */

import mongoose, { Schema, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '@/types'

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, '邮箱地址必填'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址'],
    },
    password: {
      type: String,
      required: [true, '密码必填'],
      minlength: [6, '密码至少需要6个字符'],
      select: false, // 默认不返回密码字段
    },
    name: {
      type: String,
      required: [true, '用户名必填'],
      trim: true,
      minlength: [2, '用户名至少需要2个字符'],
      maxlength: [50, '用户名不能超过50个字符'],
    },
    avatar: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['zh', 'en', 'ja', 'ko'],
      default: 'zh',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = ret
        return rest
      },
    },
  }
)

// 保存前加密密码
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: unknown) {
    next(error as Error)
  }
})

// 验证密码的方法
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

// 索引优化
UserSchema.index({ email: 1 })
UserSchema.index({ createdAt: -1 })

// 避免重复编译模型
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User


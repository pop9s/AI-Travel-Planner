/**
 * 费用记录数据模型
 */

import mongoose, { Schema, Model } from 'mongoose'
import { IExpense } from '@/types'

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '用户ID必填'],
      index: true,
    },
    travelPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'TravelPlan',
      index: true,
    },
    category: {
      type: String,
      required: [true, '费用类别必填'],
      enum: ['food', 'transport', 'accommodation', 'activity', 'shopping', 'other'],
    },
    amount: {
      type: Number,
      required: [true, '金额必填'],
      min: [0, '金额不能为负数'],
    },
    currency: {
      type: String,
      default: 'CNY',
      uppercase: true,
    },
    description: {
      type: String,
      required: [true, '描述必填'],
      trim: true,
      maxlength: [500, '描述不能超过500个字符'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// 索引优化
ExpenseSchema.index({ userId: 1, date: -1 })
ExpenseSchema.index({ userId: 1, travelPlanId: 1 })
ExpenseSchema.index({ userId: 1, category: 1 })

// 避免重复编译模型
const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema)

export default Expense


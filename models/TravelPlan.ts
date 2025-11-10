/**
 * 旅行计划数据模型
 */

import mongoose, { Schema, Model } from 'mongoose'
import { ITravelPlan } from '@/types'

const TravelPlanSchema = new Schema<ITravelPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '用户ID必填'],
      index: true,
    },
    title: {
      type: String,
      required: [true, '标题必填'],
      trim: true,
      maxlength: [200, '标题不能超过200个字符'],
    },
    destination: {
      type: String,
      required: [true, '目的地必填'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, '出发日期必填'],
    },
    endDate: {
      type: String,
      required: [true, '结束日期必填'],
    },
    duration: {
      type: Number,
      required: [true, '旅行天数必填'],
      min: [1, '旅行天数至少为1天'],
    },
    travelers: {
      type: Number,
      required: [true, '同行人数必填'],
      min: [1, '同行人数至少为1人'],
    },
    budget: {
      type: Number,
      required: [true, '预算必填'],
      min: [0, '预算不能为负数'],
    },
    interests: {
      type: String,
      required: [true, '旅行兴趣必填'],
      trim: true,
    },
    specialRequests: {
      type: String,
      default: '',
      trim: true,
    },
    plan: {
      type: String,
      required: [true, '旅行计划内容必填'],
    },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'completed', 'cancelled'],
      default: 'draft',
    },
    language: {
      type: String,
      enum: ['zh', 'en', 'ja', 'ko'],
      default: 'zh',
    },
  },
  {
    timestamps: true,
  }
)

// 索引优化
TravelPlanSchema.index({ userId: 1, createdAt: -1 })
TravelPlanSchema.index({ userId: 1, status: 1 })
TravelPlanSchema.index({ startDate: 1 })

// 避免重复编译模型
const TravelPlan: Model<ITravelPlan> =
  mongoose.models.TravelPlan ||
  mongoose.model<ITravelPlan>('TravelPlan', TravelPlanSchema)

export default TravelPlan


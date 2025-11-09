import { NextRequest, NextResponse } from 'next/server'

// 通义千问 API 配置
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || ''
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

interface TravelRequest {
  destination: string
  duration: string
  travelers: string
  budget: string
  interests: string
  startDate: string
  specialRequests?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TravelRequest = await request.json()
    
    const { destination, duration, travelers, budget, interests, startDate, specialRequests } = body

    // Validate required fields
    if (!destination || !duration || !travelers || !budget || !interests || !startDate) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // Create the prompt for AI
    const systemPrompt = '你是一位经验丰富、热情专业的AI旅行规划师。你精通世界各地的旅游信息，擅长根据旅客的需求和预算制定个性化的旅行计划。你的建议总是实用、详细且富有创意。'
    
    const userPrompt = `请根据以下信息为旅客制定一个详细、实用且个性化的旅行计划：

目的地: ${destination}
出发日期: ${startDate}
旅行天数: ${duration}天
旅行人数: ${travelers}人
预算: ¥${budget} CNY
兴趣爱好: ${interests}
${specialRequests ? `特殊要求: ${specialRequests}` : ''}

请提供一个包含以下内容的详细旅行计划：

1. **行程概览**
   - 旅行亮点和推荐理由
   - 最佳旅行时间说明

2. **详细每日行程** (Day 1 到 Day ${duration})
   为每一天提供：
   - 上午活动和景点
   - 午餐推荐（包含餐厅名称和特色菜）
   - 下午活动和景点
   - 晚餐推荐
   - 住宿建议（酒店名称和大致价格区间）
   - 每日预算估算

3. **实用信息**
   - 交通方式建议（往返和当地交通）
   - 当地特色美食推荐
   - 必备物品清单
   - 文化禁忌和注意事项
   - 紧急联系方式

4. **预算分解**
   - 交通费用
   - 住宿费用
   - 餐饮费用
   - 门票和活动费用
   - 购物和其他预留

5. **贴心提示**
   - 省钱小技巧
   - 最佳拍照地点
   - 避开人群的时间建议

请确保计划切实可行，符合预算，并充分考虑旅客的兴趣爱好和特殊要求。用友好、专业的语气撰写。`

    // Call 通义千问 API
    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo', // qwen-turbo (更快 3-8秒), qwen-plus (平衡 8-15秒), qwen-max (最强 15-30秒)
        input: {
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ]
        },
        parameters: {
          result_format: 'message',
          temperature: 0.8,
          max_tokens: 2500, // 减少到 2500 提升速度
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `通义千问 API 调用失败: ${response.status}`)
    }

    const data = await response.json()
    const plan = data.output?.choices?.[0]?.message?.content || '无法生成旅行计划，请重试。'

    return NextResponse.json({ plan })
  } catch (error: any) {
    console.error('Error generating travel plan:', error)
    
    // Handle specific API errors
    if (error.message?.includes('401') || error.message?.includes('invalid_api_key')) {
      return NextResponse.json(
        { error: '通义千问 API密钥无效，请检查配置' },
        { status: 500 }
      )
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return NextResponse.json(
        { error: 'API配额不足，请稍后再试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: error.message || '生成旅行计划时发生错误，请检查API密钥配置' },
      { status: 500 }
    )
  }
}


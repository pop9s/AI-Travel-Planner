import { NextRequest, NextResponse } from 'next/server'
import { Language, getLanguagePromptPrefix } from '@/lib/languageDetection'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
}

interface RequestBody {
  totalBudget: number
  expenses: Expense[]
  language: Language
}

const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { totalBudget, expenses, language } = body

    const apiKey = process.env.DASHSCOPE_API_KEY

    if (!apiKey) {
      console.error('DASHSCOPE_API_KEY is not set')
      return NextResponse.json(
        { error: 'No API-key provided.' },
        { status: 500 }
      )
    }

    // 计算支出统计
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const remaining = totalBudget - totalSpent
    const spentPercentage = (totalSpent / totalBudget) * 100

    // 按类别统计
    const categoryStats: Record<string, { count: number; total: number }> = {}
    expenses.forEach(exp => {
      if (!categoryStats[exp.category]) {
        categoryStats[exp.category] = { count: 0, total: 0 }
      }
      categoryStats[exp.category].count++
      categoryStats[exp.category].total += exp.amount
    })

    // 构建分析提示词
    const languagePrefix = getLanguagePromptPrefix(language)
    const categoryStatsText = Object.entries(categoryStats)
      .map(([category, stats]) => `${category}: ¥${stats.total} (${stats.count}笔)`)
      .join('\n')

    const expenseDetails = expenses
      .slice(-5) // 最近5条
      .map(exp => `- ${exp.category}: ¥${exp.amount} ${exp.description ? `(${exp.description})` : ''}`)
      .join('\n')

    const prompt = `${languagePrefix}

你是一个专业的旅行预算顾问。请分析以下旅行预算使用情况：

**预算总额**: ¥${totalBudget}
**已花费**: ¥${totalSpent} (${spentPercentage.toFixed(1)}%)
**剩余**: ¥${remaining}

**各类别支出统计**:
${categoryStatsText}

**最近支出记录**:
${expenseDetails}

请提供以下分析：
1. 当前预算使用情况评估
2. 各类别支出是否合理
3. 是否存在超支风险
4. 建议如何优化剩余预算
5. 具体的节省开支建议

请用简洁、实用的语言给出建议。`

    // 调用通义千问 API
    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的旅行预算顾问，擅长分析旅行开销并提供实用的建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Tongyi Qianwen API error:', errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || '分析失败'

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error in budget analysis:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '分析失败' },
      { status: 500 }
    )
  }
}


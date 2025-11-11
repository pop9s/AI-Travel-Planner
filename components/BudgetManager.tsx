'use client'

import { useState, useEffect } from 'react'
import { useSupabaseSession } from '@/hooks/useSupabaseAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wallet, Plus, Trash2, TrendingUp, TrendingDown, Loader2, Sparkles, Cloud, CloudOff } from 'lucide-react'
import VoiceInput from '@/components/VoiceInput'
import { Language } from '@/lib/languageDetection'

export interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
}

interface BudgetManagerProps {
  totalBudget: number
  language: Language
  travelPlanId?: string
  showCard?: boolean // 是否显示外层 Card
  translations: {
    budgetTitle: string
    budgetDescription: string
    totalBudget: string
    spent: string
    remaining: string
    addExpense: string
    category: string
    amount: string
    description: string
    categoryFood: string
    categoryTransport: string
    categoryAccommodation: string
    categoryActivity: string
    categoryShopping: string
    categoryOther: string
    noExpenses: string
    analyzeButton: string
    analyzing: string
    aiAnalysis: string
  }
}

export default function BudgetManager({ totalBudget, language, travelPlanId, showCard = true, translations: t }: BudgetManagerProps) {
  const { data: session } = useSupabaseSession()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({
    category: 'food',
    amount: '',
    description: '',
  })
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [analyzing, setAnalyzing] = useState(false)
  const [cloudSync, setCloudSync] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // 加载云端费用记录
  useEffect(() => {
    if (session && travelPlanId) {
      fetchExpenses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, travelPlanId])

  const fetchExpenses = async () => {
    if (!session) return

    setSyncing(true)
    try {
      const url = travelPlanId 
        ? `/api/expenses?travelPlanId=${travelPlanId}`
        : '/api/expenses'
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.success && data.expenses) {
        // Supabase 返回的字段名
        setExpenses(data.expenses.map((exp: {
          id: string
          category: string
          amount: number
          description: string
          date: string
        }) => ({
          id: exp.id,
          category: exp.category,
          amount: exp.amount,
          description: exp.description,
          date: exp.date,
        })))
        setCloudSync(true)
        console.log('✅ 成功从云端加载', data.expenses.length, '条费用记录')
      }
    } catch (error) {
      console.error('❌ 加载费用记录失败:', error)
      setCloudSync(false)
    } finally {
      setSyncing(false)
    }
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = totalBudget - totalSpent
  const spentPercentage = (totalSpent / totalBudget) * 100

  const handleAddExpense = async () => {
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) return

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date().toISOString(),
    }

    // 如果用户已登录，同步到云端
    if (session) {
      try {
        setSyncing(true)
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            travel_plan_id: travelPlanId || null, // 使用蛇形命名
            category: expense.category,
            amount: expense.amount,
            description: expense.description,
            date: expense.date,
          }),
        })

        const data = await response.json()
        if (data.success && data.expense) {
          expense.id = data.expense.id // Supabase 返回 id 而不是 _id
          setCloudSync(true)
          console.log('✅ 费用已保存到云端:', expense.description)
        } else {
          console.error('❌ 保存费用失败:', data.message)
        }
      } catch (error) {
        console.error('❌ 保存费用失败:', error)
      } finally {
        setSyncing(false)
      }
    }

    setExpenses([...expenses, expense])
    setNewExpense({ category: 'food', amount: '', description: '' })
    setAiAnalysis('') // 清除旧的分析
  }

  const handleDeleteExpense = async (id: string) => {
    // 如果用户已登录，从云端删除
    if (session && cloudSync) {
      try {
        setSyncing(true)
        const response = await fetch(`/api/expenses?id=${id}`, {
          method: 'DELETE',
        })
        const data = await response.json()
        if (data.success) {
          console.log('✅ 费用已从云端删除')
        } else {
          console.error('❌ 删除费用失败:', data.message)
        }
      } catch (error) {
        console.error('❌ 删除费用失败:', error)
      } finally {
        setSyncing(false)
      }
    }

    setExpenses(expenses.filter(exp => exp.id !== id))
    setAiAnalysis('') // 清除旧的分析
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const response = await fetch('/api/budget-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalBudget,
          expenses,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze budget')
      }

      const data = await response.json()
      setAiAnalysis(data.analysis)
    } catch (error) {
      console.error('Error analyzing budget:', error)
      setAiAnalysis('分析失败，请稍后重试。')
    } finally {
      setAnalyzing(false)
    }
  }

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      food: t.categoryFood,
      transport: t.categoryTransport,
      accommodation: t.categoryAccommodation,
      activity: t.categoryActivity,
      shopping: t.categoryShopping,
      other: t.categoryOther,
    }
    return categoryMap[category] || category
  }

  const content = (
    <div className="space-y-6">
        {/* 预算概览 */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">{t.totalBudget}</div>
              <div className="text-2xl font-bold text-blue-600">¥{totalBudget.toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600">{t.spent}</div>
              <div className="text-2xl font-bold text-red-600">¥{totalSpent.toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">{t.remaining}</div>
              <div className="text-2xl font-bold text-green-600">¥{remaining.toLocaleString()}</div>
            </div>
          </div>

          {/* 预算进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>预算使用情况</span>
              <span className={spentPercentage > 100 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                {spentPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  spentPercentage > 100
                    ? 'bg-red-500'
                    : spentPercentage > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
            {spentPercentage > 100 && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <TrendingDown className="h-4 w-4" />
                <span>预算超支 ¥{(totalSpent - totalBudget).toLocaleString()}</span>
              </div>
            )}
            {spentPercentage > 80 && spentPercentage <= 100 && (
              <div className="flex items-center gap-2 text-yellow-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>预算即将用完</span>
              </div>
            )}
          </div>
        </div>

        {/* 添加费用 */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">{t.addExpense}</h3>
          
          <div className="space-y-2">
            <Label htmlFor="category">{t.category}</Label>
            <Select
              value={newExpense.category}
              onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">{t.categoryFood}</SelectItem>
                <SelectItem value="transport">{t.categoryTransport}</SelectItem>
                <SelectItem value="accommodation">{t.categoryAccommodation}</SelectItem>
                <SelectItem value="activity">{t.categoryActivity}</SelectItem>
                <SelectItem value="shopping">{t.categoryShopping}</SelectItem>
                <SelectItem value="other">{t.categoryOther}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-amount">{t.amount}</Label>
            <div className="flex gap-2">
              <Input
                id="expense-amount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="flex-1"
                min="0"
                step="0.01"
              />
              <VoiceInput
                onTranscript={(text) => {
                  const number = extractNumber(text)
                  if (number) {
                    setNewExpense({ ...newExpense, amount: number.toString() })
                  }
                }}
                language={language}
                fieldName={t.amount}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description">{t.description}</Label>
            <div className="flex gap-2">
              <Input
                id="expense-description"
                placeholder={t.description}
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="flex-1"
              />
              <VoiceInput
                onTranscript={(text) => {
                  setNewExpense({ ...newExpense, description: text })
                }}
                language={language}
                fieldName={t.description}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleAddExpense} 
              className="w-full" 
              disabled={!newExpense.amount || syncing}
              size="lg"
            >
              {syncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {session ? '添加并保存到云端' : t.addExpense}
                </>
              )}
            </Button>
            {session && !syncing && (
              <p className="text-xs text-center text-gray-500">
                💾 费用将自动保存到云端，可在多设备查看
              </p>
            )}
            {!session && (
              <p className="text-xs text-center text-gray-500">
                💡 登录后费用将自动同步到云端
              </p>
            )}
          </div>
        </div>

        {/* 费用列表 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📋 已记录的费用
              {expenses.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({expenses.length} 条)
                </span>
              )}
            </h3>
            {session && expenses.length > 0 && (
              <div className="text-xs text-gray-500">
                {cloudSync ? '✅ 已保存到云端' : '💾 本地存储'}
              </div>
            )}
          </div>
          
          {expenses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-2">💸</div>
              <p className="text-gray-600 font-medium mb-1">还没有费用记录</p>
              <p className="text-sm text-gray-500">添加您的第一笔费用开始记账吧</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getCategoryName(expense.category)}</span>
                      <span className="text-lg font-bold text-gray-900">¥{expense.amount.toLocaleString()}</span>
                    </div>
                    {expense.description && (
                      <div className="text-sm text-gray-600">{expense.description}</div>
                    )}
                    <div className="text-xs text-gray-400">
                      {new Date(expense.date).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI 分析按钮 */}
        {expenses.length > 0 && (
          <div className="space-y-4">
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.analyzeButton}
                </>
              )}
            </Button>

            {aiAnalysis && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">{t.aiAnalysis}</h4>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {aiAnalysis}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  )

  if (!showCard) {
    return content
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-600" />
            {t.budgetTitle}
          </CardTitle>
          {session && (
            <div className="flex items-center gap-2 text-sm">
              {syncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-gray-500">同步中...</span>
                </>
              ) : cloudSync ? (
                <>
                  <Cloud className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">已同步</span>
                </>
              ) : (
                <>
                  <CloudOff className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">本地存储</span>
                </>
              )}
            </div>
          )}
        </div>
        <CardDescription>{t.budgetDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  )
}

// 提取数字的辅助函数
function extractNumber(text: string): number | null {
  const cleaned = text.replace(/\s+/g, '').toLowerCase()
  
  // 直接匹配数字
  const directMatch = cleaned.match(/\d+\.?\d*/)
  if (directMatch) {
    return parseFloat(directMatch[0])
  }
  
  // 中文数字映射
  const chineseNumbers: Record<string, number> = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
    '两': 2, '百': 100, '千': 1000, '万': 10000,
  }
  
  // 简单的中文数字转换
  for (const [chinese, value] of Object.entries(chineseNumbers)) {
    if (cleaned.includes(chinese)) {
      if (chinese === '十') {
        const beforeTen = cleaned.split('十')[0]
        const afterTen = cleaned.split('十')[1]
        let result = 10
        if (beforeTen && chineseNumbers[beforeTen]) {
          result = chineseNumbers[beforeTen] * 10
        }
        if (afterTen && chineseNumbers[afterTen]) {
          result += chineseNumbers[afterTen]
        }
        return result
      }
      if (chinese === '千' || chinese === '万' || chinese === '百') {
        const beforeUnit = cleaned.split(chinese)[0]
        let multiplier = 1
        if (beforeUnit && chineseNumbers[beforeUnit]) {
          multiplier = chineseNumbers[beforeUnit]
        }
        return multiplier * value
      }
      return value
    }
  }
  
  return null
}


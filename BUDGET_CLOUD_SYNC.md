# 💰 费用预算管理 - 云端存储功能

## 功能说明

费用预算与管理功能现已支持云端存储，所有费用记录会自动同步到 Supabase 数据库。

## ✨ 特性

### 1. 自动云端同步
- 登录后添加的费用会自动保存到云端
- 删除费用时同步删除云端记录
- 刷新页面或切换设备后自动加载云端数据

### 2. 关联旅行计划
- 费用记录可以关联到具体的旅行计划
- 保存旅行计划后，费用记录会自动关联

### 3. 离线模式支持
- 未登录时仍可使用，数据存储在浏览器本地
- 登录后数据不会自动上传（保护隐私）

### 4. 云端状态指示
- 界面显示云端同步状态
- 同步中有加载动画

## 📊 数据结构

### Expense（费用记录）
```typescript
{
  id: string              // UUID
  user_id: string         // 用户 ID
  travel_plan_id?: string // 关联的旅行计划 ID（可选）
  category: string        // 类别：food/transport/accommodation/activity/shopping/other
  amount: number          // 金额
  currency: string        // 货币（默认 CNY）
  description: string     // 描述
  date: string           // 日期
  created_at: string     // 创建时间
  updated_at: string     // 更新时间
}
```

## 🔄 使用流程

### 1. 创建旅行计划并保存
```
填写旅行信息 → 生成计划 → 保存计划 → 获得计划 ID
```

### 2. 添加费用记录
```
输入费用信息 → 点击"添加费用" → 自动保存到云端 → 关联到旅行计划
```

### 3. 查看云端记录
```
刷新页面 → 自动加载云端费用 → 显示同步状态
```

### 4. 删除费用记录
```
点击删除按钮 → 同时删除本地和云端记录
```

## 🔧 技术实现

### 前端组件
- **BudgetManager.tsx**
  - 费用管理主组件
  - 云端同步逻辑
  - 状态管理

- **app/page.tsx**
  - 传递 `travelPlanId` 给 BudgetManager
  - 保存计划后获取计划 ID

### 后端 API
- **POST /api/expenses**
  - 创建费用记录
  - 参数：`travel_plan_id`, `category`, `amount`, `description`, `date`

- **GET /api/expenses**
  - 获取费用记录列表
  - 查询参数：`travelPlanId`（可选）

- **DELETE /api/expenses?id={id}**
  - 删除费用记录

### 数据库
- **expenses 表**（Supabase）
  - 存储所有费用记录
  - RLS 策略：用户只能访问自己的记录

## 📝 代码示例

### 添加费用并保存到云端
```typescript
const handleAddExpense = async () => {
  if (session) {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        travel_plan_id: travelPlanId || null,
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
      }),
    })
    
    const data = await response.json()
    if (data.success) {
      console.log('✅ 费用已保存到云端')
    }
  }
}
```

### 从云端加载费用
```typescript
const fetchExpenses = async () => {
  const url = travelPlanId 
    ? `/api/expenses?travelPlanId=${travelPlanId}`
    : '/api/expenses'
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.success) {
    setExpenses(data.expenses)
    setCloudSync(true)
  }
}
```

## 🎯 用户体验

### 云端同步指示
- 🌐 有云端图标：已连接云端
- 🔄 旋转动画：正在同步
- ❌ 错误提示：同步失败

### 控制台日志
```
✅ 成功从云端加载 3 条费用记录
✅ 费用已保存到云端: 午餐
✅ 费用已从云端删除
```

## 🔒 数据安全

### Row Level Security (RLS)
- 用户只能访问自己的费用记录
- 服务器端验证用户身份
- 防止跨用户数据访问

### 策略规则
```sql
-- 用户只能查看自己的费用
CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能创建自己的费用
CREATE POLICY "Users can create own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的费用
CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);
```

## 📱 多设备同步

### 场景 1：手机添加，电脑查看
1. 在手机上登录并添加费用
2. 在电脑上登录同一账号
3. 打开旅行计划页面
4. 自动加载所有费用记录

### 场景 2：离线使用，后续同步
1. 未登录时添加费用（本地存储）
2. 稍后登录账号
3. 本地费用不会自动上传
4. 新添加的费用会同步到云端

## 🐛 故障排查

### 问题 1: 费用无法保存到云端
**检查：**
- 是否已登录？
- 控制台是否有错误？
- Supabase 项目是否正常运行？

**解决：**
```bash
# 查看浏览器控制台
# 应该看到：✅ 费用已保存到云端

# 如果看到错误，检查：
# 1. 网络连接
# 2. Supabase 配置
# 3. RLS 策略
```

### 问题 2: 云端费用无法加载
**检查：**
- 是否保存了旅行计划？
- `travelPlanId` 是否正确传递？

**解决：**
- 先保存旅行计划
- 确认控制台显示计划 ID
- 刷新页面重新加载

### 问题 3: 费用记录重复
**原因：**
- 同时在本地和云端添加

**解决：**
- 清除浏览器缓存
- 刷新页面
- 只使用云端数据

## 📈 性能优化

### 1. 批量加载
- 一次性加载所有关联费用
- 减少 API 调用次数

### 2. 乐观更新
- 先更新 UI
- 后台同步到云端
- 失败时回滚

### 3. 缓存策略
- 使用 React 状态缓存
- 避免重复加载

## 🎉 使用建议

1. **保存旅行计划**
   - 先生成并保存旅行计划
   - 获得计划 ID 后再添加费用

2. **定期记录费用**
   - 及时记录每笔开销
   - 方便后续分析

3. **使用 AI 分析**
   - 积累一定费用后
   - 点击"AI 分析"获取建议

4. **多设备使用**
   - 登录同一账号
   - 在任何设备查看费用

---

**更新时间**: 2025-11-10  
**版本**: v2.2.0


# 🔧 Dashboard 计划加载问题修复

## 问题描述
查看保存的计划时显示"无法加载计划"或数据显示不正确。

## 根本原因
**字段名映射不匹配：**
- **前端 (Dashboard)**: 使用驼峰命名 (`startDate`, `_id`, `specialRequests`)
- **后端 (Supabase)**: 使用蛇形命名 (`start_date`, `id`, `special_requests`)

## 已修复内容

### 1. Dashboard 主页 (`app/dashboard/page.tsx`) ✅

**接口定义更新：**
```typescript
// 之前：
interface TravelPlan {
  _id: string
  startDate: string
  createdAt: string
  specialRequests: string
}

// 现在：
interface TravelPlan {
  id: string              // Supabase 使用 id
  start_date: string      // 蛇形命名
  created_at: string      // 蛇形命名
  special_requests: string
}
```

**字段引用更新：**
- `plan._id` → `plan.id`
- `plan.startDate` → `plan.start_date`
- `plan.createdAt` → `plan.created_at`

### 2. 计划详情页 (`app/dashboard/plans/[id]/page.tsx`) ✅

**接口定义更新：**
```typescript
// 之前：
interface PlanData {
  _id: string
  startDate: string
  endDate: string
  specialRequests: string
  createdAt: string
}

// 现在：
interface PlanData {
  id: string           // Supabase 使用 id
  start_date: string   // 蛇形命名
  end_date: string
  special_requests: string
  created_at: string
}
```

**字段引用更新：**
- `plan.startDate` → `plan.start_date`
- `plan.specialRequests` → `plan.special_requests`

## 测试步骤

1. **确保已登录**

2. **保存一个旅行计划**
   - 在主页生成旅行计划
   - 点击"保存计划"
   - 看到"已保存"提示

3. **访问 Dashboard**
   - 点击右上角用户头像
   - 选择"我的计划"
   - 或访问 `/dashboard`

4. **验证计划显示**
   - 应该能看到已保存的计划列表
   - 每个计划卡片显示：
     - ✅ 标题
     - ✅ 目的地
     - ✅ 出发日期
     - ✅ 旅行天数
     - ✅ 同行人数
     - ✅ 预算

5. **查看计划详情**
   - 点击"查看"按钮
   - 应该能看到完整的计划内容
   - 包括旅行兴趣和特殊要求

## 字段映射对照表

| 前端字段 (旧) | Supabase 字段 | 前端字段 (新) |
|-------------|--------------|-------------|
| `_id` | `id` | `id` |
| `startDate` | `start_date` | `start_date` |
| `endDate` | `end_date` | `end_date` |
| `specialRequests` | `special_requests` | `special_requests` |
| `createdAt` | `created_at` | `created_at` |
| `updatedAt` | `updated_at` | `updated_at` |
| `userId` | `user_id` | `user_id` |
| `travelPlanId` | `travel_plan_id` | `travel_plan_id` |

## 常见问题

### Q1: 仍然看不到计划
**检查：**
1. 是否已登录？
2. 是否保存过计划？
3. 浏览器控制台是否有错误？

**解决：**
```bash
# 查看浏览器控制台 (F12)
# 应该看到成功获取计划的日志
```

### Q2: 日期显示为 Invalid Date
**原因：** 字段名错误，无法读取日期

**已修复：** 使用正确的 `start_date` 字段

### Q3: 点击查看后页面空白
**原因：** 详情页字段映射错误

**已修复：** 详情页也已更新字段名

## 调试技巧

### 查看 API 响应
在浏览器控制台 (F12) 的 Network 标签：
1. 访问 Dashboard
2. 找到 `/api/travel-plans` 请求
3. 查看 Response，确认字段名

**正确的响应格式：**
```json
{
  "success": true,
  "plans": [
    {
      "id": "abc-123",
      "title": "北京5日游",
      "destination": "北京",
      "start_date": "2025-11-15",
      "end_date": "2025-11-20",
      "duration": 5,
      "travelers": 2,
      "budget": 5000,
      "interests": "历史文化",
      "special_requests": null,
      "plan": "...",
      "status": "draft",
      "created_at": "2025-11-10T12:00:00Z"
    }
  ]
}
```

### 服务器端日志
查看终端输出：
```
服务器端：获取到用户 [用户ID] [邮箱]
准备插入数据库: { ... }
保存成功: { ... }
```

## 相关文件

- `app/dashboard/page.tsx` - 计划列表页
- `app/dashboard/plans/[id]/page.tsx` - 计划详情页
- `app/api/travel-plans/route.ts` - 计划 API（GET、POST、DELETE）
- `app/api/travel-plans/[id]/route.ts` - 单个计划 API（GET、PATCH）

## 完成检查

- [x] Dashboard 接口定义已更新
- [x] Dashboard 字段引用已更新
- [x] 详情页接口定义已更新
- [x] 详情页字段引用已更新
- [x] 无 lint 错误
- [x] 字段映射文档已创建

---

**更新时间**: 2025-11-10  
**版本**: v2.2.1

## 下一步

现在可以正常：
- ✅ 查看已保存的旅行计划列表
- ✅ 点击查看计划详情
- ✅ 删除计划
- ✅ 所有字段正确显示


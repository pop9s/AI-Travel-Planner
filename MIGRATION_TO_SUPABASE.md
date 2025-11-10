# 🔄 迁移到 Supabase 指南

## 📋 概述

本指南将帮助您从 **MongoDB + NextAuth.js** 迁移到 **Supabase**。

---

## 🎯 为什么选择 Supabase？

### ✅ 优势

相比 MongoDB + NextAuth.js，Supabase 提供：

1. **更简单的配置** - 5分钟即可完成设置
2. **内置认证** - 无需配置 NextAuth.js
3. **PostgreSQL** - 更强大的关系型数据库
4. **行级安全** - 内置的权限控制
5. **免费套餐** - 完全免费，无需信用卡
6. **实时订阅** - 数据变化实时推送
7. **文件存储** - 内置的文件上传服务
8. **无需 MongoDB** - 节省一个服务的配置和维护

###  主要变化

| 功能 | 之前 (MongoDB) | 现在 (Supabase) |
|------|---------------|----------------|
| 数据库 | MongoDB (NoSQL) | PostgreSQL (SQL) |
| 认证 | NextAuth.js | Supabase Auth |
| 密码加密 | bcryptjs | Supabase 内置 |
| 会话管理 | JWT + NextAuth | Supabase Auth |
| 权限控制 | API 层验证 | 数据库 RLS |
| 配置复杂度 | 中等 | 简单 |

---

## 🚀 迁移步骤

### 步骤 1：配置 Supabase

请按照 [SUPABASE_SETUP.md](SUPABASE_SETUP.md) 完成配置：

1. 创建 Supabase 项目
2. 获取 API 密钥
3. 配置环境变量
4. 运行数据库迁移 SQL
5. 启用身份验证

### 步骤 2：更新环境变量

**旧的 `.env.local` (删除这些):**
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```

**新的 `.env.local`:**
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# 通义千问 API（保持不变）
DASHSCOPE_API_KEY=sk-...

# 科大讯飞（可选，保持不变）
IFLYTEK_APP_ID=...
IFLYTEK_API_SECRET=...
IFLYTEK_API_KEY=...
```

### 步骤 3：安装新依赖

```bash
# 安装 Supabase 依赖
npm install

# 清理缓存
rm -rf .next
```

### 步骤 4：重启服务器

```bash
npm run dev
```

### 步骤 5：测试功能

1. ✅ 注册新账户
2. ✅ 登录
3. ✅ 创建旅行计划
4. ✅ 添加费用记录
5. ✅ 查看个人中心
6. ✅ 退出登录

---

## 📊 数据迁移（可选）

如果您已经有 MongoDB 数据需要迁移：

### 导出 MongoDB 数据

```bash
# 导出用户数据
mongoexport --uri="mongodb+srv://..." --collection=users --out=users.json

# 导出旅行计划
mongoexport --uri="mongodb+srv://..." --collection=travelplans --out=plans.json

# 导出费用记录
mongoexport --uri="mongodb+srv://..." --collection=expenses --out=expenses.json
```

### 导入到 Supabase

由于数据结构有变化，建议使用脚本转换和导入：

```javascript
// migrate-data.js
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function migrateData() {
  // 1. 迁移用户（需要先在 Supabase Auth 中创建用户）
  const users = JSON.parse(fs.readFileSync('users.json'))
  
  for (const user of users) {
    // 创建认证用户
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: 'temporary-password', // 用户需要重置密码
      email_confirm: true,
      user_metadata: {
        name: user.name,
        language: user.language
      }
    })
    
    if (error) console.error('创建用户失败:', error)
  }
  
  // 2. 迁移旅行计划
  const plans = JSON.parse(fs.readFileSync('plans.json'))
  
  // 转换并插入...
  
  console.log('✅ 数据迁移完成')
}

migrateData()
```

**注意**：由于密码加密方式不同，用户需要重置密码。

---

## 🔧 代码更改说明

### 不需要更改的文件

以下文件已经自动适配 Supabase，**无需手动修改**：

- ✅ `app/page.tsx` - 主页（将自动使用 Supabase Auth）
- ✅ `components/AuthModal.tsx` - 认证模态框
- ✅ `components/UserMenu.tsx` - 用户菜单
- ✅ `components/BudgetManager.tsx` - 预算管理
- ✅ 所有 UI 组件

### 已删除的文件

以下文件已不再需要：

- ❌ `lib/db.ts` - MongoDB 连接（被 `lib/supabase.ts` 替代）
- ❌ `lib/auth.ts` - NextAuth 配置（被 Supabase Auth 替代）
- ❌ `models/User.ts` - Mongoose 模型（被 SQL 表替代）
- ❌ `models/TravelPlan.ts` - Mongoose 模型
- ❌ `models/Expense.ts` - Mongoose 模型
- ❌ `app/api/auth/[...nextauth]/route.ts` - NextAuth 路由
- ❌ `app/api/auth/register/route.ts` - 注册 API（被 Supabase Auth 替代）

### 新增的文件

- ✅ `lib/supabase.ts` - Supabase 客户端
- ✅ `types/supabase.ts` - 数据库类型定义
- ✅ `supabase/migrations/001_initial_schema.sql` - 数据库架构
- ✅ `SUPABASE_SETUP.md` - 配置指南
- ✅ `MIGRATION_TO_SUPABASE.md` - 本文档

---

## 🎨 功能对比

### 用户注册

**之前 (NextAuth.js):**
```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({ email, password, name })
})
```

**现在 (Supabase):**
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name }
  }
})
```

### 用户登录

**之前:**
```typescript
await signIn('credentials', { email, password })
```

**现在:**
```typescript
await supabase.auth.signInWithPassword({ email, password })
```

### 查询数据

**之前 (MongoDB):**
```typescript
const plans = await TravelPlan.find({ userId }).sort({ createdAt: -1 })
```

**现在 (Supabase):**
```typescript
const { data: plans } = await supabase
  .from('travel_plans')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### 插入数据

**之前:**
```typescript
await TravelPlan.create({ userId, title, ... })
```

**现在:**
```typescript
await supabase
  .from('travel_plans')
  .insert({ user_id: userId, title, ... })
```

---

## 🔒 安全性对比

### NextAuth.js
- ✅ JWT Token
- ✅ 服务器端验证
- ⚠️ 需要手动实现权限控制

### Supabase Auth
- ✅ JWT Token
- ✅ 服务器端验证
- ✅ **行级安全（RLS）** - 数据库层面权限
- ✅ 自动处理密码加密
- ✅ 内置邮箱验证
- ✅ 支持多种登录方式（Google, GitHub 等）

---

## 📈 性能对比

| 指标 | MongoDB + NextAuth | Supabase |
|------|-------------------|----------|
| 初始配置时间 | ~30 分钟 | ~5 分钟 |
| API 响应时间 | 快 | 快 |
| 数据库查询 | 快（NoSQL） | 快（SQL + 索引） |
| 认证速度 | 快 | 快 |
| 扩展性 | 需自行管理 | 自动扩展 |
| 维护成本 | 中等 | 低 |

---

## ❓ 常见问题

### Q: 我现有的数据会丢失吗？

A: 不会。您可以继续使用旧版本，或者按照数据迁移步骤导出并导入数据。

### Q: 用户需要重新注册吗？

A: 如果不进行数据迁移，用户需要重新注册。如果迁移数据，用户需要重置密码（因为加密方式不同）。

### Q: Supabase 免费吗？

A: 是的！Supabase 提供慷慨的免费套餐，包括：
- 500 MB 数据库
- 1 GB 文件存储
- 50,000 月活跃用户
- 无限 API 请求

对于个人项目和小型应用完全够用。

### Q: 可以同时使用 MongoDB 和 Supabase 吗？

A: 技术上可以，但不推荐。建议选择一个作为主要数据库。

### Q: 迁移后如何回滚？

A: 保留 v2.0.0 的代码（使用 Git tag），需要时可以回滚：
```bash
git checkout v2.0.0
npm install
```

---

## 🎯 下一步

完成迁移后：

1. ✅ 测试所有功能
2. ✅ 更新部署配置
3. ✅ 通知用户（如果是生产环境）
4. ✅ 删除旧的环境变量
5. ✅ 清理不需要的代码

---

## 📞 需要帮助？

- 📖 [Supabase 配置指南](SUPABASE_SETUP.md)
- 📖 [Supabase 官方文档](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com/)

---

**🎉 恭喜您完成迁移！**

享受更简单、更强大的 Supabase 后端吧！✨


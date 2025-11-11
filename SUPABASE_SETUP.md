# 🚀 Supabase 配置指南

## 📋 概述

AI Travel Planner v2.1 使用 **Supabase** 作为后端服务，提供：

- 🗄️ **PostgreSQL 数据库** - 关系型数据库，支持复杂查询
- 🔐 **身份验证** - 内置的用户认证系统
- 🔒 **行级安全** - 数据访问权限控制
- ⚡ **实时订阅** - 数据实时同步
- 📦 **存储服务** - 文件上传和管理

---

## 🎯 快速开始（5分钟）

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 **"Start your project"**
3. 使用 GitHub 账号登录（推荐）
4. 点击 **"New project"**

### 2. 配置项目

填写以下信息：

- **Name**: `ai-travel-planner`
- **Database Password**: 生成一个强密码（保存好！）
- **Region**: 选择离你最近的区域
  - 🇨🇳 中国用户推荐：**Singapore (Southeast Asia)**
  - 🇺🇸 美国用户：**US West**
- **Pricing Plan**: 选择 **Free** （完全够用）

点击 **"Create new project"**，等待 1-2 分钟。

### 3. 获取 API 密钥

项目创建完成后：

1. 进入项目设置
2. 点击左侧 **"Settings"** → **"API"**
3. 找到以下信息：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc...（很长的字符串）
service_role key: eyJhbGc...（很长的字符串，保密！）
```

### 4. 配置环境变量

在项目根目录创建/更新 `.env.local`：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 通义千问 API
DASHSCOPE_API_KEY=your_dashscope_api_key

# 科大讯飞（可选）
IFLYTEK_APP_ID=your_app_id
IFLYTEK_API_SECRET=your_api_secret
IFLYTEK_API_KEY=your_api_key
```

### 5. 创建数据库表

1. 在 Supabase 控制台，点击左侧 **"SQL Editor"**
2. 点击 **"New query"**
3. 复制 `supabase/migrations/001_initial_schema.sql` 的全部内容
4. 粘贴到编辑器
5. 点击 **"Run"** 或按 `Ctrl+Enter`

看到成功提示：
```
✅ 数据库架构创建成功！
📊 创建了 3 个表：users, travel_plans, expenses
🔒 已启用行级安全（RLS）
⚡ 已创建索引和触发器
🎉 您现在可以开始使用 AI Travel Planner 了！
```

### 6. 配置身份验证

1. 点击左侧 **"Authentication"** → **"Providers"**
2. 启用 **Email** 提供商（默认已启用）
3. 可选：配置其他登录方式（Google, GitHub 等）

### 7. 安装依赖并启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 - 完成！🎉

---

## 🔐 安全配置

### 重要安全提示

⚠️ **NEVER** 将以下内容提交到 Git：
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - 这是管理员密钥！
- ❌ `.env.local` 文件

✅ **SAFE** 提交到 Git：
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - 公开的项目 URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 公开的匿名密钥（有 RLS 保护）

### 行级安全（RLS）

Supabase 的 RLS 确保：
- 用户只能访问自己的数据
- 即使有人获取了 `ANON_KEY`，也无法访问他人数据
- 所有查询都在数据库层面验证权限

---

## 📊 数据库结构

### Users 表
```sql
users (
  id UUID PRIMARY KEY,           -- 关联 auth.users
  email TEXT UNIQUE,             -- 邮箱
  name TEXT,                     -- 用户名
  avatar TEXT,                   -- 头像 URL
  language TEXT,                 -- 默认语言
  created_at TIMESTAMPTZ,        -- 创建时间
  updated_at TIMESTAMPTZ         -- 更新时间
)
```

### Travel Plans 表
```sql
travel_plans (
  id UUID PRIMARY KEY,
  user_id UUID,                  -- 所属用户
  title TEXT,                    -- 标题
  destination TEXT,              -- 目的地
  start_date DATE,               -- 出发日期
  end_date DATE,                 -- 结束日期
  duration INTEGER,              -- 天数
  travelers INTEGER,             -- 人数
  budget NUMERIC,                -- 预算
  interests TEXT,                -- 兴趣
  special_requests TEXT,         -- 特殊要求
  plan TEXT,                     -- AI 生成的计划
  status TEXT,                   -- 状态
  language TEXT,                 -- 语言
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Expenses 表
```sql
expenses (
  id UUID PRIMARY KEY,
  user_id UUID,                  -- 所属用户
  travel_plan_id UUID,           -- 关联的计划
  category TEXT,                 -- 类别
  amount NUMERIC,                -- 金额
  currency TEXT,                 -- 货币
  description TEXT,              -- 描述
  date TIMESTAMPTZ,              -- 日期
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

---

## 🛠️ 常用操作

### 查看所有表
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 查看用户数据
```sql
SELECT * FROM public.users;
```

### 查看旅行计划
```sql
SELECT * FROM public.travel_plans
ORDER BY created_at DESC;
```

### 清空所有数据（测试用）
```sql
TRUNCATE TABLE public.expenses CASCADE;
TRUNCATE TABLE public.travel_plans CASCADE;
TRUNCATE TABLE public.users CASCADE;
```

---

## 🔍 故障排除

### ❌ 无法连接到 Supabase

**检查：**
1. `NEXT_PUBLIC_SUPABASE_URL` 是否正确
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是否正确
3. Supabase 项目是否正在运行（查看控制台）
4. 网络连接是否正常

### ❌ RLS 策略错误

如果看到 `row-level security policy` 错误：

1. 确认已运行迁移 SQL
2. 检查 RLS 是否启用：
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```
3. 查看策略：
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### ❌ 用户注册后没有创建资料

检查触发器是否创建：
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

如果没有，重新运行迁移 SQL。

### ❌ 数据库查询慢

1. 检查索引是否创建：
```sql
SELECT * FROM pg_indexes WHERE schemaname = 'public';
```

2. 使用 EXPLAIN 分析查询：
```sql
EXPLAIN ANALYZE SELECT * FROM travel_plans WHERE user_id = 'xxx';
```

---

## 🎨 Supabase 控制台功能

### 📊 Table Editor
- 可视化查看和编辑数据
- 添加/删除行
- 修改表结构

### 🔐 Authentication
- 查看所有用户
- 管理用户状态
- 配置登录方式

### 💾 Database
- 执行 SQL 查询
- 查看表结构
- 管理索引和关系

### 📁 Storage
- 上传文件（头像、图片等）
- 管理存储桶
- 设置访问权限

### ⚡ Realtime
- 监听数据变化
- 设置实时订阅
- 查看连接状态

---

## 🚀 进阶功能

### 1. 启用 Google 登录

1. 在 Supabase 控制台：**Authentication** → **Providers** → **Google**
2. 在 Google Cloud Console 创建 OAuth 2.0 凭据
3. 填写 Client ID 和 Client Secret
4. 添加重定向 URL：`https://your-project.supabase.co/auth/v1/callback`

### 2. 设置 PostgreSQL 函数

创建自定义函数以提高性能：

```sql
CREATE OR REPLACE FUNCTION get_user_plans(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  destination TEXT,
  start_date DATE,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tp.id,
    tp.title,
    tp.destination,
    tp.start_date,
    tp.status
  FROM public.travel_plans tp
  WHERE tp.user_id = user_uuid
  ORDER BY tp.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. 启用实时订阅

在表上启用实时更新：

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE travel_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
```

在代码中订阅：

```typescript
const channel = supabase
  .channel('travel-plans-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'travel_plans'
  }, (payload) => {
    console.log('数据变化:', payload)
  })
  .subscribe()
```

---

## 📈 性能优化

### 1. 使用连接池
Supabase 自动管理连接池，无需额外配置。

### 2. 批量操作
使用 Supabase 的批量插入：

```typescript
const { data, error } = await supabase
  .from('expenses')
  .insert([
    { user_id: 'xxx', amount: 100, ... },
    { user_id: 'xxx', amount: 200, ... },
  ])
```

### 3. 查询优化
只选择需要的字段：

```typescript
const { data } = await supabase
  .from('travel_plans')
  .select('id, title, destination')
  .eq('user_id', userId)
```

---

## 💰 定价说明

### Free 计划（完全够用）
- ✅ 500 MB 数据库空间
- ✅ 1 GB 文件存储
- ✅ 50,000 月活跃用户
- ✅ 无限 API 请求
- ✅ 社区支持

### Pro 计划（$25/月）
- 8 GB 数据库
- 100 GB 文件存储
- 100,000 月活跃用户
- 优先支持

---

## 🔗 有用的链接

- 📖 [Supabase 文档](https://supabase.com/docs)
- 🎓 [Supabase 教程](https://supabase.com/docs/guides/getting-started)
- 💬 [Supabase Discord](https://discord.supabase.com/)
- 📝 [Supabase 博客](https://supabase.com/blog)
- 🐙 [Supabase GitHub](https://github.com/supabase/supabase)

---

## ✅ 检查清单

在开始使用前，确认：

- [x] 已创建 Supabase 项目
- [x] 已配置 `.env.local`
- [x] 已运行数据库迁移 SQL
- [x] 已启用邮箱认证
- [x] 已测试用户注册
- [x] 已安装 npm 依赖
- [x] 应用可以正常运行

---

**🎉 恭喜！您的 Supabase 已配置完成！**

开始使用您的云端 AI Travel Planner 吧！✈️🌍

有问题？查看 [故障排除](#-故障排除) 部分或访问 Supabase 文档。


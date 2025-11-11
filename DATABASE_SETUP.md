# 🗄️ 数据库初始化指南

## ⚠️ 重要提示

**数据库表必须在运行应用前创建！** 如果数据库表未创建，所有数据库功能将无法使用，包括：
- ❌ 用户注册和登录
- ❌ 保存旅行计划
- ❌ 记录费用
- ❌ 数据同步

## 🚀 快速开始

### 步骤 1: 获取 SQL 脚本

**方式一：克隆项目（推荐）**
```bash
git clone https://github.com/yourusername/AI-Travel-Planner.git
cd AI-Travel-Planner
# SQL 文件位置：supabase/migrations/001_initial_schema.sql
```

**方式二：直接从 GitHub 获取**
1. 访问：https://github.com/yourusername/AI-Travel-Planner/blob/main/supabase/migrations/001_initial_schema.sql
2. 点击 **Raw** 按钮查看原始文件
3. 复制全部内容

### 步骤 2: 在 Supabase 中执行脚本

1. **登录 Supabase 控制台**
   - 访问 https://supabase.com/
   - 登录并选择您的项目

2. **打开 SQL Editor**
   - 点击左侧菜单 **SQL Editor**
   - 点击 **New query** 按钮

3. **执行 SQL 脚本**
   - 粘贴 `001_initial_schema.sql` 的全部内容
   - 点击 **Run** 按钮或按 `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **查看执行结果**
   - 应该看到成功提示：
   ```
   ✅ 数据库架构创建成功！
   📊 创建了 3 个表：users, travel_plans, expenses
   🔒 已启用行级安全（RLS）
   ⚡ 已创建索引和触发器
   🎉 您现在可以开始使用 AI Travel Planner 了！
   ```

### 步骤 3: 验证数据库表

**方法一：使用 Table Editor（最简单）**
1. 在 Supabase 控制台，点击左侧 **Table Editor**
2. 应该能看到以下表：
   - `users` - 用户表
   - `travel_plans` - 旅行计划表
   - `expenses` - 费用表

**方法二：使用 SQL 查询**
在 SQL Editor 中执行：
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'travel_plans', 'expenses')
ORDER BY table_name;
```

应该返回 3 行结果。

## 🔍 验证数据库结构

### 检查表结构

```sql
-- 检查 users 表
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 检查 travel_plans 表
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'travel_plans'
ORDER BY ordinal_position;

-- 检查 expenses 表
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'expenses'
ORDER BY ordinal_position;
```

### 检查 RLS 策略

```sql
-- 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'travel_plans', 'expenses');
```

所有表的 `rowsecurity` 应该为 `true`。

### 检查触发器

```sql
-- 检查触发器
SELECT trigger_name, event_object_table, event_manipulation
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
  AND event_object_table IN ('users', 'travel_plans', 'expenses')
ORDER BY event_object_table, trigger_name;
```

应该看到以下触发器：
- `on_auth_user_created` - 用户注册时自动创建资料
- `update_users_updated_at` - 自动更新 users 表
- `update_travel_plans_updated_at` - 自动更新 travel_plans 表
- `update_expenses_updated_at` - 自动更新 expenses 表

## ❌ 常见问题

### 问题 1: 表已存在错误

**错误信息**：`relation "users" already exists`

**解决方案**：
- 如果表已存在且结构正确，可以忽略此错误
- 如果想重新创建表，先删除现有表：
  ```sql
  DROP TABLE IF EXISTS public.expenses CASCADE;
  DROP TABLE IF EXISTS public.travel_plans CASCADE;
  DROP TABLE IF EXISTS public.users CASCADE;
  ```
  然后重新执行初始化脚本

### 问题 2: 权限错误

**错误信息**：`permission denied for schema public`

**解决方案**：
- 确保使用 Supabase 项目的管理员权限
- 检查是否有执行 SQL 的权限
- 联系 Supabase 支持

### 问题 3: 外键约束错误

**错误信息**：`foreign key constraint fails`

**解决方案**：
- 确保 `auth.users` 表存在（Supabase 自动创建）
- 检查表的创建顺序是否正确
- 重新执行完整的初始化脚本

### 问题 4: 触发器创建失败

**错误信息**：`function does not exist`

**解决方案**：
- 确保 `update_updated_at_column()` 函数已创建
- 检查 SQL 脚本是否完整执行
- 重新执行完整的初始化脚本

## 🔄 重新初始化数据库

如果需要重新初始化数据库（⚠️ 会删除所有数据）：

```sql
-- 1. 删除现有表
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.travel_plans CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. 删除函数（如果存在）
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. 重新执行 001_initial_schema.sql 脚本
```

## 📊 数据库表结构

### users 表
- `id` (UUID) - 主键，关联 auth.users
- `email` (TEXT) - 邮箱
- `name` (TEXT) - 用户名
- `avatar` (TEXT) - 头像URL
- `language` (TEXT) - 默认语言
- `created_at` (TIMESTAMPTZ) - 创建时间
- `updated_at` (TIMESTAMPTZ) - 更新时间

### travel_plans 表
- `id` (UUID) - 主键
- `user_id` (UUID) - 用户ID，外键
- `title` (TEXT) - 标题
- `destination` (TEXT) - 目的地
- `start_date` (DATE) - 出发日期
- `end_date` (DATE) - 结束日期
- `duration` (INTEGER) - 天数
- `travelers` (INTEGER) - 人数
- `budget` (NUMERIC) - 预算
- `interests` (TEXT) - 兴趣
- `special_requests` (TEXT) - 特殊要求
- `plan` (TEXT) - AI生成的计划
- `status` (TEXT) - 状态
- `language` (TEXT) - 语言
- `created_at` (TIMESTAMPTZ) - 创建时间
- `updated_at` (TIMESTAMPTZ) - 更新时间

### expenses 表
- `id` (UUID) - 主键
- `user_id` (UUID) - 用户ID，外键
- `travel_plan_id` (UUID) - 旅行计划ID，外键
- `category` (TEXT) - 类别
- `amount` (NUMERIC) - 金额
- `currency` (TEXT) - 货币
- `description` (TEXT) - 描述
- `date` (TIMESTAMPTZ) - 日期
- `created_at` (TIMESTAMPTZ) - 创建时间
- `updated_at` (TIMESTAMPTZ) - 更新时间

## 🛡️ 安全特性

### 行级安全 (RLS)
- 所有表都启用了 RLS
- 用户只能访问自己的数据
- 数据在数据库层面进行权限控制

### 数据隔离
- 每个用户的数据完全隔离
- 通过 `user_id` 字段关联用户
- 外键约束确保数据完整性

## 📚 相关文档

- [Supabase 配置指南](SUPABASE_SETUP.md) - 完整的 Supabase 配置说明
- [项目验证指南](VERIFICATION_GUIDE.md) - 验证项目是否正常运行
- [环境配置指南](docs/ENV_CONFIG_GUIDE.md) - 环境变量配置

## ✅ 检查清单

完成数据库初始化后，确认：
- [ ] 3 个表都已创建（users, travel_plans, expenses）
- [ ] RLS 策略已启用
- [ ] 触发器已创建
- [ ] 索引已创建
- [ ] 使用 SQL 查询验证表存在
- [ ] 在 Table Editor 中可以看到表

---

**如果所有检查项都通过，数据库初始化完成！现在可以运行应用了。🎉**


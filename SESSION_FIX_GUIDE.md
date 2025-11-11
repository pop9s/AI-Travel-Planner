# 🔧 Session 问题修复指南

## 问题：`Auth session missing!`

### 根本原因

在 Next.js App Router 中，如果客户端使用 `localStorage` 存储 session，服务器端无法读取。必须使用 **cookies** 来存储 session。

### 解决方案

使用 `@supabase/ssr` 包的 `createBrowserClient`，它会自动：
- 在客户端使用 cookies 存储 session
- 服务器端可以通过 `cookies()` API 读取

### 已修复的文件

1. **lib/supabase.ts** - 客户端配置
   - ✅ 改用 `createBrowserClient`
   - ✅ 添加 `'use client'` 指令

2. **lib/supabase-server.ts** - 服务器端配置
   - ✅ 使用 `createServerClient`
   - ✅ 添加 `set` 和 `remove` 方法

### 重要步骤

#### 1. 完全重启开发服务器
```bash
# 停止服务器 (Ctrl+C)
# 清理缓存
rm -rf .next
# 重新启动
npm run dev
```

#### 2. 清除浏览器数据（非常重要！）

**方法 1：使用开发者工具**
1. 按 F12 打开开发者工具
2. Application 标签
3. Storage > Clear site data
4. 点击 "Clear site data" 按钮

**方法 2：使用无痕模式**
- Ctrl+Shift+N (Chrome)
- Ctrl+Shift+P (Firefox)

#### 3. 重新登录
1. 点击"登录"按钮
2. 输入邮箱和密码
3. 登录后检查 cookies

### 验证 Cookies

打开浏览器开发者工具 (F12)：

1. **Application > Cookies > http://localhost:3001**
2. 查找以下 cookies：
   - `sb-[项目ID]-auth-token`
   - `sb-[项目ID]-auth-token.0`
   - `sb-[项目ID]-auth-token.1`
   - 等等

**应该看到：**
- 多个 `sb-` 开头的 cookies
- 每个 cookie 都有值

**如果没有看到：**
- 说明客户端配置有问题
- 检查 `lib/supabase.ts` 是否正确使用 `createBrowserClient`

### 测试流程

1. **清除所有数据**
   ```bash
   # 停止服务器
   # 清除浏览器数据
   # 删除 .next 文件夹
   rm -rf .next
   # 重启服务器
   npm run dev
   ```

2. **注册新账号**
   - 使用全新的邮箱
   - 注册后会自动登录

3. **检查 cookies**
   - F12 > Application > Cookies
   - 应该看到 `sb-` 开头的 cookies

4. **生成旅行计划**
   - 填写表单
   - 生成计划

5. **保存计划**
   - 点击"保存计划"
   - 查看服务器终端

**期望看到：**
```
服务器端：获取到用户 [用户ID] [邮箱]
准备插入数据库: { ... }
保存成功: { ... }
```

### 调试命令

#### 查看浏览器中的 Supabase session
在浏览器控制台运行：
```javascript
// 查看 cookies
document.cookie

// 查看 localStorage (应该为空或没有 supabase 相关的)
Object.keys(localStorage).filter(k => k.includes('supabase'))
```

#### 查看服务器端 cookies
在 API 路由中添加：
```typescript
import { cookies } from 'next/headers'

const cookieStore = cookies()
const allCookies = cookieStore.getAll()
console.log('服务器端 cookies:', allCookies.filter(c => c.name.includes('sb')))
```

### 常见问题

#### Q1: 仍然显示 "Auth session missing!"

**A:** 按顺序尝试：
1. 完全关闭浏览器，重新打开
2. 使用无痕模式测试
3. 检查是否有浏览器扩展阻止 cookies
4. 确认 `.env.local` 中的 URL 没有引号

#### Q2: Cookies 存在但服务器读不到

**A:** 检查：
1. `lib/supabase-server.ts` 中的 `get` 方法
2. 确认 `createServerClient` 正确配置
3. 查看 cookies 的 `Domain` 和 `Path` 是否正确

#### Q3: 登录后立即退出

**A:** 可能是：
1. Supabase 项目配置问题
2. Email confirmation 未关闭
3. URL 配置不匹配

### 环境检查

确认 `.env.local` 文件：
```env
# 确保没有引号，没有多余空格
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### Supabase Dashboard 检查

1. **Authentication > Settings**
   - 关闭 "Enable email confirmations"（开发环境）
   - 检查 "Site URL" 是否正确

2. **Table Editor > travel_plans**
   - 确认表存在
   - 检查 RLS 策略

---

**更新时间**: 2025-11-10  
**版本**: v2.1.3

## 完成后

如果以上步骤都完成了，应该能够：
- ✅ 登录成功
- ✅ 浏览器中有 Supabase cookies
- ✅ 服务器端能获取用户信息
- ✅ 保存计划成功


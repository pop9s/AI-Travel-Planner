# 用户管理与数据存储系统

## 📋 功能概述

AI Travel Planner 现已支持完整的用户管理与数据存储功能，让您可以：

- ✅ **注册登录系统** - 安全的用户账户管理
- ✅ **云端同步** - 旅行计划、费用记录自动同步
- ✅ **多设备访问** - 随时随地查看和管理您的旅行
- ✅ **个人中心** - 管理所有旅行计划
- ✅ **偏好设置** - 自定义语言和个人信息

---

## 🚀 快速开始

### 1. 配置数据库

您需要一个 MongoDB 数据库来存储用户数据。有两种选择：

#### 选项 A：使用 MongoDB Atlas（推荐）

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费账户并建立新集群
3. 获取连接字符串（类似 `mongodb+srv://username:password@cluster.mongodb.net/ai-travel-planner`）

#### 选项 B：本地 MongoDB

```bash
# 使用 Docker 运行本地 MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 连接字符串
mongodb://localhost:27017/ai-travel-planner
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（如果还没有），添加以下配置：

```env
# 通义千问 API 密钥
DASHSCOPE_API_KEY=your_dashscope_api_key_here

# MongoDB 数据库连接
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-travel-planner

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key_here

# 科大讯飞语音识别（可选）
IFLYTEK_APP_ID=your_iflytek_app_id
IFLYTEK_API_SECRET=your_iflytek_api_secret
IFLYTEK_API_KEY=your_iflytek_api_key
```

### 3. 生成 NextAuth Secret

```bash
# 生成随机密钥
openssl rand -base64 32
```

将生成的密钥复制到 `NEXTAUTH_SECRET`。

### 4. 安装并启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 开始使用！

---

## 🎯 核心功能

### 1. 用户注册与登录

#### 注册新账户
1. 点击右上角 **"登录"** 按钮
2. 切换到 **"注册"** 标签
3. 填写邮箱、密码和用户名
4. 点击 **"注册"** 按钮

#### 登录账户
1. 点击右上角 **"登录"** 按钮
2. 输入邮箱和密码
3. 点击 **"登录"** 按钮

### 2. 保存旅行计划

1. 在主页填写旅行信息
2. 点击 **"生成旅行计划"**
3. 计划生成后，点击 **"保存计划"** 按钮
4. 计划将自动保存到您的账户

> 💡 **提示**：未登录用户也可以生成计划，但无法保存。

### 3. 管理旅行计划

#### 查看所有计划
1. 点击右上角头像
2. 选择 **"我的计划"**
3. 查看所有已保存的旅行计划

#### 查看计划详情
1. 在"我的计划"页面，点击计划卡片的 **"查看"** 按钮
2. 查看完整的旅行计划详情

#### 删除计划
1. 在"我的计划"页面，点击 **垃圾桶图标**
2. 确认删除

### 4. 费用记录云端同步

#### 自动同步
- 登录用户的费用记录会自动同步到云端
- 添加或删除费用时，自动保存到数据库
- 多设备间实时同步

#### 同步状态指示
- ☁️ **已同步** - 数据已保存到云端
- 🔄 **同步中...** - 正在保存数据
- 📱 **本地存储** - 未登录，仅本地保存

### 5. 个人设置

1. 点击右上角头像
2. 选择 **"设置"**
3. 修改个人信息和偏好设置
4. 点击 **"保存设置"**

---

## 📊 数据模型

### User（用户）
```typescript
{
  email: string          // 邮箱（唯一）
  password: string       // 加密密码
  name: string          // 用户名
  avatar?: string       // 头像URL
  language: 'zh' | 'en' | 'ja' | 'ko'  // 默认语言
  createdAt: Date       // 创建时间
  updatedAt: Date       // 更新时间
}
```

### TravelPlan（旅行计划）
```typescript
{
  userId: ObjectId      // 用户ID
  title: string         // 标题
  destination: string   // 目的地
  startDate: Date       // 出发日期
  endDate: string       // 结束日期
  duration: number      // 旅行天数
  travelers: number     // 同行人数
  budget: number        // 预算
  interests: string     // 旅行兴趣
  specialRequests?: string  // 特殊要求
  plan: string          // AI生成的计划（Markdown）
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled'
  language: 'zh' | 'en' | 'ja' | 'ko'
  createdAt: Date
  updatedAt: Date
}
```

### Expense（费用记录）
```typescript
{
  userId: ObjectId      // 用户ID
  travelPlanId?: ObjectId  // 关联的旅行计划（可选）
  category: 'food' | 'transport' | 'accommodation' | 'activity' | 'shopping' | 'other'
  amount: number        // 金额
  currency: string      // 货币（默认CNY）
  description: string   // 描述
  date: Date           // 记录日期
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔒 安全性

### 密码安全
- 使用 **bcryptjs** 加密存储密码
- 密码最小长度：6 个字符
- 密码在数据库中不可逆加密

### 会话管理
- 使用 **NextAuth.js** 管理用户会话
- JWT Token 加密
- 会话有效期：30 天

### API 安全
- 所有用户数据 API 需要身份验证
- 用户只能访问自己的数据
- 服务器端验证所有请求

---

## 🎨 UI 组件

### AuthModal
登录/注册模态框，支持：
- 登录表单
- 注册表单
- 表单验证
- 错误提示

### UserMenu
用户菜单组件，提供：
- 用户头像和名称显示
- 我的计划链接
- 设置链接
- 退出登录

### Dashboard
用户中心页面，展示：
- 所有旅行计划列表
- 计划状态（草稿/已确认/已完成/已取消）
- 计划操作（查看/删除）

---

## 🌐 API 路由

### 认证 API

#### POST `/api/auth/register`
注册新用户

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三",
  "language": "zh"
}
```

**响应：**
```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "张三",
    "language": "zh"
  }
}
```

#### POST `/api/auth/signin`
用户登录（由 NextAuth 处理）

### 旅行计划 API

#### GET `/api/travel-plans`
获取用户的所有旅行计划

**查询参数：**
- `status`：按状态筛选
- `limit`：返回数量限制（默认50）
- `skip`：跳过数量（分页）

**响应：**
```json
{
  "success": true,
  "plans": [...],
  "total": 10
}
```

#### POST `/api/travel-plans`
创建新的旅行计划

**请求体：**
```json
{
  "title": "东京5日游",
  "destination": "东京",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "duration": 5,
  "travelers": 2,
  "budget": 10000,
  "interests": "美食、文化",
  "plan": "...",
  "status": "draft",
  "language": "zh"
}
```

#### GET `/api/travel-plans/[id]`
获取单个旅行计划详情

#### PATCH `/api/travel-plans/[id]`
更新旅行计划

#### DELETE `/api/travel-plans?id=[id]`
删除旅行计划

### 费用记录 API

#### GET `/api/expenses`
获取用户的费用记录

**查询参数：**
- `travelPlanId`：按计划筛选
- `category`：按类别筛选
- `limit`：返回数量限制
- `skip`：跳过数量

#### POST `/api/expenses`
创建新的费用记录

**请求体：**
```json
{
  "travelPlanId": "...",
  "category": "food",
  "amount": 150,
  "description": "午餐",
  "date": "2024-06-01"
}
```

#### DELETE `/api/expenses?id=[id]`
删除费用记录

---

## 🔧 技术栈

- **Next.js 14** - React 全栈框架
- **NextAuth.js** - 身份验证
- **MongoDB** - NoSQL 数据库
- **Mongoose** - MongoDB ODM
- **bcryptjs** - 密码加密
- **TypeScript** - 类型安全

---

## 📱 多设备支持

### 云端同步
- 所有数据实时同步到云端
- 在任何设备上登录即可访问
- 数据自动备份

### 响应式设计
- 完美适配桌面、平板、手机
- 触摸友好的交互
- 自适应布局

---

## 🐛 故障排除

### 无法连接数据库

**问题：** `MongoNetworkError: failed to connect to server`

**解决方案：**
1. 检查 `MONGODB_URI` 是否正确
2. 确保数据库服务正在运行
3. 检查网络连接和防火墙设置
4. MongoDB Atlas 需要添加 IP 白名单

### 登录失败

**问题：** `用户不存在` 或 `密码错误`

**解决方案：**
1. 确认邮箱和密码拼写正确
2. 重置密码或重新注册
3. 检查浏览器控制台错误信息

### NextAuth 错误

**问题：** `[next-auth][error][CLIENT_FETCH_ERROR]`

**解决方案：**
1. 确保 `NEXTAUTH_SECRET` 已设置
2. 确保 `NEXTAUTH_URL` 与实际URL匹配
3. 重启开发服务器

### 费用记录不同步

**问题：** 费用记录显示"本地存储"

**解决方案：**
1. 确认已登录
2. 检查网络连接
3. 查看浏览器控制台是否有错误

---

## 📈 最佳实践

### 数据安全
- 定期备份 MongoDB 数据
- 使用强密码
- 不要共享 NEXTAUTH_SECRET

### 性能优化
- 使用 MongoDB 索引提高查询速度
- 合理设置查询限制（limit）
- 使用分页加载大量数据

### 用户体验
- 提供清晰的错误提示
- 显示加载状态
- 自动保存用户数据

---

## 🆕 版本历史

### v2.0.0 - 用户管理系统
- ✅ 用户注册和登录
- ✅ 旅行计划云端存储
- ✅ 费用记录同步
- ✅ 用户中心和设置
- ✅ 多设备访问支持

---

## 📞 需要帮助？

如果遇到问题或有任何疑问：

1. 查看本文档的故障排除部分
2. 检查浏览器控制台错误信息
3. 查看服务器日志
4. 参考相关文档：
   - [NextAuth.js 文档](https://next-auth.js.org/)
   - [MongoDB 文档](https://docs.mongodb.com/)
   - [Mongoose 文档](https://mongoosejs.com/)

---

**🎉 恭喜！您现在拥有一个功能完整的用户管理系统！**

开始保存您的旅行计划，随时随地查看和管理！✈️🌍


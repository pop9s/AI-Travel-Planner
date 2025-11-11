# 环境变量配置完整指南

## 📋 概述

本文档详细说明了 AI Travel Planner 项目所需的所有环境变量配置。

## 🔧 配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Mac/Linux
touch .env.local
```

### 2. 复制并填写以下内容

将以下内容复制到 `.env.local` 文件中，并替换为您自己的密钥：

```bash
# 通义千问 API 密钥
DASHSCOPE_API_KEY=your_dashscope_api_key_here

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# 科大讯飞语音识别 API 密钥
NEXT_PUBLIC_IFLYTEK_APP_ID=your_iflytek_app_id_here
NEXT_PUBLIC_IFLYTEK_API_KEY=your_iflytek_api_key_here
NEXT_PUBLIC_IFLYTEK_API_SECRET=your_iflytek_api_secret_here

# 高德地图 API 密钥
NEXT_PUBLIC_AMAP_KEY=your_amap_api_key_here
NEXT_PUBLIC_AMAP_SECURITY_KEY=your_amap_security_key_here
```

## 🔑 各服务密钥获取指南

### 1. 通义千问 API（必需）

**用途**: AI 旅行计划生成

**获取步骤**:
1. 访问 [阿里云 DashScope](https://dashscope.aliyun.com/)
2. 注册/登录阿里云账号
3. 进入控制台，创建 API Key
4. 复制 API Key 到 `DASHSCOPE_API_KEY`

**详细文档**: [通义千问配置指南](../QWEN_SETUP.md)

---

### 2. Supabase 配置（必需）

**用途**: 数据库和用户认证

**获取步骤**:
1. 访问 [Supabase](https://supabase.com/)
2. 创建新项目
3. 在 Project Settings > API 中获取:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

**详细文档**: [Supabase 配置指南](../SUPABASE_SETUP.md)

---

### 3. NextAuth 配置（必需）

**用途**: 认证系统配置

**配置说明**:
- `NEXTAUTH_URL`: 本地开发使用 `http://localhost:3000`
- `NEXTAUTH_SECRET`: 生成随机字符串

**生成 Secret**:
```bash
# 使用 OpenSSL
openssl rand -base64 32

# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 4. 科大讯飞语音识别（可选）

**用途**: 增强的中文语音识别

**获取步骤**:
1. 访问 [科大讯飞开放平台](https://www.xfyun.cn/)
2. 注册/登录账号
3. 创建应用，选择"语音听写（流式版）WebAPI"
4. 获取:
   - `APPID` → `NEXT_PUBLIC_IFLYTEK_APP_ID`
   - `APIKey` → `NEXT_PUBLIC_IFLYTEK_API_KEY`
   - `APISecret` → `NEXT_PUBLIC_IFLYTEK_API_SECRET`

**详细文档**: [科大讯飞配置指南](../IFLYTEK_SETUP.md)

**注意**: 如果不配置，系统将使用浏览器原生语音识别

---

### 5. 高德地图 API（可选）

**用途**: 地图展示和导航功能

**获取步骤**:
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册/登录账号
3. 创建应用，选择"Web 端（JS API）"
4. 获取:
   - `Key` → `NEXT_PUBLIC_AMAP_KEY`
   - `安全密钥` → `NEXT_PUBLIC_AMAP_SECURITY_KEY`（可选）

**详细文档**: [高德地图配置指南](./AMAP_SETUP.md)

**注意**: 如果不配置，地图功能将不可用，但不影响其他功能

## ✅ 配置检查清单

### 最小配置（核心功能）
- [ ] `DASHSCOPE_API_KEY` - 通义千问 API
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 公钥
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase 服务密钥
- [ ] `NEXTAUTH_URL` - 认证 URL
- [ ] `NEXTAUTH_SECRET` - 认证密钥

### 完整配置（所有功能）
- [ ] 最小配置所有项
- [ ] `NEXT_PUBLIC_IFLYTEK_APP_ID` - 讯飞 APPID
- [ ] `NEXT_PUBLIC_IFLYTEK_API_KEY` - 讯飞 API Key
- [ ] `NEXT_PUBLIC_IFLYTEK_API_SECRET` - 讯飞 API Secret
- [ ] `NEXT_PUBLIC_AMAP_KEY` - 高德地图 Key
- [ ] `NEXT_PUBLIC_AMAP_SECURITY_KEY` - 高德地图安全密钥

## 🔒 安全注意事项

### ⚠️ 重要提醒

1. **不要提交 `.env.local` 文件到 Git**
   - 该文件已在 `.gitignore` 中
   - 绝不要公开您的 API 密钥

2. **区分公开和私密密钥**
   - `NEXT_PUBLIC_*` 前缀的密钥会暴露在客户端
   - 无 `NEXT_PUBLIC_` 前缀的密钥仅在服务器端使用

3. **生产环境配置**
   - 在部署平台（Vercel、Railway 等）配置环境变量
   - 使用不同的密钥区分开发和生产环境
   - 定期轮换 API 密钥

4. **白名单设置**
   - 高德地图建议配置域名白名单
   - Supabase 可配置允许的 URL
   - 讯飞可设置 IP 白名单

## 🚀 启动项目

配置完成后：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 🐛 故障排除

### 问题 1: "API Key 未配置"

**症状**: 控制台显示 API Key 相关错误

**解决方案**:
1. 检查 `.env.local` 文件是否存在
2. 确认环境变量名称拼写正确
3. 重启开发服务器（必需！）

### 问题 2: 配置未生效

**症状**: 修改了环境变量但没有效果

**解决方案**:
1. **停止开发服务器**（Ctrl+C）
2. **重新启动** `npm run dev`
3. 清除浏览器缓存

### 问题 3: Supabase 连接失败

**症状**: 数据库操作失败

**解决方案**:
1. 验证 Supabase URL 是否正确
2. 检查 API Key 是否有效
3. 确认 Supabase 项目是否在运行
4. 检查数据库表是否已创建

### 问题 4: 地图不显示

**症状**: 地图区域空白或显示错误

**解决方案**:
1. 检查高德地图 API Key 是否配置
2. 验证 Key 的服务平台是否选择了"Web 端"
3. 检查浏览器控制台的错误信息
4. 确认网络连接正常

## 📚 相关文档

- [快速开始指南](../QUICKSTART.md)
- [Supabase 配置](../SUPABASE_SETUP.md)
- [通义千问配置](../QWEN_SETUP.md)
- [科大讯飞配置](../IFLYTEK_SETUP.md)
- [高德地图配置](./AMAP_SETUP.md)

## 💡 最佳实践

1. **使用测试环境**
   - 先在测试环境配置和验证
   - 确认功能正常后再部署生产环境

2. **备份配置**
   - 将配置信息（不包含密钥）保存在安全的地方
   - 使用密码管理器保存 API 密钥

3. **监控使用量**
   - 定期检查各服务的 API 使用量
   - 设置用量告警避免超额

4. **文档化**
   - 记录团队成员的配置步骤
   - 更新部署文档

---

如有问题，请查看具体服务的详细配置文档或提交 Issue。


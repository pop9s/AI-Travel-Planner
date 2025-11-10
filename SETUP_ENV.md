# 环境配置指南

## 📋 概述

AI Travel Planner v2.0 需要配置以下环境变量才能完整运行：

- ✅ 通义千问 API（必需）
- ✅ MongoDB 数据库（必需）
- ✅ NextAuth 密钥（必需）
- 📱 科大讯飞语音（可选）

---

## 🚀 快速配置

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
touch .env.local
```

### 2. 复制以下内容到文件

```env
# ===================================
# 必需配置
# ===================================

# 通义千问 API 密钥
DASHSCOPE_API_KEY=sk-your-dashscope-api-key-here

# MongoDB 数据库连接
# 选项 A: 本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-travel-planner

# 选项 B: MongoDB Atlas (推荐)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-travel-planner?retryWrites=true&w=majority

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here

# ===================================
# 可选配置（语音识别）
# ===================================

# 科大讯飞语音识别 API
IFLYTEK_APP_ID=your_iflytek_app_id
IFLYTEK_API_SECRET=your_iflytek_api_secret
IFLYTEK_API_KEY=your_iflytek_api_key
```

---

## 🔑 获取 API 密钥

### 1. 通义千问 API（必需）

#### 步骤：
1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 进入"模型广场" → "通义千问"
4. 点击"获取API-KEY"
5. 复制 API Key 到 `DASHSCOPE_API_KEY`

#### 注意：
- 新用户有免费额度
- 通义千问价格实惠（相比 OpenAI）
- 详细说明：[QWEN_SETUP.md](QWEN_SETUP.md)

---

### 2. MongoDB 数据库（必需）

#### 选项 A：MongoDB Atlas（推荐）

**优点：**
- ☁️ 云端托管，免运维
- 🆓 免费层 512MB（足够个人使用）
- 🌍 全球分布式
- 💪 自动备份

**步骤：**
1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. 注册免费账户
3. 创建新集群（选择免费层）
4. 配置网络访问：
   - 点击 "Network Access"
   - 添加 IP 地址：`0.0.0.0/0`（允许所有IP，开发用）
5. 创建数据库用户：
   - 点击 "Database Access"
   - 添加新用户，设置用户名和密码
6. 获取连接字符串：
   - 点击 "Connect" → "Connect your application"
   - 复制连接字符串
   - 替换 `<password>` 为你的密码
   - 替换数据库名为 `ai-travel-planner`

**示例连接字符串：**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ai-travel-planner?retryWrites=true&w=majority
```

#### 选项 B：本地 MongoDB

**使用 Docker（推荐）：**
```bash
# 启动 MongoDB 容器
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

**手动安装：**
1. 访问 [MongoDB 官网](https://www.mongodb.com/try/download/community)
2. 下载并安装 MongoDB Community Server
3. 启动 MongoDB 服务
4. 连接字符串：`mongodb://localhost:27017/ai-travel-planner`

---

### 3. NextAuth Secret（必需）

#### 生成随机密钥：

**方法 1：使用 OpenSSL（推荐）**
```bash
openssl rand -base64 32
```

**方法 2：使用 Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**方法 3：在线生成**
访问 [Generate Random](https://generate-random.org/api-key-generator)

#### 示例：
```env
NEXTAUTH_SECRET=aBcD1234eFgH5678iJkL90mnOpQrStUv
```

⚠️ **重要**：
- 密钥必须是随机生成的
- 不要使用示例密钥
- 保密此密钥，不要提交到 Git

---

### 4. 科大讯飞语音（可选）

**如果不配置：**
- 语音输入功能会自动使用浏览器原生 Web Speech API
- 仍然可用，但准确度可能稍低

**如果要配置：**
1. 访问 [科大讯飞开放平台](https://www.xfyun.cn/)
2. 注册并创建应用
3. 获取 APPID、APISecret、APIKey
4. 详细说明：[IFLYTEK_SETUP.md](IFLYTEK_SETUP.md)

---

## ✅ 验证配置

### 1. 检查文件是否存在
```bash
ls -la .env.local
```

### 2. 启动服务器
```bash
npm run dev
```

### 3. 检查日志

**成功的日志：**
```
✓ Ready in 3.5s
✓ MongoDB 连接成功
- Local:        http://localhost:3000
```

**失败的日志：**
```
❌ MongoDB 连接失败: ...
Error: No API-key provided
```

### 4. 测试功能

#### 测试用户注册：
1. 打开 http://localhost:3000
2. 点击右上角"登录"
3. 切换到"注册"
4. 填写信息并提交

**成功**：注册成功，自动登录
**失败**：检查 MongoDB 连接

#### 测试旅行计划：
1. 填写旅行信息
2. 点击"生成旅行计划"

**成功**：生成计划
**失败**：检查通义千问 API Key

#### 测试保存计划：
1. 生成计划后
2. 点击"保存计划"

**成功**：显示"已保存"
**失败**：检查 MongoDB 和 NextAuth 配置

---

## 🔍 常见问题

### Q: MongoDB 连接失败

**A: 检查以下项：**
1. MongoDB Atlas IP 白名单是否包含你的 IP
2. 用户名和密码是否正确
3. 连接字符串格式是否正确
4. 数据库名称是否一致

### Q: NextAuth 登录失败

**A: 检查以下项：**
1. `NEXTAUTH_SECRET` 是否已设置
2. `NEXTAUTH_URL` 是否与实际URL匹配
3. 是否重启了服务器
4. 浏览器是否允许 Cookie

### Q: 通义千问 API 报错

**A: 检查以下项：**
1. API Key 是否正确（不要有空格）
2. 账户是否有额度
3. API Key 是否已激活
4. 网络连接是否正常

### Q: 科大讯飞语音不工作

**A:**
- 科大讯飞是可选功能
- 不配置时会自动使用浏览器语音
- 如需配置，参考 [IFLYTEK_SETUP.md](IFLYTEK_SETUP.md)

---

## 🔒 安全建议

### 开发环境
- ✅ 使用 `.env.local`（已在 `.gitignore` 中）
- ✅ 不要提交 `.env.local` 到 Git
- ✅ 使用强密码
- ✅ 定期更换 API Key

### 生产环境
- ✅ 使用环境变量
- ✅ 启用 MongoDB 认证
- ✅ 限制 MongoDB Atlas IP 白名单
- ✅ 使用 HTTPS
- ✅ 定期备份数据库

---

## 📝 完整示例

`.env.local` 完整示例：

```env
# ===================================
# AI Travel Planner v2.0 环境配置
# ===================================

# 通义千问 API
DASHSCOPE_API_KEY=sk-abc123xyz456def789ghi012jkl345mno

# MongoDB Atlas（生产）
MONGODB_URI=mongodb+srv://traveluser:SecurePass123@cluster0.abc12.mongodb.net/ai-travel-planner?retryWrites=true&w=majority

# 本地 MongoDB（开发）
# MONGODB_URI=mongodb://localhost:27017/ai-travel-planner

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=aBcD1234eFgH5678iJkL90mnOpQrStUvWxYz+AbCdEfGh==

# 科大讯飞语音（可选）
IFLYTEK_APP_ID=12345678
IFLYTEK_API_SECRET=abc123def456ghi789jkl012mno345pq
IFLYTEK_API_KEY=xyz789uvw456rst123opq012lmn345kl
```

---

## 🎓 下一步

配置完成后：

1. 📖 阅读 [用户系统文档](USER_SYSTEM.md)
2. 🎯 查看 [使用指南](USAGE.md)
3. 🚀 参考 [部署指南](DEPLOYMENT.md)

---

**需要帮助？** 检查相关文档或查看错误日志！

祝您使用愉快！✈️🌍


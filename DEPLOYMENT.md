# 部署指南

## 快速部署到Vercel

### 步骤1: 准备工作

1. 确保你有一个GitHub账号
2. 注册一个 [Vercel](https://vercel.com) 账号
3. 获取 [OpenAI API Key](https://platform.openai.com/api-keys)

### 步骤2: 推送代码到GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/AI-Travel-Planner.git
git push -u origin main
```

### 步骤3: 在Vercel上部署

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入你的GitHub仓库
4. 配置项目:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### 步骤4: 配置环境变量

在Vercel项目设置中添加环境变量:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

### 步骤5: 部署

点击 "Deploy" 按钮，等待部署完成。

## 部署到其他平台

### Netlify

1. 安装 Next.js 插件
```bash
npm install -D @netlify/plugin-nextjs
```

2. 创建 `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

3. 在Netlify Dashboard中配置环境变量

### Railway

1. 创建 `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. 在Railway Dashboard中添加环境变量

### Docker

1. 创建 `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. 构建和运行:
```bash
docker build -t ai-travel-planner .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key ai-travel-planner
```

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API密钥 | 是 |

## 性能优化建议

1. **使用CDN**: 静态资源通过CDN分发
2. **启用压缩**: 确保gzip/brotli压缩已启用
3. **图片优化**: 使用Next.js Image组件
4. **缓存策略**: 配置合理的缓存头
5. **边缘函数**: 使用Vercel Edge Functions加速API响应

## 监控和日志

建议配置以下监控工具:

- **Vercel Analytics**: 页面性能监控
- **Sentry**: 错误追踪
- **LogRocket**: 用户会话记录
- **OpenAI Usage**: 监控API使用量

## 成本估算

### Vercel (推荐)
- **Hobby Plan**: 免费
  - 100GB带宽/月
  - 无限部署
  - 适合个人项目

- **Pro Plan**: $20/月
  - 1TB带宽/月
  - 更好的性能
  - 适合生产环境

### OpenAI API
- **GPT-4 Turbo**: ~$0.01-0.03/请求
- **GPT-3.5 Turbo**: ~$0.002/请求

**月度成本估算** (1000次请求):
- GPT-4 Turbo: $10-30
- GPT-3.5 Turbo: $2

## 故障排除

### 部署失败

1. 检查 Node.js 版本 (需要 >= 18)
2. 清除缓存: `npm clean-install`
3. 检查环境变量是否正确设置

### API错误

1. 验证 `OPENAI_API_KEY` 是否有效
2. 检查 OpenAI 账户余额
3. 查看 API 速率限制

### 性能问题

1. 使用 GPT-3.5 代替 GPT-4 降低延迟
2. 启用流式响应
3. 使用边缘函数部署

## 安全建议

1. **环境变量**: 永远不要提交 `.env.local` 到Git
2. **API密钥**: 定期轮换密钥
3. **速率限制**: 实现请求限流
4. **输入验证**: 验证所有用户输入
5. **HTTPS**: 确保使用HTTPS

## 更新和维护

```bash
# 更新依赖
npm update

# 检查过期包
npm outdated

# 运行安全审计
npm audit

# 自动修复安全问题
npm audit fix
```


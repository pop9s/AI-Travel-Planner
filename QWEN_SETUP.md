# 通义千问 API 配置指南

本项目使用**阿里云通义千问**（Qwen）大模型作为 AI 引擎。

## 🔑 获取 API 密钥

### 步骤 1: 注册阿里云账号

1. 访问 [阿里云官网](https://www.aliyun.com/)
2. 注册/登录账号

### 步骤 2: 开通灵积（DashScope）服务

1. 访问 [灵积（DashScope）控制台](https://dashscope.console.aliyun.com/)
2. 点击"开通服务"（如果未开通）
3. 阅读并同意服务协议

### 步骤 3: 获取 API Key

1. 访问 [API Key 管理页面](https://dashscope.console.aliyun.com/apiKey)
2. 点击"创建新的 API Key"
3. 复制生成的 API Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxx`）

### 步骤 4: 配置到项目

创建 `.env.local` 文件：

```bash
DASHSCOPE_API_KEY=sk-your-api-key-here
```

## 💰 费用说明

### 免费额度

通义千问提供免费试用额度：
- 新用户注册后获得一定的免费调用量
- 适合开发测试使用

### 模型定价（参考）

| 模型 | 速度 | 质量 | 价格（元/百万tokens） |
|------|------|------|----------------------|
| qwen-turbo | 快 | 良好 | 约 ¥0.4 |
| qwen-plus | 中等 | 优秀 | 约 ¥2 |
| qwen-max | 较慢 | 最佳 | 约 ¥20 |

**注意**: 具体价格以[官方定价](https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-thousand-questions-metering-and-billing)为准

### 成本估算

单次旅行计划生成（约3000 tokens）：
- qwen-turbo: ¥0.001-0.002
- qwen-plus: ¥0.006-0.01
- qwen-max: ¥0.06-0.1

**对比 OpenAI GPT-4**: 通义千问价格约为 GPT-4 的 1/10 到 1/50

## 🎛️ 模型选择

在 `app/api/plan/route.ts` 中修改模型：

```typescript
body: JSON.stringify({
  model: 'qwen-plus', // 修改这里
  // ...
})
```

### 推荐配置

- **开发测试**: `qwen-turbo` - 快速且便宜
- **生产环境**: `qwen-plus` - 性能和成本平衡（推荐）
- **高质量需求**: `qwen-max` - 最佳质量

## 📊 模型对比

### qwen-turbo
- ✅ 响应速度快（3-8秒）
- ✅ 价格最低
- ⚠️ 输出质量中等
- 适合: 快速原型、测试

### qwen-plus（推荐）
- ✅ 性价比高
- ✅ 输出质量优秀
- ✅ 响应速度适中（8-15秒）
- 适合: 生产环境

### qwen-max
- ✅ 输出质量最佳
- ✅ 推理能力强
- ⚠️ 价格较高
- ⚠️ 响应较慢（15-30秒）
- 适合: 高质量要求场景

## 🔧 API 配置参数

```typescript
{
  model: 'qwen-plus',
  input: {
    messages: [
      { role: 'system', content: '系统提示词' },
      { role: 'user', content: '用户输入' }
    ]
  },
  parameters: {
    result_format: 'message',
    temperature: 0.8,      // 创造性 (0-2)
    max_tokens: 3000,      // 最大输出长度
    top_p: 0.8,           // 可选
    top_k: 50             // 可选
  }
}
```

### 参数说明

- **temperature**: 控制随机性
  - 0-0.5: 更确定、保守
  - 0.5-1.0: 平衡
  - 1.0-2.0: 更创造性、随机

- **max_tokens**: 最大输出长度
  - 推荐: 2000-4000（旅行计划）

- **top_p**: 核采样概率
  - 推荐: 0.8-0.95

## 🚀 快速测试

创建测试文件 `test-qwen.js`:

```javascript
const DASHSCOPE_API_KEY = 'your-api-key'
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

async function testQwen() {
  const response = await fetch(DASHSCOPE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'user',
            content: '你好，请介绍一下你自己'
          }
        ]
      },
      parameters: {
        result_format: 'message'
      }
    })
  })

  const data = await response.json()
  console.log(data.output.choices[0].message.content)
}

testQwen()
```

运行测试:
```bash
node test-qwen.js
```

## ⚠️ 常见问题

### 1. API Key 无效

**错误信息**: "Invalid API Key" 或 401

**解决方案**:
- 检查 `.env.local` 文件是否存在
- 确认 API Key 正确无误
- 重启开发服务器

### 2. 超出配额

**错误信息**: "Quota exceeded"

**解决方案**:
- 查看[控制台额度](https://dashscope.console.aliyun.com/)
- 充值或等待配额刷新

### 3. 请求超时

**错误信息**: "Request timeout"

**解决方案**:
- 使用更快的模型（qwen-turbo）
- 减少 max_tokens 参数
- 检查网络连接

### 4. 输出质量不理想

**解决方案**:
- 升级到 qwen-plus 或 qwen-max
- 优化 prompt 提示词
- 调整 temperature 参数

## 📚 相关文档

- [通义千问官方文档](https://help.aliyun.com/zh/dashscope/)
- [API 参考](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
- [模型介绍](https://help.aliyun.com/zh/dashscope/developer-reference/model-introduction)
- [计费说明](https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-thousand-questions-metering-and-billing)

## 🔐 安全建议

1. ✅ 不要将 API Key 提交到 Git
2. ✅ 使用环境变量存储密钥
3. ✅ 定期轮换 API Key
4. ✅ 监控 API 使用量
5. ✅ 设置费用预警

## 💡 优化建议

### 1. 缓存常见请求

```typescript
const cache = new Map()

if (cache.has(cacheKey)) {
  return cache.get(cacheKey)
}
```

### 2. 实现重试机制

```typescript
const maxRetries = 3
for (let i = 0; i < maxRetries; i++) {
  try {
    const response = await fetch(...)
    break
  } catch (error) {
    if (i === maxRetries - 1) throw error
    await sleep(1000 * (i + 1))
  }
}
```

### 3. 流式输出（可选）

通义千问支持 SSE 流式输出，可以提升用户体验：

```typescript
parameters: {
  result_format: 'message',
  incremental_output: true
}
```

---

**配置完成后，运行 `npm run dev` 开始使用！** 🚀


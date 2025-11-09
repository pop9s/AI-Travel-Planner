# 🎤 语音识别快速配置

选择适合你的语音识别方案，快速开始！

## 🚀 快速决策

### 方案A: 不配置（使用浏览器原生）

**优点**: 🆓 免费，⚡ 无需配置  
**缺点**: ⚠️ 部分浏览器不支持，准确度中等  

**适合**: 快速开始，个人项目

```bash
# 无需任何配置！
npm run dev
# 直接开始使用（Chrome/Edge/Safari）
```

### 方案B: 配置科大讯飞（推荐）✅

**优点**: ⭐ 准确度高，✅ 全浏览器支持，🗣️ 支持方言  
**缺点**: ⚙️ 需要配置，💰 超额付费  

**适合**: 生产环境，商业项目

## ⚡ 3分钟配置科大讯飞

### 步骤 1: 注册账号 (1分钟)

访问: https://www.xfyun.cn/

点击"注册" → 填写信息 → 完成注册

### 步骤 2: 创建应用 (1分钟)

1. 进入 [控制台](https://console.xfyun.cn/)
2. 点击"创建新应用"
3. 填写：
   ```
   应用名称: AI Travel Planner
   应用平台: WebAPI
   ```
4. 提交创建

### 步骤 3: 开通服务 (30秒)

1. 在应用列表点击你的应用
2. 点击"添加服务"
3. 选择"语音听写（流式版）WebAPI"
4. 点击"开通"（免费）

### 步骤 4: 获取密钥 (30秒)

在应用详情页面复制：

```
APPID:     12345678
APIKey:    1234567890abcdef1234567890abcdef
APISecret: 1234567890abcdef1234567890abcdef
```

### 步骤 5: 配置项目 (30秒)

编辑 `.env.local` 文件，添加：

```env
# 科大讯飞语音识别
NEXT_PUBLIC_IFLYTEK_APP_ID=12345678
NEXT_PUBLIC_IFLYTEK_API_KEY=1234567890abcdef1234567890abcdef
NEXT_PUBLIC_IFLYTEK_API_SECRET=1234567890abcdef1234567890abcdef
```

### 步骤 6: 重启服务器

```bash
# 按 Ctrl+C 停止
# 然后重新启动
npm run dev
```

### ✅ 验证配置

访问 http://localhost:3001，检查：

1. ✨ 麦克风按钮是**渐变色**（蓝→紫）
2. ✨ 按钮右上角有**小星星**图标
3. 🎤 点击录音，提示框显示"**讯飞**"标识

**看到这些就说明配置成功了！** 🎉

## 📋 配置检查清单

```
□ 已注册科大讯飞账号
□ 已创建应用
□ 已开通"语音听写"服务
□ 已获取 APPID、APIKey、APISecret
□ 已添加到 .env.local 文件
□ 变量名以 NEXT_PUBLIC_ 开头
□ 已重启开发服务器
□ 麦克风按钮显示渐变色
□ 测试录音正常工作
```

## 🧪 快速测试

### 测试脚本

创建 `test-iflytek.html` 测试连接：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>测试科大讯飞</title>
</head>
<body>
  <h1>科大讯飞语音识别测试</h1>
  <button onclick="testConnection()">测试连接</button>
  <div id="result"></div>
  
  <script>
    function testConnection() {
      const appId = 'your-app-id'
      const apiKey = 'your-api-key'
      const apiSecret = 'your-api-secret'
      
      // 测试逻辑...
      document.getElementById('result').innerHTML = '测试中...'
    }
  </script>
</body>
</html>
```

### 在应用中测试

1. 启动应用: `npm run dev`
2. 访问: http://localhost:3001
3. 点击目的地输入框旁的🎤按钮
4. 允许麦克风权限
5. 说："东京"
6. 检查是否正确识别

## 💰 免费额度说明

### 新用户福利

```
免费调用量: 500万字
有效期: 1年
每次调用约: 20-30字
可用次数: ~250,000次

足够个人项目使用！
```

### 超额怎么办？

1. **充值购买** - ¥1.5/万字
2. **降级使用** - 自动切换到浏览器原生
3. **优化使用** - 限制调用频率

## ⚠️ 常见问题

### Q: 配置后不生效？

**检查:**
1. 环境变量名是否以 `NEXT_PUBLIC_` 开头
2. 是否重启了服务器
3. `.env.local` 文件是否在根目录
4. 值是否正确（无多余空格/引号）

### Q: 如何知道用的是哪种方案？

**看按钮样式:**
- 🌈 渐变色 + ✨ 星星 = 科大讯飞
- 🔵 纯蓝色 = 浏览器原生

**看录音提示:**
- 显示"讯飞"标识 = 科大讯飞
- 无标识 = 浏览器原生

### Q: 两种方案可以切换吗？

**可以！**
- 配置科大讯飞后自动使用
- 删除配置自动降级到浏览器原生
- 无需修改代码

### Q: Firefox 浏览器能用吗？

- **科大讯飞**: ✅ 可以！
- **浏览器原生**: ❌ 不支持

## 🎯 推荐配置

### 个人学习项目
```env
# 不配置，使用浏览器原生
# 简单、免费、够用
```

### 演示/作品集
```env
# 配置科大讯飞
# 展示更专业的效果
NEXT_PUBLIC_IFLYTEK_APP_ID=xxx
NEXT_PUBLIC_IFLYTEK_API_KEY=xxx
NEXT_PUBLIC_IFLYTEK_API_SECRET=xxx
```

### 生产环境
```env
# 必须配置科大讯飞
# 更准确、更稳定
NEXT_PUBLIC_IFLYTEK_APP_ID=xxx
NEXT_PUBLIC_IFLYTEK_API_KEY=xxx
NEXT_PUBLIC_IFLYTEK_API_SECRET=xxx
```

## 📚 相关文档

- 📖 [科大讯飞详细配置](IFLYTEK_SETUP.md)
- 📊 [方案对比分析](VOICE_COMPARISON.md)
- 🎤 [语音输入使用指南](VOICE_INPUT_FEATURE.md)

## 💡 小贴士

### 1. 免费开发

在免费额度内开发和测试：
- 500万字 ≈ 25万次调用
- 足够开发使用

### 2. 成本控制

监控使用量：
- 访问 [科大讯飞控制台](https://console.xfyun.cn/)
- 查看"服务用量"
- 设置预警

### 3. 降级方案

如果超额或连接失败：
- 自动降级到浏览器原生API
- 用户无感知切换
- 保证功能可用

## 🎉 开始使用

### 立即开始（浏览器原生）

```bash
npm run dev
# 访问 http://localhost:3001
# 点击🎤按钮，开始语音输入！
```

### 升级体验（科大讯飞）

1. 花3分钟配置科大讯飞
2. 重启服务器
3. 享受98%准确度的语音识别！

---

**选择你的方案，开始语音输入之旅！** 🎤✨

**提示**: 两种方案都很好，根据你的需求选择即可！


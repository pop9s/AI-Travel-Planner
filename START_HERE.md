# 🚀 从这里开始

欢迎使用 AI Travel Planner！这是一个简短的入门指南。

## 第一步：安装依赖

```bash
npm install
```

## 第二步：配置API密钥

1. 复制环境变量示例文件：
```bash
cp .env.local.example .env.local
```

2. 获取通义千问 API 密钥：
   - 访问 https://dashscope.console.aliyun.com/apiKey
   - 注册/登录阿里云
   - 创建新的 API Key
   
3. 编辑 `.env.local` 文件：
```env
DASHSCOPE_API_KEY=sk-your-key-here
```

📖 详细说明: [通义千问配置指南](QWEN_SETUP.md)

## 第三步：启动应用

```bash
npm run dev
```

## 第四步：开始使用

打开浏览器访问: **http://localhost:3000**

填写表单，生成你的第一个AI旅行计划！

---

## 📚 需要更多帮助？

- 🚀 [快速开始指南](QUICKSTART.md) - 详细安装说明
- 📖 [使用指南](USAGE.md) - 功能说明
- 🏗️ [项目概览](PROJECT_OVERVIEW.md) - 技术架构
- 📋 [README](README.md) - 完整文档

## ⚡ 常用命令

```bash
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run start      # 启动生产服务器
npm run lint       # 代码检查
```

## 🐛 遇到问题？

1. 确保Node.js版本 >= 18
2. 检查 `.env.local` 文件是否存在
3. 验证API密钥是否正确
4. 重启开发服务器

---

**准备好了吗？开始你的AI旅行规划之旅！** ✈️


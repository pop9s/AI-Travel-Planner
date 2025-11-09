# AI Travel Planner - AI旅行规划师 ✈️

一个基于AI的智能旅行规划Web应用，帮助用户根据个人需求快速生成个性化的旅行计划。

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 快速开始

```bash
# 克隆项目
git clone https://github.com/yourusername/AI-Travel-Planner.git
cd AI-Travel-Planner

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 添加你的 OPENAI_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始使用！

📖 **新手？** 请查看 [从这里开始](START_HERE.md)
📖 **详细说明** 请查看 [快速开始指南](QUICKSTART.md)

## ✨ 功能特点

- 🤖 **AI智能规划**: 使用阿里云通义千问大模型生成专业的旅行计划
- 🎨 **现代化UI**: 基于Tailwind CSS的美观响应式设计
- 📋 **详细行程**: 包含每日行程、餐饮推荐、住宿建议、预算分解
- 💾 **导出分享**: 支持下载旅行计划和分享功能
- ⚡ **快速响应**: 基于Next.js 14的高性能架构
- 🌏 **多场景支持**: 适用于各种旅行目的地和需求
- 💰 **成本友好**: 使用国内大模型，价格更实惠

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI库**: React 18
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **AI服务**: 阿里云通义千问 (Qwen)
- **图标**: Lucide React

## 📚 文档导航

- 📖 [快速开始指南](QUICKSTART.md) - 5分钟快速上手
- 🔑 [通义千问配置](QWEN_SETUP.md) - API密钥获取和配置
- 📖 [使用指南](USAGE.md) - 详细功能说明和使用技巧
- 🚀 [部署指南](DEPLOYMENT.md) - 部署到生产环境
- 🏗️ [项目结构](PROJECT_STRUCTURE.md) - 代码架构和目录说明
- 🤝 [贡献指南](CONTRIBUTING.md) - 如何参与开发

## 📸 项目截图

### 主页面
填写旅行需求，AI将为你生成专属计划

### 旅行计划
详细的每日行程、餐饮推荐、预算分解

### 响应式设计
完美支持桌面端和移动端

## 🚀 部署

### Vercel (推荐)

1. 将代码推送到GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量 `OPENAI_API_KEY`
4. 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/AI-Travel-Planner)

### 其他平台

本项目是标准的Next.js应用，可以部署到任何支持Node.js的平台：

- **Netlify**: 使用Next.js构建插件
- **Railway**: 直接部署
- **Docker**: 使用Next.js官方Docker镜像

## 📖 使用说明

1. **填写旅行信息**
   - 目的地：输入想去的城市或国家
   - 出发日期：选择旅行开始日期
   - 旅行天数：计划的旅行时长
   - 旅行人数：同行人数
   - 预算：总预算（人民币）
   - 兴趣爱好：如美食、历史、自然等
   - 特殊要求：任何特殊需求或偏好

2. **生成计划**
   - 点击"生成AI旅行计划"按钮
   - AI将在几秒钟内生成详细的旅行计划

3. **查看与导出**
   - 在右侧查看生成的旅行计划
   - 使用"下载计划"保存为文本文件
   - 使用"分享"功能分享给朋友

## 🎯 项目结构

```
AI-Travel-Planner/
├── app/
│   ├── api/
│   │   └── plan/
│   │       └── route.ts          # AI旅行规划API
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
├── components/
│   ├── ui/                       # UI组件库
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── label.tsx
│   └── TravelPlan.tsx            # 旅行计划展示组件
├── lib/
│   └── utils.ts                  # 工具函数
├── public/                       # 静态资源
├── .env.local                    # 环境变量（需自行创建）
├── next.config.js                # Next.js配置
├── tailwind.config.js            # Tailwind配置
├── tsconfig.json                 # TypeScript配置
└── package.json                  # 项目依赖
```

## 🔧 自定义配置

### 修改AI模型

在 `app/api/plan/route.ts` 中修改模型：

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview', // 可改为 'gpt-3.5-turbo' 以降低成本
  // ...
})
```

### 调整AI响应长度

修改 `max_tokens` 参数：

```typescript
max_tokens: 3000, // 增加以获得更详细的计划
```

### 自定义样式

- 修改 `app/globals.css` 中的CSS变量
- 编辑 `tailwind.config.js` 自定义主题

## 💡 功能规划

- [ ] 用户登录和历史记录保存
- [ ] 地图集成显示景点位置
- [ ] 多语言支持
- [ ] 导出为PDF格式
- [ ] 天气预报集成
- [ ] 航班和酒店预订集成
- [ ] 社交分享优化
- [ ] 评论和评分系统

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [OpenAI](https://openai.com/) - AI服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Lucide](https://lucide.dev/) - 图标库

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/yourusername/AI-Travel-Planner/issues)
- Email: your.email@example.com

---

**Enjoy your AI-powered travel planning! 🌍✨**

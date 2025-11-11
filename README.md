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
# 编辑 .env.local 添加你的 API_KEY
# 通义千问 API 密钥
DASHSCOPE_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
 # 高德地图 API 密钥
NEXT_PUBLIC_AMAP_KEY=
NEXT_PUBLIC_AMAP_SECURITY_KEY=
# NextAuth 配置
NEXTAUTH_URL=
NEXTAUTH_SECRET=
# 科大讯飞语音识别 API 密钥
NEXT_PUBLIC_IFLYTEK_APP_ID=
NEXT_PUBLIC_IFLYTEK_API_KEY=
NEXT_PUBLIC_IFLYTEK_API_SECRET=
# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始使用！

📖 **新手？** 请查看 [从这里开始](START_HERE.md)
📖 **详细说明** 请查看 [快速开始指南](QUICKSTART.md)

## ✨ 功能特点

### 核心功能
- 🤖 **AI智能规划**: 使用阿里云通义千问大模型生成专业的旅行计划
- 👤 **用户管理**: 注册登录系统，安全的账户管理 🆕
- ☁️ **云端同步**: 旅行计划、费用记录自动云端同步，多设备访问 🆕
- 📚 **计划管理**: 保存和管理多份旅行计划，随时查看编辑 🆕
- 💰 **费用管理**: 智能记录旅行开销，AI 实时分析预算使用情况
- 🗺️ **地图导航**: 基于高德地图的地理位置服务和智能导航 🆕

### 体验功能
- 🌍 **多语言支持**: 自动语言检测，支持中/英/日/韩 4 种语言
- 🎤 **语音输入**: 支持科大讯飞语音识别，更准确的中文识别
- 🔍 **地点搜索**: 搜索景点、餐厅、酒店等，一键导航 🆕
- 🧭 **路线规划**: 智能路线规划，显示距离和预计时间 🆕
- 🎨 **现代化UI**: 基于Tailwind CSS的美观响应式设计
- 📋 **详细行程**: 包含每日行程、餐饮推荐、住宿建议、预算分解
- ⚡ **快速响应**: 基于Next.js 14的高性能架构
- 🌏 **多场景支持**: 适用于各种旅行目的地和需求
- 💵 **成本友好**: 使用国内大模型，价格更实惠

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **UI库**: React 18
- **样式**: Tailwind CSS + Shadcn/ui
- **语言**: TypeScript
- **图标**: Lucide React

### 后端
- **API路由**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **AI服务**: 阿里云通义千问 (Qwen)
- **语音识别**: 科大讯飞 WebAPI
- **地图服务**: 高德地图 API

## 📚 文档导航

### 快速开始
- 📖 [快速开始指南](QUICKSTART.md) - 5分钟快速上手
- 🗄️ [Supabase 配置](SUPABASE_SETUP.md) - 数据库和认证配置（5分钟）🆕
- 🔑 [通义千问配置](QWEN_SETUP.md) - API密钥获取和配置
- 🗺️ [高德地图配置](docs/AMAP_SETUP.md) - 地图API密钥获取和配置 🆕

### 核心功能
- 👤 [用户管理系统](USER_SYSTEM.md) - 注册登录、云端同步完整指南
- 💰 [费用预算管理](BUDGET_FEATURE.md) - 智能费用记录与 AI 预算分析
- 🗺️ [地图导航功能](README_MAP_FEATURE.md) - 地图展示、地点搜索、路线规划 🆕
- 🌍 [多语言功能](MULTILANG_FEATURE.md) - 多语言支持和语言检测

### 语音功能
- 🎤 [语音输入功能](VOICE_INPUT_FEATURE.md) - 语音输入使用指南
- 🎙️ [科大讯飞配置](IFLYTEK_SETUP.md) - 科大讯飞语音识别配置
- 📊 [语音方案对比](VOICE_COMPARISON.md) - 两种语音识别方案对比

### 开发文档
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

## 💡 已完成功能

- [x] 多语言支持（中/英/日/韩）
- [x] 语音输入（浏览器原生 + 科大讯飞）
- [x] 用户登录和历史记录保存
- [x] 费用预算管理
- [x] AI 预算分析
- [x] 智能数字识别
- [x] 地图集成显示景点位置 🆕
- [x] 地点搜索和路线规划 🆕

## 🚧 规划中的功能

- [ ] 导出为PDF格式
- [ ] 天气预报集成
- [ ] 航班和酒店预订集成
- [ ] 社交分享优化
- [ ] 评论和评分系统
- [ ] 费用数据导出和统计图表
- [ ] 实时路况显示
- [ ] 公交/地铁路线规划
- [ ] 周边推荐（美食、酒店、景点）

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
- [阿里云通义千问](https://dashscope.aliyun.com/) - AI服务
- [Supabase](https://supabase.com/) - 数据库和认证
- [高德地图](https://lbs.amap.com/) - 地图服务
- [科大讯飞](https://www.xfyun.cn/) - 语音识别
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Lucide](https://lucide.dev/) - 图标库

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/yourusername/AI-Travel-Planner/issues)
- Email: your.email@example.com

---

**Enjoy your AI-powered travel planning! 🌍✨**

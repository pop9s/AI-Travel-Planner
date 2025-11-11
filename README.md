# AI Travel Planner - AI旅行规划师 ✈️

一个基于AI的智能旅行规划Web应用，集成阿里云通义千问大模型、高德地图、科大讯飞语音识别等技术，为用户提供从行程规划、费用管理到地图导航的一站式旅行解决方案。

## 📖 项目简介

AI Travel Planner 是一个现代化的全栈Web应用，旨在帮助旅行者轻松规划和管理旅行。通过AI技术，用户只需输入基本旅行信息（目的地、日期、预算、兴趣等），即可在几秒钟内获得包含每日行程、餐饮推荐、住宿建议、预算分解等详细内容的个性化旅行计划。

### 🎯 项目特色

- **🤖 AI驱动**：基于阿里云通义千问大模型，生成专业、详细的旅行计划
- **☁️ 云端同步**：所有数据实时同步到云端，支持多设备访问
- **🗺️ 地图集成**：集成高德地图，提供地点搜索、路线规划、实时导航
- **💰 智能预算**：实时跟踪旅行开销，AI分析预算使用情况，提供优化建议
- **🌍 多语言支持**：自动语言检测，支持中文、英文、日文、韩文
- **🎤 语音输入**：支持科大讯飞语音识别，快速记录旅行信息
- **📱 响应式设计**：完美适配桌面端和移动端
- **🔒 安全可靠**：基于Supabase的用户认证和数据存储，保障数据安全

### 🚀 适用场景

- **个人旅行规划**：快速生成个性化旅行计划
- **团队旅行**：多人协作，共享旅行计划
- **预算管理**：实时跟踪旅行开销，避免超支
- **行程优化**：AI分析并提供行程优化建议
- **地点探索**：地图搜索景点、餐厅、酒店，规划最优路线

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 快速开始

### 方式一：使用 Docker 镜像（推荐）

```bash
# 1. 拉取镜像
docker pull crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 2. 创建 .env 文件，配置环境变量（见 API 配置要求）

# 3. 运行容器
docker run -d -p 3000:3000 --env-file .env --name ai-travel-planner crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

访问：**http://localhost:3000**

### 方式二：Git Clone 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/AI-Travel-Planner.git
cd AI-Travel-Planner

# 安装依赖
npm install

# 配置环境变量（创建 .env.local 文件，见 API 配置要求）
# 初始化数据库（在 Supabase SQL Editor 中执行 supabase/migrations/001_initial_schema.sql）

# 启动开发服务器
npm run dev
```

## 🔑 API 配置要求

### 必需配置
创建 `.env` 文件（Docker方式）或 `.env.local` 文件（本地开发），添加以下配置：

```env
# 必需配置
# ===================================

# Supabase 配置
# 获取方式：访问 https://supabase.com/ 创建项目
# 在 Project Settings > API 中获取以下信息
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzE2ODAwMCwiZXhwIjoxOTYyNzQ0MDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ3MTY4MDAwLCJleHAiOjE5NjI3NDQwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 通义千问 API 密钥
# 获取方式：访问 https://dashscope.console.aliyun.com/ 创建 API Key
# 格式：sk-xxxxxxxxxxxxxxxxxxxxxxxx
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 高德地图 API
# 获取方式：访问 https://lbs.amap.com/ 创建应用
# 如果不配置，地图功能将不可用，但不影响其他功能
NEXT_PUBLIC_AMAP_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AMAP_SECURITY_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 科大讯飞语音识别
# 获取方式：访问 https://www.xfyun.cn/ 创建应用
# 如果不配置，将使用浏览器原生语音识别
NEXT_PUBLIC_IFLYTEK_APP_ID=xxxxxxxx
NEXT_PUBLIC_IFLYTEK_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_IFLYTEK_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
```
最终API配置如下：
# 通义千问 API 密钥
DASHSCOPE_API_KEY=
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# 高德地图 API 密钥
NEXT_PUBLIC_AMAP_KEY=
NEXT_PUBLIC_AMAP_SECURITY_KEY=
# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
# 科大讯飞语音识别 API 密钥
NEXT_PUBLIC_IFLYTEK_APP_ID=
NEXT_PUBLIC_IFLYTEK_API_KEY=
NEXT_PUBLIC_IFLYTEK_API_SECRET=
```
- **Supabase**: 数据库和用户认证
  - 获取方式：访问 [Supabase](https://supabase.com/) 创建项目
  - 详细指南：[Supabase 配置指南](SUPABASE_SETUP.md)

- **通义千问 API**: AI 功能
  - 获取方式：访问 [阿里云 DashScope](https://dashscope.console.aliyun.com/) 创建 API Key
  - 详细指南：[通义千问配置指南](QWEN_SETUP.md)

### 可选配置

- **高德地图 API**: 地图功能（[配置指南](docs/AMAP_SETUP.md)）
- **科大讯飞 API**: 语音识别（[配置指南](IFLYTEK_SETUP.md)）

📖 完整配置说明：见 [环境配置指南](docs/ENV_CONFIG_GUIDE.md)

## 🔄 工作流程

### 1. 用户注册/登录
- 新用户注册账户，已有账户直接登录
- 登录后数据自动同步到云端

### 2. 创建旅行计划
- 填写旅行信息（目的地、日期、预算、兴趣等）
- 可选择使用语音输入快速录入
- AI生成个性化旅行计划（10-30秒）

### 3. 查看和管理计划
- 查看生成的旅行计划详情
- 保存计划到账户
- 在地图上查看目的地位置
- 搜索附近景点、餐厅、酒店

### 4. 费用管理
- 记录旅行中的各项开销
- 实时查看预算使用情况
- AI分析预算，提供优化建议
- 语音快速记录费用

### 5. 计划管理
- 查看所有已保存的旅行计划
- 编辑或删除计划
- 多设备同步访问

## ✨ 功能特点

### 核心功能

#### 🤖 AI智能规划
- **快速生成**：输入目的地、日期、预算等信息，AI在10-30秒内生成完整旅行计划
- **详细内容**：包含每日行程安排、餐饮推荐、住宿建议、预算分解、实用信息
- **个性化定制**：根据用户兴趣、特殊需求生成专属计划
- **智能优化**：AI分析行程合理性，提供优化建议

#### 👤 用户管理系统
- **安全认证**：基于Supabase Auth的用户注册、登录系统
- **账户管理**：个人信息管理、偏好设置
- **数据隔离**：每个用户的数据独立存储，保障隐私安全

#### ☁️ 云端同步
- **实时同步**：旅行计划、费用记录自动同步到云端
- **多设备访问**：支持电脑、手机、平板等多设备访问
- **数据备份**：所有数据安全存储在云端，防止丢失

#### 📚 计划管理
- **保存计划**：一键保存生成的旅行计划
- **计划列表**：查看所有已保存的旅行计划
- **计划详情**：查看完整的计划内容
- **计划删除**：管理不需要的计划

#### 💰 费用预算管理
- **实时跟踪**：记录餐饮、交通、住宿、活动、购物等各类开销
- **预算监控**：实时显示总预算、已花费、剩余金额
- **可视化展示**：进度条显示预算使用情况（绿色/黄色/红色）
- **AI分析**：AI分析预算使用情况，提供优化建议和风险预警
- **语音记录**：支持语音输入金额和备注，智能识别中文数字

#### 🗺️ 地图导航
- **地点搜索**：搜索景点、餐厅、酒店等地点
- **地图展示**：在地图上显示目的地位置
- **路线规划**：规划最优路线，显示距离和预计时间
- **一键导航**：跳转到高德地图进行导航

### 体验功能

#### 🌍 多语言支持
- **自动检测**：自动检测用户输入的语言
- **多语言界面**：支持中文、英文、日文、韩文4种语言
- **AI多语言**：AI根据检测到的语言生成对应语言的旅行计划

#### 🎤 语音输入
- **语音识别**：支持科大讯飞语音识别，准确识别中文语音
- **智能转换**：自动将语音转换为文本，识别中文数字
- **快速录入**：快速录入旅行信息和费用记录

#### 🎨 现代化UI
- **响应式设计**：完美适配桌面端和移动端
- **美观界面**：基于Tailwind CSS的现代化设计
- **流畅动画**：流畅的交互动画效果
- **暗色模式**：支持暗色主题（可选）

#### ⚡ 高性能
- **快速响应**：基于Next.js 14的Server Components和App Router
- **优化加载**：代码分割、懒加载优化
- **缓存机制**：智能缓存，提升性能

## 🛠️ 技术栈

### 前端技术
- **框架**: Next.js 14 (App Router) - 服务端渲染和静态生成
- **UI库**: React 18 - 组件化开发
- **样式**: Tailwind CSS + Shadcn/ui - 现代化UI组件库
- **语言**: TypeScript - 类型安全
- **图标**: Lucide React - 丰富的图标库
- **状态管理**: React Hooks - 本地状态管理
- **表单处理**: React Hook Form - 表单验证和处理

### 后端技术
- **API路由**: Next.js API Routes - 服务端API
- **数据库**: Supabase (PostgreSQL) - 关系型数据库
- **认证**: Supabase Auth - 用户认证和授权
- **数据存储**: Supabase Storage - 文件存储
- **实时同步**: Supabase Realtime - 实时数据同步

### 第三方服务
- **AI服务**: 阿里云通义千问 (Qwen) - 大语言模型
  - 模型：qwen-plus（推荐）、qwen-turbo、qwen-max
  - 用途：生成旅行计划、预算分析
- **语音识别**: 科大讯飞 WebAPI - 中文语音识别
  - 用途：语音输入、语音转文字
- **地图服务**: 高德地图 API - 地图和导航
  - 用途：地点搜索、路线规划、地图展示

### 开发工具
- **包管理**: npm / yarn
- **代码质量**: ESLint, Prettier
- **版本控制**: Git
- **容器化**: Docker, Docker Compose
- **部署**: 阿里云容器镜像服务

### 架构设计
- **前后端分离**: Next.js全栈框架，前后端统一
- **服务端渲染**: SSR和SSG提升首屏加载速度
- **API路由**: RESTful API设计
- **数据库设计**: PostgreSQL关系型数据库，支持复杂查询
- **安全机制**: Supabase Row Level Security (RLS) 数据安全
- **缓存策略**: 客户端和服务端缓存优化

## 📚 相关文档

- 🚀 [Docker 部署指南](DOCKER.md) - Docker 部署和阿里云镜像使用
- 🗄️ [Supabase 配置](SUPABASE_SETUP.md) - 数据库配置指南
- 🔑 [通义千问配置](QWEN_SETUP.md) - API 密钥配置
- 🗺️ [高德地图配置](docs/AMAP_SETUP.md) - 地图功能配置
- 🎙️ [科大讯飞配置](IFLYTEK_SETUP.md) - 语音识别配置
- 📖 [使用指南](USAGE.md) - 功能使用说明
- 🤝 [贡献指南](CONTRIBUTING.md) - 参与开发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详见 [贡献指南](CONTRIBUTING.md)

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

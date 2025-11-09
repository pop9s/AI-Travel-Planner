# 更新日志

所有重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.2.1] - 2025-11-09

### ✨ 新增功能

#### 🎙️ 科大讯飞语音识别集成
- 添加科大讯飞语音识别API支持
  - WebSocket 实时流式识别
  - 更高的中文识别准确度（98%）
  - 支持方言识别（粤语、四川话等）
  - 全浏览器兼容（包括 Firefox）
  
- 双引擎支持
  - 优先使用科大讯飞（如已配置）
  - 自动降级到浏览器原生API
  - 无缝切换，用户无感知
  
- UI增强
  - 科大讯飞模式显示渐变色按钮
  - 右上角星星图标标识
  - 录音提示显示"讯飞"标识

#### 📁 新增文件
- `lib/iflytekSpeech.ts` - 科大讯飞语音识别SDK
- `IFLYTEK_SETUP.md` - 科大讯飞配置指南
- `VOICE_COMPARISON.md` - 语音方案对比文档
- `VOICE_QUICK_SETUP.md` - 快速配置指南

#### 🔄 更新文件
- `components/VoiceInput.tsx` - 支持双引擎切换
- `package.json` - 添加 crypto-js 依赖
- `.env.local.example` - 添加科大讯飞配置示例
- `README.md` - 更新文档链接
- `CHANGELOG.md` - 版本记录

### 📦 依赖更新
- 新增 `crypto-js` - 用于API签名
- 新增 `@types/crypto-js` - TypeScript类型定义

### 🎨 UI 改进
- 科大讯飞模式渐变色按钮
- 星星图标标识高级功能
- 录音提示显示引擎类型

### 📚 文档
- 添加科大讯飞完整配置指南
- 两种方案详细对比
- 快速配置指南

## [1.2.0] - 2025-11-09

### ✨ 新增功能

#### 🎤 语音输入功能
- 添加语音输入支持
  - 使用 Web Speech API 实现
  - 支持多字段语音输入（目的地、兴趣、特殊要求）
  - 实时语音识别反馈
  - 自动匹配界面语言
  
- 多语言语音识别
  - 中文语音识别 (zh-CN)
  - 英文语音识别 (en-US)
  - 日文语音识别 (ja-JP)
  - 韩文语音识别 (ko-KR)
  
- 语音输入组件
  - 美观的麦克风按钮
  - 录音状态动画指示
  - 实时文本预览
  - 错误提示
  
- 智能集成
  - 与多语言功能联动
  - 自动语言匹配
  - 浏览器兼容性检测
  - 权限管理

#### 📁 新增文件
- `lib/speechRecognition.ts` - 语音识别核心逻辑
- `components/VoiceInput.tsx` - 语音输入UI组件
- `VOICE_INPUT_FEATURE.md` - 语音输入功能文档

#### 🔄 更新文件
- `app/page.tsx` - 集成语音输入组件
- `README.md` - 更新功能列表
- `CHANGELOG.md` - 添加版本记录

### 🎨 UI 改进
- 在输入框旁添加麦克风按钮
- 录音状态的视觉反馈
- 实时识别文本预览
- 错误提示优化

### 🌐 浏览器支持
- Chrome 25+ ✅
- Edge 79+ ✅
- Safari 14.1+ ✅
- Opera 27+ ✅

### 📚 文档
- 添加完整的语音输入功能文档
- 使用示例和场景说明
- 浏览器兼容性说明
- 隐私和安全说明

## [1.1.0] - 2025-11-09

### ✨ 新增功能

#### 🌍 多语言支持
- 添加智能语言检测功能
  - 自动识别中文、英文、日文、韩文
  - 基于字符集的高效检测算法
  - 实时检测用户输入语言
  
- 多语言界面
  - 完整的 UI 翻译支持（中/英/日/韩）
  - 语言选择器组件
  - 动态界面切换
  - 表单和按钮本地化
  
- AI 多语言响应
  - AI 根据检测到的语言生成对应语言的旅行计划
  - 语言特定的提示词优化
  - 无缝的多语言用户体验

#### 📁 新增文件
- `lib/languageDetection.ts` - 语言检测核心逻辑
- `lib/i18n.ts` - 国际化翻译配置
- `components/LanguageSelector.tsx` - 语言选择器组件
- `MULTILANG_FEATURE.md` - 多语言功能文档

#### 🔄 更新文件
- `app/page.tsx` - 集成多语言支持
- `app/api/plan/route.ts` - 添加语言参数处理
- `README.md` - 更新功能说明

### 🎨 改进
- 页面 Header 添加语言选择器
- 优化用户体验，自动检测输入语言
- 所有界面文本支持动态翻译

### 📚 文档
- 添加完整的多语言功能文档
- 更新 README 说明
- 添加使用示例和开发指南

## [1.0.0] - 2025-11-09

### ✨ 初始版本

#### 核心功能
- AI 智能旅行规划
  - 集成阿里云通义千问 API
  - 使用 qwen-turbo 模型（3-8秒响应）
  - 详细的旅行计划生成
  - 每日行程、餐饮、住宿建议
  - 预算分解和实用建议

- 用户界面
  - Next.js 14 + TypeScript + Tailwind CSS
  - 现代化响应式设计
  - 美观的渐变配色
  - 流畅的动画效果

- 实用功能
  - 旅行计划下载
  - 社交分享
  - 表单验证
  - 错误处理
  - 加载状态

#### 技术栈
- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI服务**: 阿里云通义千问
- **图标**: Lucide React
- **开发工具**: ESLint, Prettier

#### UI 组件
- Button - 按钮组件
- Card - 卡片组件
- Input - 输入框组件
- Textarea - 文本域组件
- Label - 标签组件
- LoadingSpinner - 加载动画
- ErrorMessage - 错误提示
- TravelPlan - 旅行计划展示

#### 页面
- 主页 (`app/page.tsx`)
- 404 页面 (`app/not-found.tsx`)
- 错误页面 (`app/error.tsx`)
- 加载页面 (`app/loading.tsx`)

#### API 路由
- POST `/api/plan` - 生成旅行计划

#### 文档
- README.md - 项目说明
- QUICKSTART.md - 快速开始指南
- QWEN_SETUP.md - 通义千问配置
- USAGE.md - 使用指南
- DEPLOYMENT.md - 部署指南
- CONTRIBUTING.md - 贡献指南
- PROJECT_STRUCTURE.md - 项目结构
- PROJECT_OVERVIEW.md - 项目概览
- SETUP_COMPLETE.md - 设置完成指南

#### 配置文件
- `package.json` - 项目依赖
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.js` - Tailwind 配置
- `next.config.js` - Next.js 配置
- `.eslintrc.json` - ESLint 配置
- `.prettierrc` - Prettier 配置
- `.gitignore` - Git 忽略文件

#### 脚本
- `scripts/setup.sh` - Linux/Mac 安装脚本
- `scripts/setup.bat` - Windows 安装脚本

### 🚀 性能
- 3-8秒快速 AI 响应
- 优化的 qwen-turbo 模型
- 高效的代码分割
- 响应式加载

### 💰 成本优化
- 使用通义千问代替 OpenAI
- 成本降低 99%
- 单次调用约 ¥0.001

### 🔒 安全
- 环境变量保护 API 密钥
- 输入验证
- 错误信息脱敏
- HTTPS 支持

---

## 图例

- ✨ 新增功能
- 🔄 功能更新
- 🐛 Bug修复
- 🎨 样式改进
- 📚 文档更新
- 🚀 性能优化
- 🔒 安全修复
- 🗑️ 移除功能
- ⚠️ 废弃警告



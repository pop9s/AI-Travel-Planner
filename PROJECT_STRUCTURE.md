# 项目结构说明

本文档详细说明了AI Travel Planner项目的目录结构和各文件的作用。

## 根目录结构

```
AI-Travel-Planner/
├── app/                      # Next.js 14 App Router目录
├── components/               # React组件
├── lib/                      # 工具函数和共享代码
├── public/                   # 静态资源
├── scripts/                  # 脚本文件
├── types/                    # TypeScript类型定义
├── .eslintrc.json           # ESLint配置
├── .gitignore               # Git忽略文件
├── .prettierrc              # Prettier配置
├── .prettierignore          # Prettier忽略文件
├── .env.local.example       # 环境变量示例
├── CONTRIBUTING.md          # 贡献指南
├── DEPLOYMENT.md            # 部署指南
├── LICENSE                  # 许可证
├── next.config.js           # Next.js配置
├── next-env.d.ts            # Next.js类型定义
├── package.json             # 项目依赖和脚本
├── postcss.config.js        # PostCSS配置
├── README.md                # 项目说明
├── tailwind.config.js       # Tailwind CSS配置
├── tsconfig.json            # TypeScript配置
└── USAGE.md                 # 使用指南
```

## 目录详解

### `/app` - 应用核心

Next.js 14的App Router目录，包含所有页面和API路由。

```
app/
├── api/                     # API路由
│   └── plan/
│       └── route.ts        # POST /api/plan - AI旅行规划API
├── globals.css             # 全局样式和Tailwind基础样式
├── layout.tsx              # 根布局组件
├── page.tsx                # 主页面 (/)
├── error.tsx               # 全局错误处理页面
├── loading.tsx             # 全局加载状态页面
└── not-found.tsx           # 404页面
```

#### 关键文件说明

**`app/page.tsx`**
- 应用主页面
- 包含旅行规划表单
- 处理用户输入和API调用
- 展示生成的旅行计划

**`app/api/plan/route.ts`**
- AI旅行规划的后端API
- 接收用户需求
- 调用OpenAI API
- 返回生成的旅行计划

**`app/layout.tsx`**
- 根布局组件
- 设置HTML和body标签
- 引入全局样式
- 配置字体

**`app/globals.css`**
- Tailwind CSS基础样式
- CSS变量定义（颜色、间距等）
- 自定义样式和动画

### `/components` - React组件

可复用的UI组件库。

```
components/
├── ui/                      # 基础UI组件
│   ├── button.tsx          # 按钮组件
│   ├── card.tsx            # 卡片组件
│   ├── input.tsx           # 输入框组件
│   ├── textarea.tsx        # 文本域组件
│   └── label.tsx           # 标签组件
├── TravelPlan.tsx          # 旅行计划展示组件
├── LoadingSpinner.tsx      # 加载动画组件
└── ErrorMessage.tsx        # 错误信息展示组件
```

#### 组件说明

**`components/ui/*`**
- 基础UI组件库
- 使用Tailwind CSS样式
- 支持变体和尺寸配置
- 完全类型化

**`components/TravelPlan.tsx`**
- 展示AI生成的旅行计划
- 格式化文本内容
- 提供下载和分享功能
- 美化显示效果

**`components/LoadingSpinner.tsx`**
- 可复用的加载动画
- 支持不同尺寸
- 自定义文本

**`components/ErrorMessage.tsx`**
- 统一的错误信息展示
- 包含图标和格式化
- 支持自定义标题和消息

### `/lib` - 工具函数

共享的工具函数和辅助代码。

```
lib/
└── utils.ts                # 工具函数（cn函数用于合并类名）
```

### `/types` - 类型定义

TypeScript类型定义文件。

```
types/
└── index.ts                # 通用类型定义
```

包含的类型：
- `TravelFormData`: 旅行表单数据类型
- `TravelPlan`: 旅行计划类型
- `ApiError`: API错误类型

### `/public` - 静态资源

静态文件目录，用于存放图片、字体等资源。

```
public/
└── (favicon, images, etc.)
```

### `/scripts` - 脚本文件

项目辅助脚本。

```
scripts/
├── setup.sh                # Linux/Mac快速安装脚本
└── setup.bat               # Windows快速安装脚本
```

## 配置文件说明

### `package.json`

项目依赖和npm脚本配置。

**主要依赖：**
- `next`: Next.js框架
- `react`: React库
- `openai`: OpenAI官方SDK
- `tailwindcss`: CSS框架
- `lucide-react`: 图标库

**可用脚本：**
```bash
npm run dev           # 启动开发服务器
npm run build         # 构建生产版本
npm run start         # 启动生产服务器
npm run lint          # 运行ESLint检查
npm run format        # 格式化代码
npm run format:check  # 检查代码格式
npm run type-check    # TypeScript类型检查
```

### `tsconfig.json`

TypeScript编译器配置。

**关键配置：**
- `strict: true`: 启用严格模式
- `paths`: 路径别名配置 (`@/*`)
- `jsx: "preserve"`: JSX编译模式
- `moduleResolution: "bundler"`: 模块解析策略

### `tailwind.config.js`

Tailwind CSS配置。

**自定义内容：**
- 颜色系统（主题色、背景色等）
- 边框半径
- 动画
- 响应式断点

### `next.config.js`

Next.js框架配置。

**当前配置：**
- `reactStrictMode: true`: React严格模式
- `swcMinify: true`: 使用SWC压缩

### `.eslintrc.json`

ESLint代码检查配置。

使用Next.js推荐的ESLint规则集。

### `.prettierrc`

Prettier代码格式化配置。

**风格选择：**
- 单引号
- 无分号
- 2空格缩进
- 100字符行宽

## 数据流

### 用户提交旅行计划

```
用户输入表单
    ↓
app/page.tsx (handleSubmit)
    ↓
POST /api/plan
    ↓
app/api/plan/route.ts
    ↓
OpenAI API
    ↓
返回生成的计划
    ↓
components/TravelPlan.tsx 展示
```

### API调用流程

```typescript
// 1. 客户端发送请求
const response = await fetch('/api/plan', {
  method: 'POST',
  body: JSON.stringify(formData)
})

// 2. API路由处理
export async function POST(request: NextRequest) {
  // 验证输入
  // 调用OpenAI
  // 返回结果
}

// 3. 客户端接收响应
const data = await response.json()
setTravelPlan(data.plan)
```

## 样式系统

### Tailwind CSS

使用Tailwind的工具类进行样式编写：

```tsx
<div className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md">
  {/* 内容 */}
</div>
```

### CSS变量

在 `app/globals.css` 中定义的CSS变量：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}
```

可在Tailwind配置中使用：

```tsx
<div className="bg-background text-foreground">
  {/* 内容 */}
</div>
```

## 环境变量

### 必需变量

**`.env.local`** (需要手动创建)

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### 可选变量

```env
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=3000
```

## 开发工作流

### 1. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中打开
open http://localhost:3000
```

### 2. 代码检查

```bash
# ESLint检查
npm run lint

# TypeScript类型检查
npm run type-check

# 代码格式化
npm run format
```

### 3. 构建和部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 扩展指南

### 添加新页面

在 `app/` 目录创建新文件：

```
app/
└── about/
    └── page.tsx         # 访问 /about
```

### 添加新API路由

在 `app/api/` 目录创建新路由：

```
app/
└── api/
    └── weather/
        └── route.ts     # POST /api/weather
```

### 添加新组件

在 `components/` 目录创建：

```typescript
// components/NewComponent.tsx
export default function NewComponent() {
  return <div>New Component</div>
}
```

### 添加新类型

在 `types/index.ts` 中添加：

```typescript
export interface NewType {
  field: string
}
```

## 最佳实践

1. **组件命名**: 使用PascalCase
2. **文件命名**: 组件文件使用PascalCase，其他文件使用kebab-case
3. **导入顺序**: React → Next.js → 第三方库 → 本地组件
4. **类型定义**: 所有组件和函数都应有明确的类型
5. **错误处理**: 使用try-catch并提供友好的错误信息
6. **样式**: 优先使用Tailwind工具类，必要时使用CSS变量

## 性能优化建议

1. **图片优化**: 使用Next.js Image组件
2. **代码分割**: 使用动态导入
3. **缓存策略**: 配置适当的缓存头
4. **懒加载**: 非关键组件使用懒加载
5. **服务端渲染**: 利用Next.js的SSR能力

## 安全考虑

1. **环境变量**: 敏感信息不要提交到Git
2. **输入验证**: 服务端验证所有用户输入
3. **API密钥**: 使用环境变量存储
4. **XSS防护**: React自动转义内容
5. **CSRF**: 使用Next.js内置防护

---

更新日期: 2025-11-09


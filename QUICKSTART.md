# 快速开始指南 🚀

5分钟内启动你的AI Travel Planner！

## 前置要求

- ✅ Node.js 18.0+ ([下载](https://nodejs.org/))
- ✅ npm 或 yarn 或 pnpm
- ✅ OpenAI API密钥 ([获取](https://platform.openai.com/api-keys))

## 快速安装

### 方式1: 使用安装脚本（推荐）

**Windows:**
```bash
.\scripts\setup.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 方式2: 手动安装

```bash
# 1. 安装依赖
npm install

# 2. 创建环境变量文件
cp .env.local.example .env.local

# 3. 编辑 .env.local 添加你的API密钥
# OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

## 获取通义千问 API 密钥

1. 访问 [阿里云灵积控制台](https://dashscope.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 开通 DashScope 服务（免费）
4. 进入 [API Keys](https://dashscope.console.aliyun.com/apiKey) 页面
5. 创建新的 API Key
6. 复制密钥到 `.env.local` 文件

```env
DASHSCOPE_API_KEY=sk-your-actual-api-key-here
```

⚠️ **重要**: 不要将API密钥提交到Git仓库！

📖 详细配置说明请查看 [通义千问配置指南](QWEN_SETUP.md)

## 启动应用

```bash
# 开发模式
npm run dev

# 或使用其他包管理器
yarn dev
pnpm dev
```

打开浏览器访问: **http://localhost:3000**

## 第一次使用

1. **填写旅行信息**
   - 目的地: `日本东京`
   - 出发日期: 选择未来日期
   - 旅行天数: `7`
   - 旅行人数: `2`
   - 预算: `15000`
   - 兴趣爱好: `美食、历史文化、购物`

2. **生成计划**
   - 点击"生成AI旅行计划"按钮
   - 等待10-30秒
   - 查看生成的详细计划

3. **使用计划**
   - 下载为文本文件
   - 分享给朋友
   - 根据需要调整

## 常见问题

### ❌ 错误: "OpenAI API密钥无效"

**解决方案:**
1. 检查 `.env.local` 文件是否存在
2. 确认API密钥正确无误
3. 重启开发服务器

### ❌ 错误: "npm: command not found"

**解决方案:**
安装Node.js: https://nodejs.org/

### ❌ 错误: "端口3000已被占用"

**解决方案:**
```bash
# 使用其他端口
npm run dev -- -p 3001
```

### ❌ 生成速度慢

**解决方案:**
1. 修改 `app/api/plan/route.ts`
2. 将模型改为 `gpt-3.5-turbo` (更快但质量略低)

```typescript
model: 'gpt-3.5-turbo' // 代替 gpt-4-turbo-preview
```

## 下一步

- 📖 阅读 [使用指南](USAGE.md) 了解详细功能
- 🚀 查看 [部署指南](DEPLOYMENT.md) 部署到生产环境
- 🏗️ 阅读 [项目结构](PROJECT_STRUCTURE.md) 了解代码架构
- 🤝 查看 [贡献指南](CONTRIBUTING.md) 参与开发

## 验证安装

### 检查Node.js版本

```bash
node --version
# 应该显示 v18.x.x 或更高
```

### 检查依赖安装

```bash
npm list --depth=0
# 应该显示所有依赖包
```

### 运行类型检查

```bash
npm run type-check
# 不应该有错误
```

### 运行代码检查

```bash
npm run lint
# 不应该有错误
```

## 开发工具推荐

### VS Code扩展

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Tailwind CSS IntelliSense** - Tailwind类名提示
- **TypeScript Vue Plugin (Volar)** - TypeScript支持

### 浏览器扩展

- **React Developer Tools** - React调试
- **Wappalyzer** - 技术栈识别

## 性能提示

### 降低成本

使用GPT-3.5代替GPT-4:

```typescript
// app/api/plan/route.ts
model: 'gpt-3.5-turbo' // 成本降低90%
```

### 提升速度

减少生成长度:

```typescript
// app/api/plan/route.ts
max_tokens: 2000 // 代替 3000
```

## 命令速查表

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 代码质量
npm run lint             # ESLint检查
npm run format           # 格式化代码
npm run type-check       # TypeScript检查

# 包管理
npm install              # 安装依赖
npm update              # 更新依赖
npm audit               # 安全审计
```

## 获取帮助

遇到问题？

1. 📖 查看 [README.md](README.md)
2. 📖 阅读 [USAGE.md](USAGE.md)
3. 🐛 提交 [Issue](https://github.com/yourusername/AI-Travel-Planner/issues)
4. 💬 参与 [Discussions](https://github.com/yourusername/AI-Travel-Planner/discussions)

## 示例请求

### 周末短途游

```
目的地: 苏州
出发日期: 2024-12-15
天数: 3天
人数: 2人
预算: ¥3000
兴趣: 园林、古镇、美食
```

### 海外度假

```
目的地: 泰国普吉岛
出发日期: 2024-12-20
天数: 7天
人数: 4人
预算: ¥25000
兴趣: 海滩、潜水、泰式按摩
特殊要求: 家庭友好型酒店
```

### 文化探索

```
目的地: 西安
出发日期: 2024-12-01
天数: 5天
人数: 1人
预算: ¥5000
兴趣: 历史文化、博物馆、陕西美食
```

## 项目状态

- ✅ 核心功能完成
- ✅ UI/UX优化
- ✅ 错误处理
- ✅ 响应式设计
- ✅ 文档完善

## 后续计划

- [ ] 用户认证系统
- [ ] 计划历史记录
- [ ] 地图集成
- [ ] PDF导出
- [ ] 多语言支持

---

**准备好了吗？开始你的AI旅行规划之旅！** ✈️

```bash
npm run dev
```

访问: http://localhost:3000


# 贡献指南

感谢你对 AI Travel Planner 的兴趣！我们欢迎所有形式的贡献。

## 如何贡献

### 报告Bug

如果你发现了bug，请创建一个Issue并包含以下信息：

1. **清晰的标题**: 简短描述问题
2. **重现步骤**: 详细说明如何重现bug
3. **期望行为**: 说明应该发生什么
4. **实际行为**: 说明实际发生了什么
5. **环境信息**: 
   - 浏览器和版本
   - 操作系统
   - Node.js版本

### 建议新功能

我们欢迎新功能建议！请创建一个Issue并说明：

1. **功能描述**: 详细描述新功能
2. **使用场景**: 说明为什么需要这个功能
3. **可能的实现**: 如果有想法，描述实现方式

### 提交代码

#### 1. Fork项目

点击GitHub页面右上角的Fork按钮

#### 2. 克隆仓库

```bash
git clone https://github.com/your-username/AI-Travel-Planner.git
cd AI-Travel-Planner
```

#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

命名规范：
- `feature/` - 新功能
- `fix/` - Bug修复
- `docs/` - 文档更新
- `style/` - 代码格式化
- `refactor/` - 代码重构
- `test/` - 测试相关

#### 4. 安装依赖

```bash
npm install
```

#### 5. 进行更改

- 遵循现有代码风格
- 编写清晰的注释
- 确保代码通过linter检查

```bash
npm run lint
```

#### 6. 提交更改

使用清晰的提交信息：

```bash
git add .
git commit -m "feat: add user authentication"
```

提交信息格式：
- `feat:` - 新功能
- `fix:` - Bug修复
- `docs:` - 文档更新
- `style:` - 代码格式
- `refactor:` - 代码重构
- `test:` - 测试
- `chore:` - 构建或辅助工具

#### 7. 推送到GitHub

```bash
git push origin feature/your-feature-name
```

#### 8. 创建Pull Request

1. 访问你的Fork仓库
2. 点击 "Compare & pull request"
3. 填写PR描述：
   - 更改内容
   - 相关Issue
   - 测试说明
   - 截图（如果有UI更改）

## 代码规范

### TypeScript

```typescript
// ✅ 好的例子
interface UserProfile {
  name: string
  email: string
  age?: number
}

const getUserData = async (userId: string): Promise<UserProfile> => {
  // 实现
}

// ❌ 避免
const getUserData = async (userId: any) => {
  // 实现
}
```

### React组件

```typescript
// ✅ 使用函数组件和TypeScript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  )
}
```

### 样式

- 使用Tailwind CSS工具类
- 遵循响应式设计原则
- 保持一致的间距和颜色

```tsx
// ✅ 好的例子
<div className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-md">
  {/* 内容 */}
</div>
```

### 文件结构

```
feature/
├── components/
│   ├── FeatureComponent.tsx
│   └── FeatureSubComponent.tsx
├── hooks/
│   └── useFeature.ts
├── types/
│   └── feature.types.ts
└── utils/
    └── feature.utils.ts
```

## 测试

在提交PR之前，确保：

1. 代码通过linter检查
```bash
npm run lint
```

2. 应用可以成功构建
```bash
npm run build
```

3. 在本地测试所有更改
```bash
npm run dev
```

## Pull Request检查清单

在提交PR前，确保：

- [ ] 代码遵循项目风格指南
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 通过所有linter检查
- [ ] 在本地测试通过
- [ ] PR描述清晰完整
- [ ] 关联相关Issue

## 社区准则

### 行为准则

- 尊重所有贡献者
- 接受建设性批评
- 专注于对项目最有利的事情
- 对社区成员表现出同理心

### 沟通

- 使用清晰、专业的语言
- 保持讨论相关且建设性
- 及时回复评论和反馈

## 需要帮助?

- 📧 Email: your.email@example.com
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/AI-Travel-Planner/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/AI-Travel-Planner/issues)

## 许可证

提交贡献即表示你同意你的代码将在项目的MIT许可证下发布。

---

再次感谢你的贡献！🎉


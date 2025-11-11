# 🐳 Docker 镜像使用说明

## 📦 镜像文件

- **文件名**: `ai-travel-planner-latest-*.tar`
- **大小**: 约 145 MB
- **版本**: latest

## 🚀 快速开始

### ⚡ 方法一：使用快速启动脚本（推荐）

**Windows (PowerShell):**
```powershell
# 1. 进入 docker-images 目录
cd docker-images

# 2. 运行快速启动脚本
.\quick-start.ps1
```

**Linux/Mac:**
```bash
# 1. 进入 docker-images 目录
cd docker-images

# 2. 添加执行权限并运行
chmod +x quick-start.sh
./quick-start.sh
```

脚本会自动：
- ✅ 检查 Docker 是否运行
- ✅ 加载镜像（如果未加载）
- ✅ 创建 .env 配置文件
- ✅ 启动容器

### 📝 方法二：手动配置

#### 1. 加载镜像

在目标机器上执行以下命令加载镜像：

**Windows (PowerShell):**
```powershell
docker load -i ai-travel-planner-latest-*.tar
```

**Linux/Mac:**
```bash
docker load -i ai-travel-planner-latest-*.tar
```

#### 2. 验证镜像

加载完成后，验证镜像是否存在：

```bash
docker images | grep ai-travel-planner
```

您应该看到类似以下输出：
```
ai-travel-planner   latest   <image-id>   <time>   145MB
```

#### 3. 配置环境变量

**重要说明：** 需要配置 API keys 才能使用应用。这是必需的，因为：
- 🔒 **安全考虑**：API keys 是敏感信息，不能硬编码在镜像中
- 👤 **个性化**：每个用户可能有不同的 Supabase 项目
- 🔧 **灵活性**：用户可以选择不同的服务提供商

**快速配置：**

1. 复制环境变量模板：
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填写您的 API keys：

```env
# Supabase 配置（必需）
# 获取方式：https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 通义千问 API（必需）
# 获取方式：https://bailian.console.aliyun.com/
DASHSCOPE_API_KEY=sk-your-api-key

# 高德地图 API（可选，用于地图功能）
# 获取方式：https://console.amap.com/
NEXT_PUBLIC_AMAP_KEY=your-amap-key
```

**必需配置说明：**
- **Supabase**：用于用户认证和数据存储
- **通义千问 API**：用于生成 AI 旅行计划

**可选配置：**
- **高德地图 API**：如果不配置，地图功能将不可用，但其他功能正常

#### 4. 运行容器

**使用 Docker 命令:**
```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  ai-travel-planner:latest
```

**或使用 Docker Compose:**

创建 `docker-compose.yml`:
```yaml
version: '3.8'

services:
  ai-travel-planner:
    image: ai-travel-planner:latest
    container_name: ai-travel-planner
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: always
```

然后运行:
```bash
docker-compose up -d
```

### 5. 访问应用

等待几秒钟让容器完全启动，然后打开浏览器访问: http://localhost:3000

## 🔑 API Keys 获取指南

### Supabase（必需）

1. 访问 [Supabase](https://supabase.com) 并注册/登录
2. 创建新项目或使用现有项目
3. 进入项目设置 → API
4. 复制以下信息到 `.env` 文件：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 通义千问 API（必需）

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 进入"模型广场" → "通义千问"
4. 点击"获取API-KEY"
5. 复制 API Key 到 `.env` 文件的 `DASHSCOPE_API_KEY`

### 高德地图 API（可选）

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录账号
3. 创建应用，选择"Web 端（JS API）"
4. 获取 Key 并复制到 `.env` 文件的 `NEXT_PUBLIC_AMAP_KEY`

> 💡 **提示**：如果不配置高德地图 API，地图功能将不可用，但其他功能（AI 计划生成、预算管理等）仍然可以正常使用。

## 📝 常用命令

### 查看容器状态
```bash
docker ps | grep ai-travel-planner
```

### 查看容器日志
```bash
docker logs ai-travel-planner
```

### 实时查看日志
```bash
docker logs -f ai-travel-planner
```

### 停止容器
```bash
docker stop ai-travel-planner
```

### 启动容器
```bash
docker start ai-travel-planner
```

### 重启容器
```bash
docker restart ai-travel-planner
```

### 删除容器
```bash
docker rm ai-travel-planner
```

### 删除镜像
```bash
docker rmi ai-travel-planner:latest
```

## 🔧 故障排除

### 端口已被占用

如果 3000 端口已被占用，可以使用其他端口：

```bash
docker run -d \
  --name ai-travel-planner \
  -p 8080:3000 \
  --env-file .env \
  ai-travel-planner:latest
```

然后访问: http://localhost:8080

### 环境变量未生效

确保 `.env` 文件在运行 `docker run` 命令的目录中，或者使用绝对路径：

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file /path/to/.env \
  ai-travel-planner:latest
```

### 容器无法启动

查看容器日志以获取错误信息：

```bash
docker logs ai-travel-planner
```

### 镜像加载失败

确保 tar 文件完整且未损坏。可以重新下载或重新导出镜像。

## 📚 更多信息

- 详细部署指南: [DOCKER.md](../DOCKER.md)
- 环境变量配置: [docs/ENV_CONFIG_GUIDE.md](../docs/ENV_CONFIG_GUIDE.md)
- 项目 README: [README.md](../README.md)

## 🆘 需要帮助？

如果遇到问题，请：
1. 查看容器日志: `docker logs ai-travel-planner`
2. 检查环境变量配置
3. 查看 [DOCKER.md](../DOCKER.md) 的故障排除部分


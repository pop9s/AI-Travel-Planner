# 🐳 Docker 部署指南

本指南将帮助您使用 Docker 快速部署和运行 AI Travel Planner 应用。

## 📋 前置要求

- Docker 20.10+ 
- Docker Compose 2.0+（可选，用于 docker-compose 部署）

## 🚀 快速开始

### 方法 1: 使用 Docker Compose（推荐）

1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/AI-Travel-Planner.git
   cd AI-Travel-Planner
   ```

2. **创建环境变量文件**
   
   创建 `.env` 文件（或复制 `.env.example`）：
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件，填入必要的环境变量：
   ```env
   # Supabase 配置（必需）
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # 通义千问 API（必需）
   DASHSCOPE_API_KEY=sk-your-api-key
   
   # 科大讯飞 API（可选）
   IFLYTEK_APP_ID=your-app-id
   IFLYTEK_API_SECRET=your-api-secret
   IFLYTEK_API_KEY=your-api-key
   
   # 高德地图 API（可选）
   NEXT_PUBLIC_AMAP_KEY=your-amap-key
   NEXT_PUBLIC_AMAP_SECURITY_KEY=your-security-key
   ```

3. **构建并启动容器**
   ```bash
   docker-compose up -d
   ```

4. **查看日志**
   ```bash
   docker-compose logs -f
   ```

5. **访问应用**
   
   打开浏览器访问：http://localhost:3000

### 方法 2: 使用 Docker 命令

1. **构建镜像**
   ```bash
   docker build -t ai-travel-planner:latest .
   ```

2. **运行容器**
   ```bash
   docker run -d \
     --name ai-travel-planner \
     -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
     -e SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
     -e DASHSCOPE_API_KEY=sk-your-api-key \
     ai-travel-planner:latest
   ```

   或者使用环境变量文件：
   ```bash
   docker run -d \
     --name ai-travel-planner \
     -p 3000:3000 \
     --env-file .env \
     ai-travel-planner:latest
   ```

3. **查看日志**
   ```bash
   docker logs -f ai-travel-planner
   ```

## 📦 分发 Docker 镜像

### 方法 1: 导出为 tar 文件（适合离线分发）

1. **构建镜像**
   ```bash
   docker build -t ai-travel-planner:latest .
   ```

2. **导出镜像**
   
   **Linux/Mac:**
   ```bash
   # 使用提供的脚本
   chmod +x scripts/export-docker-image.sh
   ./scripts/export-docker-image.sh
   
   # 或手动导出
   docker save -o ai-travel-planner-latest.tar ai-travel-planner:latest
   gzip ai-travel-planner-latest.tar
   ```
   
   **Windows (PowerShell):**
   ```powershell
   # 使用提供的脚本
   .\scripts\export-docker-image.ps1
   
   # 或手动导出
   docker save -o ai-travel-planner-latest.tar ai-travel-planner:latest
   Compress-Archive -Path ai-travel-planner-latest.tar -DestinationPath ai-travel-planner-latest.tar.gz
   ```

3. **在目标机器上加载镜像**
   ```bash
   # Linux/Mac
   gunzip -c ai-travel-planner-latest.tar.gz | docker load
   
   # Windows (PowerShell)
   docker load -i ai-travel-planner-latest.tar.gz
   ```

4. **运行容器**
   ```bash
   docker run -d \
     --name ai-travel-planner \
     -p 3000:3000 \
     --env-file .env \
     ai-travel-planner:latest
   ```

### 方法 2: 推送到阿里云容器镜像服务（推荐，适合国内用户）

**使用脚本（推荐）:**

**Windows (PowerShell):**
```powershell
.\scripts\push-to-aliyun-personal.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/push-to-aliyun-personal.sh
./scripts/push-to-aliyun-personal.sh
```

**手动推送:**

1. **登录阿里云容器镜像服务**
   ```bash
   docker login --username=HankeNJU crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com
   ```

2. **给镜像打标签**
   ```bash
   docker tag ai-travel-planner:latest crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
   ```

3. **推送镜像**
   ```bash
   docker push crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
   ```

📖 **详细说明** 请查看 [阿里云推送指南](docs/ALIYUN_REGISTRY.md)

### 方法 3: 推送到 Docker Hub（适合国际用户）

1. **登录 Docker Hub**
   ```bash
   docker login
   ```

2. **构建并标记镜像**
   ```bash
   docker build -t ai-travel-planner:latest .
   docker tag ai-travel-planner:latest your-username/ai-travel-planner:latest
   ```

3. **推送镜像**
   
   **使用脚本:**
   ```bash
   # Linux/Mac
   chmod +x scripts/push-to-dockerhub.sh
   DOCKERHUB_USERNAME=your-username ./scripts/push-to-dockerhub.sh
   
   # Windows (PowerShell)
   .\scripts\push-to-dockerhub.ps1 -DockerHubUsername your-username
   ```
   
   **手动推送:**
   ```bash
   docker push your-username/ai-travel-planner:latest
   ```

4. **在目标机器上拉取并运行**
   ```bash
   docker pull your-username/ai-travel-planner:latest
   docker run -d \
     --name ai-travel-planner \
     -p 3000:3000 \
     --env-file .env \
     your-username/ai-travel-planner:latest
   ```

## 📦 使用预构建镜像

### 方法 1: 从阿里云容器镜像服务拉取（推荐，国内用户）

如果镜像已推送到阿里云：

```bash
# 登录（如果需要）
docker login --username=HankeNJU crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com

# 拉取镜像
docker pull crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 运行容器
docker run -d -p 3000:3000 --env-file .env crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

**在阿里云 ECS 上使用 VPC 地址（更快，不消耗公网流量）:**

```bash
# 登录 VPC 地址
docker login --username=HankeNJU crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com

# 拉取镜像
docker pull crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 运行容器
docker run -d -p 3000:3000 --env-file .env crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

### 方法 2: 从 Docker Hub 拉取

如果镜像已推送到 Docker Hub：

```bash
docker pull your-username/ai-travel-planner:latest
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  your-username/ai-travel-planner:latest
```

### 方法 2: 从 tar 文件加载

如果您有导出的镜像文件（`.tar` 或 `.tar.gz`）：

**Linux/Mac:**
```bash
# 加载压缩的镜像文件
gunzip -c ai-travel-planner-latest.tar.gz | docker load

# 或加载未压缩的文件
docker load -i ai-travel-planner-latest.tar
```

**Windows (PowerShell):**
```powershell
# 加载镜像文件
docker load -i ai-travel-planner-latest.tar.gz
```

**运行容器:**
```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  ai-travel-planner:latest
```

## 🔧 常用命令

### 查看运行状态
```bash
docker-compose ps
# 或
docker ps
```

### 停止容器
```bash
docker-compose down
# 或
docker stop ai-travel-planner
```

### 重启容器
```bash
docker-compose restart
# 或
docker restart ai-travel-planner
```

### 查看日志
```bash
docker-compose logs -f
# 或
docker logs -f ai-travel-planner
```

### 进入容器
```bash
docker-compose exec ai-travel-planner sh
# 或
docker exec -it ai-travel-planner sh
```

### 更新镜像
```bash
# 停止并删除旧容器
docker-compose down

# 重新构建镜像
docker-compose build --no-cache

# 启动新容器
docker-compose up -d
```

## 🌐 生产环境部署

### 使用反向代理（Nginx）

创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 使用 HTTPS

推荐使用 [Let's Encrypt](https://letsencrypt.org/) 或 [Caddy](https://caddyserver.com/) 自动配置 HTTPS。

### 资源限制

在生产环境中，建议设置资源限制：

```yaml
# docker-compose.yml
services:
  ai-travel-planner:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 🔍 故障排除

### 容器无法启动

1. **检查日志**
   ```bash
   docker logs ai-travel-planner
   ```

2. **检查环境变量**
   ```bash
   docker exec ai-travel-planner env
   ```

3. **检查端口占用**
   ```bash
   # Linux/Mac
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

### 应用无法访问

1. **检查容器状态**
   ```bash
   docker ps -a
   ```

2. **检查端口映射**
   ```bash
   docker port ai-travel-planner
   ```

3. **检查防火墙设置**

### 环境变量未生效

确保环境变量文件格式正确：
- 使用 `KEY=value` 格式
- 不要有空格
- 不要使用引号（除非值中包含空格）

### 构建失败

1. **清理构建缓存**
   ```bash
   docker builder prune
   ```

2. **重新构建**
   ```bash
   docker-compose build --no-cache
   ```

## 📝 环境变量说明

### 必需的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | [Supabase 控制台](https://supabase.com/dashboard) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | [Supabase 控制台](https://supabase.com/dashboard) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | [Supabase 控制台](https://supabase.com/dashboard) |
| `DASHSCOPE_API_KEY` | 通义千问 API 密钥 | [阿里云 DashScope](https://dashscope.console.aliyun.com/) |

### 可选的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `IFLYTEK_APP_ID` | 科大讯飞应用 ID | [科大讯飞开放平台](https://www.xfyun.cn/) |
| `IFLYTEK_API_SECRET` | 科大讯飞 API Secret | [科大讯飞开放平台](https://www.xfyun.cn/) |
| `IFLYTEK_API_KEY` | 科大讯飞 API Key | [科大讯飞开放平台](https://www.xfyun.cn/) |
| `NEXT_PUBLIC_AMAP_KEY` | 高德地图 API Key | [高德开放平台](https://lbs.amap.com/) |
| `NEXT_PUBLIC_AMAP_SECURITY_KEY` | 高德地图安全密钥 | [高德开放平台](https://lbs.amap.com/) |

## 🔐 安全建议

1. **不要将 `.env` 文件提交到 Git**
   - 确保 `.env` 在 `.gitignore` 中
   - 使用环境变量管理服务（如 Vault、AWS Secrets Manager）

2. **使用 Docker Secrets**（生产环境）
   ```yaml
   services:
     ai-travel-planner:
       secrets:
         - supabase_url
         - supabase_key
       environment:
         - NEXT_PUBLIC_SUPABASE_URL_FILE=/run/secrets/supabase_url
   ```

3. **定期更新镜像**
   ```bash
   docker pull ai-travel-planner:latest
   ```

## 📚 相关文档

- [Supabase 配置指南](SUPABASE_SETUP.md)
- [通义千问配置指南](QWEN_SETUP.md)
- [高德地图配置指南](docs/AMAP_SETUP.md)
- [环境变量配置指南](docs/ENV_CONFIG_GUIDE.md)

## 💡 提示

- 首次构建可能需要几分钟时间
- 确保有足够的磁盘空间（至少 1GB）
- 建议在生产环境中使用 Docker Compose 管理多个服务
- 定期备份数据库和重要数据

## 📤 创建可分发的镜像文件

### 快速导出脚本

项目提供了便捷的脚本用于导出和推送镜像：

**导出为 tar 文件:**
```bash
# Linux/Mac
chmod +x scripts/export-docker-image.sh
./scripts/export-docker-image.sh

# Windows (PowerShell)
.\scripts\export-docker-image.ps1
```

**推送到 Docker Hub:**
```bash
# Linux/Mac
chmod +x scripts/push-to-dockerhub.sh
DOCKERHUB_USERNAME=your-username ./scripts/push-to-dockerhub.sh

# Windows (PowerShell)
.\scripts\push-to-dockerhub.ps1 -DockerHubUsername your-username
```

导出的镜像文件将保存在 `./docker-images/` 目录中。

### 镜像文件大小优化

导出的镜像文件可能较大（通常 500MB-1GB）。可以通过以下方式优化：

1. **使用多阶段构建**（已在 Dockerfile 中实现）
2. **清理构建缓存**
   ```bash
   docker builder prune -a
   ```
3. **使用 .dockerignore**（已配置）排除不必要的文件

## 🆘 获取帮助

如果遇到问题，请：
1. 查看 [故障排除](#-故障排除) 部分
2. 查看项目 [Issues](https://github.com/yourusername/AI-Travel-Planner/issues)
3. 提交新的 Issue 描述您的问题

---

**祝您使用愉快！🚀**


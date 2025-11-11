# 🐳 构建和导出 Docker 镜像指南

本指南将帮助您快速构建并导出 Docker 镜像文件。

## ⚡ 快速开始

### 步骤 1: 确保 Docker 正在运行

**Windows:**
- 打开 Docker Desktop
- 等待 Docker 完全启动（系统托盘图标不再显示"正在启动"）

**Linux/Mac:**
```bash
# 检查 Docker 是否运行
docker ps
```

### 步骤 2: 构建镜像

```bash
# 在项目根目录执行
docker build -t ai-travel-planner:latest .
```

构建过程可能需要 5-10 分钟，请耐心等待。

### 步骤 3: 导出镜像

**Windows (PowerShell):**
```powershell
# 使用提供的脚本（推荐）
.\scripts\export-docker-image.ps1

# 或手动导出
docker save -o ai-travel-planner-latest.tar ai-travel-planner:latest
Compress-Archive -Path ai-travel-planner-latest.tar -DestinationPath ai-travel-planner-latest.tar.gz
Remove-Item ai-travel-planner-latest.tar
```

**Linux/Mac:**
```bash
# 使用提供的脚本（推荐）
chmod +x scripts/export-docker-image.sh
./scripts/export-docker-image.sh

# 或手动导出
docker save -o ai-travel-planner-latest.tar ai-travel-planner:latest
gzip ai-travel-planner-latest.tar
```

### 步骤 4: 查找导出的文件

导出的镜像文件将保存在：
- **使用脚本**: `./docker-images/ai-travel-planner-latest-YYYYMMDD_HHMMSS.tar.gz`
- **手动导出**: `./ai-travel-planner-latest.tar.gz`

## 📦 分发镜像文件

### 方法 1: 直接传输文件

1. 将 `.tar.gz` 文件传输到目标机器（通过 U盘、网络传输等）
2. 在目标机器上加载镜像（见下方"使用导出的镜像"）

### 方法 2: 上传到云存储

1. 上传 `.tar.gz` 文件到：
   - Google Drive
   - Dropbox
   - OneDrive
   - 百度网盘
   - 阿里云 OSS
   - 腾讯云 COS
   - 等等
2. 分享下载链接
3. 用户在目标机器上下载并加载镜像

### 方法 3: 推送到 Docker Hub（推荐）

```bash
# 登录 Docker Hub
docker login

# 标记镜像
docker tag ai-travel-planner:latest your-username/ai-travel-planner:latest

# 推送镜像
docker push your-username/ai-travel-planner:latest
```

然后其他人可以直接拉取：
```bash
docker pull your-username/ai-travel-planner:latest
```

## 📥 使用导出的镜像

### 在目标机器上加载镜像

**Windows (PowerShell):**
```powershell
# 加载镜像
docker load -i ai-travel-planner-latest.tar.gz
```

**Linux/Mac:**
```bash
# 加载镜像
gunzip -c ai-travel-planner-latest.tar.gz | docker load

# 或如果文件未压缩
docker load -i ai-travel-planner-latest.tar
```

### 运行容器

1. **创建环境变量文件** `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DASHSCOPE_API_KEY=sk-your-api-key
   ```

2. **运行容器**:
   ```bash
   docker run -d \
     --name ai-travel-planner \
     -p 3000:3000 \
     --env-file .env \
     ai-travel-planner:latest
   ```

3. **访问应用**: http://localhost:3000

## 🔍 验证镜像

构建完成后，可以验证镜像：

```bash
# 查看镜像列表
docker images | grep ai-travel-planner

# 查看镜像详细信息
docker inspect ai-travel-planner:latest

# 测试运行（不启动服务）
docker run --rm ai-travel-planner:latest node --version
```

## ⚠️ 常见问题

### Docker Desktop 未运行

**错误信息**: `Cannot connect to the Docker daemon`

**解决方法**:
- Windows: 启动 Docker Desktop 应用
- Linux: 启动 Docker 服务 `sudo systemctl start docker`
- Mac: 启动 Docker Desktop 应用

### 构建失败

**可能原因**:
1. 网络问题（无法下载依赖）
2. 磁盘空间不足
3. 内存不足

**解决方法**:
```bash
# 清理 Docker 缓存
docker builder prune -a

# 检查磁盘空间
df -h  # Linux/Mac
Get-PSDrive C  # Windows PowerShell

# 增加 Docker 内存限制（Docker Desktop 设置中）
```

### 镜像文件太大

镜像文件通常在 500MB-1GB 之间。如果太大：

```bash
# 清理未使用的镜像和容器
docker system prune -a

# 使用多阶段构建（已在 Dockerfile 中实现）
# 检查 .dockerignore 是否正确配置
```

## 📝 完整示例

```bash
# 1. 确保 Docker 运行
docker ps

# 2. 构建镜像
docker build -t ai-travel-planner:latest .

# 3. 导出镜像（Windows PowerShell）
.\scripts\export-docker-image.ps1

# 4. 查看导出的文件
ls docker-images/

# 5. 在目标机器上加载
docker load -i docker-images/ai-travel-planner-latest-*.tar.gz

# 6. 运行容器
docker run -d -p 3000:3000 --env-file .env ai-travel-planner:latest
```

## 🎯 下一步

- 查看 [DOCKER.md](DOCKER.md) 了解详细的 Docker 使用说明
- 查看 [README.md](README.md) 了解项目整体信息
- 查看 [docs/ENV_CONFIG_GUIDE.md](docs/ENV_CONFIG_GUIDE.md) 了解环境变量配置

---

**需要帮助？** 查看 [DOCKER.md](DOCKER.md) 的故障排除部分。



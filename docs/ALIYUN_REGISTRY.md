# 🐳 推送到阿里云容器镜像服务

本指南将帮助您将 Docker 镜像推送到阿里云个人版容器镜像服务。

## 📋 配置信息

- **注册表地址**: `crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com`
- **VPC地址**: `crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com`
- **用户名**: `HankeNJU`
- **命名空间**: `njuse-hanke`
- **仓库名称**: `hanke0725`

## 🚀 快速开始

### 方法一：使用脚本（推荐）

**Windows (PowerShell):**
```powershell
# 推送 latest 版本
.\scripts\push-to-aliyun-personal.ps1

# 推送指定版本
.\scripts\push-to-aliyun-personal.ps1 -Tag v1.0.0
```

**Linux/Mac:**
```bash
# 添加执行权限
chmod +x scripts/push-to-aliyun-personal.sh

# 推送 latest 版本
./scripts/push-to-aliyun-personal.sh

# 推送指定版本
./scripts/push-to-aliyun-personal.sh v1.0.0
```

### 方法二：手动推送

#### 1. 登录阿里云容器镜像服务

```bash
docker login --username=HankeNJU crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com
```

**提示**:
- 用户名: `HankeNJU`（阿里云账号全名）
- 密码: 您在阿里云访问凭证页面设置的密码

#### 2. 给镜像打标签

```bash
# 查看本地镜像ID
docker images

# 给镜像打标签（替换 [ImageId] 为实际镜像ID）
docker tag [ImageId] crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 或者使用镜像名称
docker tag ai-travel-planner:latest crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

#### 3. 推送镜像

```bash
docker push crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

## 🌐 使用 VPC 地址（推荐用于 ECS）

如果您在阿里云 ECS 上推送或拉取镜像，使用 VPC 地址可以：
- ✅ 提升推送/拉取速度
- ✅ 不消耗公网流量
- ✅ 更安全

### 推送（VPC）

```bash
# 登录 VPC 地址
docker login --username=HankeNJU crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com

# 打标签
docker tag ai-travel-planner:latest crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 推送
docker push crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

### 拉取（VPC）

```bash
docker pull crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

## 📥 从阿里云拉取镜像

### 在其他机器上拉取

```bash
# 登录（如果需要）
docker login --username=HankeNJU crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com

# 拉取镜像
docker pull crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 运行容器
docker run -d -p 3000:3000 --env-file .env crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

### 在阿里云 ECS 上拉取（使用 VPC）

```bash
# 登录 VPC 地址
docker login --username=HankeNJU crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com

# 拉取镜像
docker pull crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 运行容器
docker run -d -p 3000:3000 --env-file .env crpi-5mgwmfh845gluhfy-vpc.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
```

## 🏷️ 版本管理

### 推送多个版本

```bash
# 推送 latest
docker tag ai-travel-planner:latest crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
docker push crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 推送 v1.0.0
docker tag ai-travel-planner:latest crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:v1.0.0
docker push crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:v1.0.0

# 推送带日期标签
docker tag ai-travel-planner:latest crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:20251112
docker push crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:20251112
```

## 🔧 故障排除

### 登录失败

**问题**: `unauthorized: authentication required`

**解决方案**:
1. 检查用户名是否正确: `HankeNJU`
2. 确认密码是访问凭证页面设置的密码（不是阿里云登录密码）
3. 在[访问凭证页面](https://cr.console.aliyun.com/cn-hangzhou/instances/personal/credentials)重置密码

### 推送失败

**问题**: `denied: requested access to the resource is denied`

**解决方案**:
1. 检查命名空间和仓库名称是否正确
2. 确认您有推送权限
3. 检查仓库是否存在

### 网络问题

**问题**: 推送速度慢或超时

**解决方案**:
1. 如果在 ECS 上，使用 VPC 地址
2. 检查网络连接
3. 使用国内镜像加速器

## 📝 完整示例

```bash
# 1. 构建镜像
docker build -t ai-travel-planner:latest .

# 2. 登录阿里云
docker login --username=HankeNJU crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com

# 3. 打标签
docker tag ai-travel-planner:latest crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 4. 推送
docker push crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest

# 5. 验证（在其他机器上）
docker pull crpi-5mgwmfh845gluhfy.cn-hangzhou.personal.cr.aliyuncs.com/njuse-hanke/hanke0725:latest
docker images | grep hanke0725
```

## 🔗 相关链接

- [阿里云容器镜像服务控制台](https://cr.console.aliyun.com/)
- [访问凭证管理](https://cr.console.aliyun.com/cn-hangzhou/instances/personal/credentials)
- [Docker 部署指南](../DOCKER.md)


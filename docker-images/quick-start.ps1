# AI Travel Planner 快速启动脚本 (Windows PowerShell)
# 此脚本将帮助您快速配置并启动 Docker 容器

$ErrorActionPreference = "Stop"

Write-Host "🚀 AI Travel Planner - 快速启动向导" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Docker 是否运行
Write-Host "📋 检查 Docker 状态..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker 正在运行" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误: Docker 未运行或无法连接" -ForegroundColor Red
    Write-Host "请先启动 Docker Desktop，然后重新运行此脚本" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""

# 检查镜像是否存在
Write-Host "📦 检查 Docker 镜像..." -ForegroundColor Yellow
$imageExists = docker images --format "{{.Repository}}:{{.Tag}}" | Select-String "ai-travel-planner:latest"
if (-not $imageExists) {
    Write-Host "⚠️  镜像不存在，正在查找 tar 文件..." -ForegroundColor Yellow
    
    $tarFile = Get-ChildItem -Path . -Filter "ai-travel-planner-latest-*.tar" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    if ($tarFile) {
        Write-Host "📥 找到镜像文件: $($tarFile.Name)" -ForegroundColor Cyan
        Write-Host "正在加载镜像..." -ForegroundColor Yellow
        docker load -i $tarFile.FullName
        Write-Host "✅ 镜像加载成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 未找到镜像文件，请先加载镜像：" -ForegroundColor Red
        Write-Host "   docker load -i ai-travel-planner-latest-*.tar" -ForegroundColor Yellow
        Read-Host "按 Enter 键退出"
        exit 1
    }
} else {
    Write-Host "✅ 镜像已存在" -ForegroundColor Green
}

Write-Host ""

# 检查 .env 文件
Write-Host "⚙️  检查环境变量配置..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  未找到 .env 文件" -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Write-Host "📋 从 .env.example 创建 .env 文件..." -ForegroundColor Cyan
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env 文件已创建" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  重要：请编辑 .env 文件，填写您的 API keys！" -ForegroundColor Red
        Write-Host "   必需配置：" -ForegroundColor Yellow
        Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Yellow
        Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Yellow
        Write-Host "   - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow
        Write-Host "   - DASHSCOPE_API_KEY" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   可选配置：" -ForegroundColor Yellow
        Write-Host "   - NEXT_PUBLIC_AMAP_KEY (地图功能)" -ForegroundColor Yellow
        Write-Host ""
        
        $openEditor = Read-Host "是否现在打开 .env 文件进行编辑？(Y/N)"
        if ($openEditor -eq "Y" -or $openEditor -eq "y") {
            notepad .env
        }
        
        Write-Host ""
        $continue = Read-Host "配置完成后，按 Enter 继续..."
    } else {
        Write-Host "❌ 未找到 .env.example 文件" -ForegroundColor Red
        Write-Host "请手动创建 .env 文件并配置环境变量" -ForegroundColor Yellow
        Read-Host "按 Enter 键退出"
        exit 1
    }
} else {
    Write-Host "✅ .env 文件已存在" -ForegroundColor Green
    
    # 检查是否已配置
    $envContent = Get-Content .env -Raw
    if ($envContent -match "your-.*-here" -or $envContent -match "your_.*_here") {
        Write-Host "⚠️  警告: .env 文件中仍有未配置的占位符" -ForegroundColor Yellow
        Write-Host "请确保已填写所有必需的 API keys" -ForegroundColor Yellow
        Write-Host ""
    }
}

Write-Host ""

# 检查容器是否已存在
Write-Host "🐳 检查现有容器..." -ForegroundColor Yellow
$containerExists = docker ps -a --format "{{.Names}}" | Select-String "ai-travel-planner"
if ($containerExists) {
    Write-Host "⚠️  容器已存在" -ForegroundColor Yellow
    $action = Read-Host "选择操作: (1) 启动现有容器  (2) 删除并重新创建  (3) 退出"
    
    switch ($action) {
        "1" {
            Write-Host "🚀 启动容器..." -ForegroundColor Cyan
            docker start ai-travel-planner
            Write-Host "✅ 容器已启动" -ForegroundColor Green
        }
        "2" {
            Write-Host "🗑️  删除现有容器..." -ForegroundColor Yellow
            docker stop ai-travel-planner 2>$null
            docker rm ai-travel-planner
            Write-Host "✅ 容器已删除" -ForegroundColor Green
            
            Write-Host "🚀 创建新容器..." -ForegroundColor Cyan
            docker run -d --name ai-travel-planner -p 3000:3000 --env-file .env --restart always ai-travel-planner:latest
            Write-Host "✅ 容器已创建并启动" -ForegroundColor Green
        }
        default {
            Write-Host "退出" -ForegroundColor Yellow
            exit 0
        }
    }
} else {
    Write-Host "🚀 创建并启动容器..." -ForegroundColor Cyan
    docker run -d --name ai-travel-planner -p 3000:3000 --env-file .env --restart always ai-travel-planner:latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 容器已创建并启动" -ForegroundColor Green
    } else {
        Write-Host "❌ 容器启动失败" -ForegroundColor Red
        Write-Host "请检查 .env 文件配置和 Docker 日志" -ForegroundColor Yellow
        Read-Host "按 Enter 键退出"
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 下一步：" -ForegroundColor Cyan
Write-Host "   1. 等待几秒钟让容器完全启动" -ForegroundColor White
Write-Host "   2. 打开浏览器访问: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📋 常用命令：" -ForegroundColor Cyan
Write-Host "   查看日志: docker logs -f ai-travel-planner" -ForegroundColor White
Write-Host "   停止容器: docker stop ai-travel-planner" -ForegroundColor White
Write-Host "   重启容器: docker restart ai-travel-planner" -ForegroundColor White
Write-Host ""

Read-Host "按 Enter 键退出"


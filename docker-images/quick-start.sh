#!/bin/bash

# AI Travel Planner 快速启动脚本 (Linux/Mac)
# 此脚本将帮助您快速配置并启动 Docker 容器

set -e

echo "🚀 AI Travel Planner - 快速启动向导"
echo "====================================="
echo ""

# 检查 Docker 是否运行
echo "📋 检查 Docker 状态..."
if ! docker ps > /dev/null 2>&1; then
    echo "❌ 错误: Docker 未运行或无法连接"
    echo "请先启动 Docker，然后重新运行此脚本"
    read -p "按 Enter 键退出"
    exit 1
fi

echo "✅ Docker 正在运行"
echo ""

# 检查镜像是否存在
echo "📦 检查 Docker 镜像..."
if ! docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "ai-travel-planner:latest"; then
    echo "⚠️  镜像不存在，正在查找 tar 文件..."
    
    tar_file=$(ls -t ai-travel-planner-latest-*.tar 2>/dev/null | head -n 1)
    
    if [ -n "$tar_file" ]; then
        echo "📥 找到镜像文件: $tar_file"
        echo "正在加载镜像..."
        docker load -i "$tar_file"
        echo "✅ 镜像加载成功"
    else
        echo "❌ 未找到镜像文件，请先加载镜像："
        echo "   docker load -i ai-travel-planner-latest-*.tar"
        read -p "按 Enter 键退出"
        exit 1
    fi
else
    echo "✅ 镜像已存在"
fi

echo ""

# 检查 .env 文件
echo "⚙️  检查环境变量配置..."
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件"
    
    if [ -f ".env.example" ]; then
        echo "📋 从 .env.example 创建 .env 文件..."
        cp .env.example .env
        echo "✅ .env 文件已创建"
        echo ""
        echo "⚠️  重要：请编辑 .env 文件，填写您的 API keys！"
        echo "   必需配置："
        echo "   - NEXT_PUBLIC_SUPABASE_URL"
        echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "   - SUPABASE_SERVICE_ROLE_KEY"
        echo "   - DASHSCOPE_API_KEY"
        echo ""
        echo "   可选配置："
        echo "   - NEXT_PUBLIC_AMAP_KEY (地图功能)"
        echo ""
        
        read -p "是否现在打开 .env 文件进行编辑？(Y/N) " open_editor
        if [ "$open_editor" = "Y" ] || [ "$open_editor" = "y" ]; then
            ${EDITOR:-nano} .env
        fi
        
        echo ""
        read -p "配置完成后，按 Enter 继续..."
    else
        echo "❌ 未找到 .env.example 文件"
        echo "请手动创建 .env 文件并配置环境变量"
        read -p "按 Enter 键退出"
        exit 1
    fi
else
    echo "✅ .env 文件已存在"
    
    # 检查是否已配置
    if grep -q "your-.*-here\|your_.*_here" .env; then
        echo "⚠️  警告: .env 文件中仍有未配置的占位符"
        echo "请确保已填写所有必需的 API keys"
        echo ""
    fi
fi

echo ""

# 检查容器是否已存在
echo "🐳 检查现有容器..."
if docker ps -a --format "{{.Names}}" | grep -q "ai-travel-planner"; then
    echo "⚠️  容器已存在"
    echo "选择操作: (1) 启动现有容器  (2) 删除并重新创建  (3) 退出"
    read -p "请输入选项: " action
    
    case $action in
        1)
            echo "🚀 启动容器..."
            docker start ai-travel-planner
            echo "✅ 容器已启动"
            ;;
        2)
            echo "🗑️  删除现有容器..."
            docker stop ai-travel-planner 2>/dev/null || true
            docker rm ai-travel-planner
            
            echo "🚀 创建新容器..."
            docker run -d --name ai-travel-planner -p 3000:3000 --env-file .env --restart always ai-travel-planner:latest
            echo "✅ 容器已创建并启动"
            ;;
        *)
            echo "退出"
            exit 0
            ;;
    esac
else
    echo "🚀 创建并启动容器..."
    docker run -d --name ai-travel-planner -p 3000:3000 --env-file .env --restart always ai-travel-planner:latest
    
    if [ $? -eq 0 ]; then
        echo "✅ 容器已创建并启动"
    else
        echo "❌ 容器启动失败"
        echo "请检查 .env 文件配置和 Docker 日志"
        read -p "按 Enter 键退出"
        exit 1
    fi
fi

echo ""
echo "🎉 启动完成！"
echo ""
echo "📝 下一步："
echo "   1. 等待几秒钟让容器完全启动"
echo "   2. 打开浏览器访问: http://localhost:3000"
echo ""
echo "📋 常用命令："
echo "   查看日志: docker logs -f ai-travel-planner"
echo "   停止容器: docker stop ai-travel-planner"
echo "   重启容器: docker restart ai-travel-planner"
echo ""

read -p "按 Enter 键退出"


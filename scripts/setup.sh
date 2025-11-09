#!/bin/bash

# AI Travel Planner - Quick Setup Script

echo "🚀 Setting up AI Travel Planner..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your OpenAI API key"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local and add your OPENAI_API_KEY"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy travel planning! ✈️"


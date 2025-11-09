@echo off
REM AI Travel Planner - Quick Setup Script for Windows

echo.
echo 🚀 Setting up AI Travel Planner...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo Visit: https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy .env.local.example .env.local
    echo.
    echo ⚠️  IMPORTANT: Please edit .env.local and add your OpenAI API key
    echo    Get your API key from: https://platform.openai.com/api-keys
    echo.
) else (
    echo ✅ .env.local already exists
    echo.
)

echo ✨ Setup complete!
echo.
echo Next steps:
echo   1. Edit .env.local and add your OPENAI_API_KEY
echo   2. Run 'npm run dev' to start the development server
echo   3. Open http://localhost:3000 in your browser
echo.
echo Happy travel planning! ✈️
echo.
pause


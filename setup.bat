@echo off
REM GitFolio AI - Quick Start Script for Windows
REM This script helps you get started with GitFolio AI quickly

echo.
echo 🚀 GitFolio AI - Quick Start Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.10 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i

echo ✅ %PYTHON_VERSION% detected
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
python -m pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

REM Create .env file
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env and add your GitHub token
    echo    Get your token from: https://github.com/settings/tokens
    echo.
)

REM Create data and charts directories
if not exist "data" mkdir data
if not exist "charts" mkdir charts

cd ..

REM Setup Frontend
echo 📦 Setting up Frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install --silent

REM Create .env.local file
if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.local.example .env.local
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next Steps:
echo.
echo 1. Add your GitHub token to backend\.env:
echo    GITHUB_TOKEN=your_github_token_here
echo.
echo 2. Start the backend server:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    uvicorn main:app --reload
echo.
echo 3. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open your browser to:
echo    http://localhost:3000
echo.
echo 📚 For more information, see README.md
echo.
echo 🎉 Happy coding!
echo.

pause

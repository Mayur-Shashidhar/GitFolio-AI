#!/bin/bash

# GitFolio AI - Quick Start Script
# This script helps you get started with GitFolio AI quickly

set -e

echo "🚀 GitFolio AI - Quick Start Setup"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Python $(python3 --version) detected"
echo "✅ Node.js $(node --version) detected"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Create .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your GitHub token"
    echo "   Get your token from: https://github.com/settings/tokens"
    echo ""
fi

# Create data and charts directories
mkdir -p data charts

cd ..

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install --silent

# Create .env.local file
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Add your GitHub token to backend/.env:"
echo "   GITHUB_TOKEN=your_github_token_here"
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🎉 Happy coding!"

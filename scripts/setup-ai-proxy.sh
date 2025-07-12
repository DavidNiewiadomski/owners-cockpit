#!/bin/bash

# AI Proxy Setup Script
# This script sets up the local AI proxy server for development

echo "🤖 Setting up AI Proxy Server..."

# Navigate to ai-proxy directory
cd services/ai-proxy

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit services/ai-proxy/.env.local and add your API keys:"
    echo "   - OPENAI_API_KEY"
    echo "   - ANTHROPIC_API_KEY" 
    echo "   - GEMINI_API_KEY"
    echo "   - ELEVENLABS_API_KEY (optional)"
    echo ""
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🚀 Setup complete! To start the AI proxy server:"
echo "   cd services/ai-proxy"
echo "   npm start"
echo ""
echo "Or run both servers together from the root directory:"
echo "   npm run dev         # In terminal 1 (Vite)"
echo "   npm run ai-proxy    # In terminal 2 (AI Proxy)"
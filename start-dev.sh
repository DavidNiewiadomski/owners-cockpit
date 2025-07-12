#!/bin/bash

echo "🚀 Starting AI-powered Construction Management Platform..."
echo "=================================================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "ai-proxy" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Start AI proxy server
echo "🤖 Starting AI proxy server..."
cd services/ai-proxy
npm start &
AI_PROXY_PID=$!
cd ../..

# Wait for AI proxy to be ready
echo "⏳ Waiting for AI proxy to be ready..."
sleep 3

# Check if AI proxy is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ AI proxy is running at http://localhost:3001"
else
    echo "❌ Failed to start AI proxy server"
    exit 1
fi

# Start Vite dev server
echo "🎨 Starting frontend development server..."
npm run dev &
VITE_PID=$!

echo ""
echo "=================================================="
echo "✅ All services started successfully!"
echo ""
echo "🌐 Frontend: http://localhost:5173 (or 5174)"
echo "🤖 AI Proxy: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $AI_PROXY_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    pkill -f "ai-proxy" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set up trap to cleanup on Ctrl+C
trap cleanup INT

# Wait for processes
wait
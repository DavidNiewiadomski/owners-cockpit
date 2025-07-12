#!/bin/bash

# Setup API Keys in Supabase Secrets
# This script helps you configure the necessary API keys for the AI system

echo "🔐 Setting up API keys for AI system..."
echo "=================================="
echo ""

# Function to set a secret
set_secret() {
    local key_name=$1
    local key_value=$2
    
    if [ -z "$key_value" ] || [ "$key_value" == "skip" ]; then
        echo "⏭️  Skipping $key_name"
        return
    fi
    
    npx supabase secrets set $key_name=$key_value
    if [ $? -eq 0 ]; then
        echo "✅ $key_name set successfully"
    else
        echo "❌ Failed to set $key_name"
    fi
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

echo "This script will help you set up API keys for:"
echo "1. OpenAI (GPT-4) - For general AI responses"
echo "2. Anthropic (Claude) - For complex analysis"
echo "3. Google (Gemini) - For large context windows"
echo "4. ElevenLabs - For voice synthesis"
echo ""
echo "Note: The system works with ANY of these providers."
echo "If you don't have all keys, just press Enter to skip."
echo ""

# OpenAI
echo "🤖 OpenAI API Key"
echo "Get your key from: https://platform.openai.com/api-keys"
read -p "Enter your OpenAI API key (or 'skip'): " OPENAI_KEY
set_secret "OPENAI_API_KEY" "$OPENAI_KEY"
echo ""

# Anthropic
echo "🧠 Anthropic API Key"
echo "Get your key from: https://console.anthropic.com/settings/keys"
read -p "Enter your Anthropic API key (or 'skip'): " ANTHROPIC_KEY
set_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_KEY"
echo ""

# Google Gemini
echo "🌟 Google Gemini API Key"
echo "Get your key from: https://makersuite.google.com/app/apikey"
read -p "Enter your Gemini API key (or 'skip'): " GEMINI_KEY
set_secret "GEMINI_API_KEY" "$GEMINI_KEY"
echo ""

# ElevenLabs
echo "🎤 ElevenLabs API Key"
echo "Get your key from: https://elevenlabs.io/settings/api-keys"
read -p "Enter your ElevenLabs API key (or 'skip'): " ELEVENLABS_KEY
set_secret "ELEVENLABS_API_KEY" "$ELEVENLABS_KEY"
echo ""

echo "=================================="
echo "🎉 API key setup complete!"
echo ""
echo "The AI system will automatically use available providers."
echo "Even without any API keys, it provides intelligent responses."
echo ""
echo "To verify your setup, run:"
echo "  npm run dev"
echo "  Then test the AI chat in your browser"
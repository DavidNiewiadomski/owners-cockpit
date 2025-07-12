#!/bin/bash

# Setup ALL API Keys and Secrets in Supabase
# This script migrates all keys from .env.local to Supabase secrets

echo "🔐 Setting up ALL API keys and secrets for production AI system..."
echo "=================================================="
echo ""

# Function to set a secret with error handling
set_secret() {
    local key_name=$1
    local key_value=$2
    
    if [ -z "$key_value" ] || [ "$key_value" == "skip" ]; then
        echo "⏭️  Skipping $key_name (no value)"
        return
    fi
    
    echo "🔄 Setting $key_name..."
    npx supabase secrets set $key_name="$key_value"
    if [ $? -eq 0 ]; then
        echo "✅ $key_name set successfully"
    else
        echo "❌ Failed to set $key_name"
        exit 1
    fi
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Load .env.local file
if [ -f .env.local ]; then
    echo "📄 Loading configuration from .env.local..."
    set -a
    source .env.local
    set +a
else
    echo "❌ .env.local file not found!"
    exit 1
fi

echo ""
echo "🚀 Migrating API Keys to Supabase Secrets..."
echo ""

# Core AI Services
echo "=== AI Services ==="
set_secret "OPENAI_API_KEY" "$OPENAI_API_KEY"
set_secret "AZURE_OPENAI_ENDPOINT" "$AZURE_OPENAI_ENDPOINT"
set_secret "AZURE_OPENAI_KEY" "$AZURE_OPENAI_KEY"
set_secret "AZURE_OPENAI_API_KEY" "$AZURE_OPENAI_KEY"  # Alias for compatibility
set_secret "AZURE_OPENAI_GPT_DEPLOYMENT" "$AZURE_OPENAI_GPT_DEPLOYMENT"
set_secret "AZURE_OPENAI_DEPLOYMENT_NAME" "$AZURE_OPENAI_GPT_DEPLOYMENT"  # Alias
set_secret "AZURE_OPENAI_EMBEDDING_DEPLOYMENT" "$AZURE_OPENAI_EMBEDDING_DEPLOYMENT"
set_secret "GEMINI_API_KEY" "$GEMINI_API_KEY"
set_secret "GOOGLE_GEMINI_API_KEY" "$GEMINI_API_KEY"  # Alias
set_secret "ANTHROPIC_API_KEY" "${ANTHROPIC_API_KEY:-not_configured}"
echo ""

# Voice and Media Services
echo "=== Voice & Media Services ==="
set_secret "ELEVENLABS_API_KEY" "$ELEVENLABS_API_KEY"
echo ""

# Document Processing
echo "=== Document Processing ==="
set_secret "GOOGLE_CLOUD_VISION_API_KEY" "$GOOGLE_CLOUD_VISION_API_KEY"
set_secret "ADOBE_PDF_CLIENT_ID" "$ADOBE_PDF_CLIENT_ID"
set_secret "ADOBE_PDF_CLIENT_SECRET" "$ADOBE_PDF_CLIENT_SECRET"
set_secret "ADOBE_PDF_ORGANIZATION_ID" "$ADOBE_PDF_ORGANIZATION_ID"
echo ""

# Data Services
echo "=== Data Services ==="
set_secret "SNOWFLAKE_ACCOUNT" "$SNOWFLAKE_ACCOUNT"
set_secret "SNOWFLAKE_USERNAME" "$SNOWFLAKE_USERNAME"
set_secret "SNOWFLAKE_PASSWORD" "$SNOWFLAKE_PASSWORD"
set_secret "SNOWFLAKE_DATABASE" "$SNOWFLAKE_DATABASE"
set_secret "SNOWFLAKE_WAREHOUSE" "$SNOWFLAKE_WAREHOUSE"
set_secret "SNOWFLAKE_ROLE" "$SNOWFLAKE_ROLE"
echo ""

# External Integrations
echo "=== External Integrations ==="
set_secret "GITHUB_TOKEN" "$GITHUB_TOKEN"
set_secret "PROCORE_API_KEY" "${PROCORE_API_KEY:-not_configured}"
set_secret "PROCORE_COMPANY_ID" "${PROCORE_COMPANY_ID:-not_configured}"
set_secret "OUTLOOK_ACCESS_TOKEN" "${OUTLOOK_ACCESS_TOKEN:-not_configured}"
echo ""

# Application Settings
echo "=== Application Settings ==="
set_secret "APP_URL" "${VITE_APP_URL:-http://localhost:5173}"
set_secret "NODE_ENV" "${NODE_ENV:-development}"
echo ""

echo "=================================================="
echo "✅ Secret migration complete!"
echo ""
echo "🔍 Verifying secrets..."
npx supabase secrets list

echo ""
echo "📝 Next steps:"
echo "1. Restart your local Supabase instance: npx supabase stop && npx supabase start"
echo "2. The AI system will now have access to all configured services"
echo "3. Test the system at http://localhost:5173"
echo ""
echo "🎉 Your AI-native platform is ready for production use!"
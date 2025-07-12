# AI System Setup Guide

## Overview
The AI system is designed to work intelligently even WITHOUT API keys. It provides contextual responses based on your questions and available data.

## Quick Start

1. **The AI works out of the box!** Even without API keys, it provides intelligent responses.

2. **To add API keys for enhanced capabilities:**
   ```bash
   ./scripts/setup-api-keys.sh
   ```

## API Key Providers

### OpenAI (GPT-4)
- **Used for:** General conversations, code analysis, quick responses
- **Get key:** https://platform.openai.com/api-keys
- **Models:** GPT-4o, GPT-4o-mini

### Anthropic (Claude)
- **Used for:** Complex analysis, long documents, creative tasks
- **Get key:** https://console.anthropic.com/settings/keys
- **Models:** Claude 3.5 Sonnet, Claude 3 Haiku

### Google (Gemini)
- **Used for:** Large context windows, translations, data analysis
- **Get key:** https://makersuite.google.com/app/apikey
- **Models:** Gemini 1.5 Pro, Gemini 1.5 Flash

### ElevenLabs
- **Used for:** Premium voice synthesis
- **Get key:** https://elevenlabs.io/settings/api-keys
- **Features:** Natural human-like voice responses

## How It Works

1. **With API Keys:** The system intelligently routes to the best model based on:
   - Task type (analysis, creative, code review, etc.)
   - Response speed requirements
   - Token count and complexity
   - Budget optimization

2. **Without API Keys:** The system provides:
   - Context-aware responses based on your question
   - Access to project data and analytics
   - Intelligent fallback responses
   - All core functionality remains available

## Testing Your Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the AI Demo:**
   - Navigate to http://localhost:5173
   - Click "AI Demo" in the header

3. **Test with questions like:**
   - "What's the project status?"
   - "Show me the budget analysis"
   - "What day is it today?"
   - "Hello, who are you?"

## Troubleshooting

### AI not responding?
1. Check if Supabase is running: `npx supabase status`
2. Look at the browser console for errors
3. Verify your network connection

### Voice not working?
1. ElevenLabs API key is optional
2. Browser must support Web Speech API
3. Microphone permissions must be granted

### Want to use specific providers?
Set only the API keys you have. The system automatically uses available providers and falls back gracefully.

## Architecture

```
User Input → Frontend AI Service → Supabase Edge Function → LLM Router
                                                              ↓
                                                     Available Providers:
                                                     - OpenAI API
                                                     - Anthropic API  
                                                     - Google Gemini API
                                                     - Intelligent Fallback
```

The LLM Router automatically:
- Selects the best model for your task
- Manages API budgets
- Provides fallbacks if APIs are unavailable
- Tracks usage and costs

## Security

- API keys are stored securely in Supabase Secrets
- Never commit API keys to your repository
- Keys are only accessible to edge functions
- Frontend never sees your API keys
# AI Setup Guide for Owners Cockpit

## Overview
The AI functionality is now integrated and ready to use! However, to make it fully functional, you need to configure the API keys in your Supabase project.

## Quick Setup Steps

### 1. Set Environment Variables in Supabase Dashboard

Go to your Supabase project dashboard and add these environment variables:

1. Navigate to: **Settings → Edge Functions → Environment Variables**
2. Add the following secrets:

```bash
# Required for AI to work
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key  
GEMINI_API_KEY=your-gemini-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# For document processing
ADOBE_PDF_CLIENT_ID=your-adobe-client-id
ADOBE_PDF_CLIENT_SECRET=your-adobe-client-secret
GOOGLE_CLOUD_VISION_API_KEY=your-google-vision-key
```

### 2. Deploy Edge Functions (if not already deployed)

If you haven't deployed the edge functions yet, run:

```bash
supabase functions deploy construction-assistant
supabase functions deploy chatRag
```

### 3. Test the AI Chat

1. Open your app at http://localhost:5173/
2. Click the AI chat button (floating button in bottom right)
3. Try these test commands:
   - "What's the current project status?"
   - "Show me the budget summary"
   - "Navigate to the construction dashboard"
   - Use the microphone button for voice commands

## Features Now Available

### 🎯 Intelligent Conversations
- Natural language understanding
- Context-aware responses based on current dashboard view
- Memory of conversation history

### 🎤 Voice Capabilities
- Voice input with real-time transcription
- Voice responses (if ElevenLabs key is configured)
- Hands-free operation

### 🔧 Platform Actions
- Navigate between dashboards
- Execute commands
- Create reports
- Send notifications

### 📊 Real-time Data Access
- Project progress and milestones
- Budget and financial data
- Safety metrics
- Team communications
- Weather conditions

### 🧠 Multi-Model Support
The system automatically selects the best AI model based on:
- Task complexity
- Response time requirements
- Cost optimization
- Availability

## How It Works

1. **Frontend AI Service** (`/src/lib/ai/frontend-ai-service.ts`)
   - Handles voice recording and transcription
   - Manages conversation state
   - Routes requests to Supabase edge functions

2. **Edge Function** (`/supabase/functions/construction-assistant/`)
   - Securely handles API keys
   - Routes to optimal AI model
   - Executes tools and actions
   - Manages conversation memory

3. **Unified AI Service** (`/src/lib/ai/unified-ai-service.ts`)
   - Supports multiple AI providers
   - Automatic fallback between providers
   - Document processing
   - Voice synthesis

## Troubleshooting

### AI not responding?
1. Check browser console for errors
2. Verify API keys are set in Supabase dashboard
3. Ensure edge functions are deployed
4. Check Supabase logs: `supabase functions logs construction-assistant`

### Voice not working?
1. Allow microphone permissions when prompted
2. Use Chrome or Edge browser for best compatibility
3. Check that your system has a working microphone

### Slow responses?
The first request may be slow as the edge function cold starts. Subsequent requests will be faster.

## Advanced Features

### Custom Voice Commands
You can use natural language commands like:
- "Navigate to the finance dashboard"
- "Show me safety incidents from last week"
- "Send a status update to the team"
- "Create a progress report"

### Platform Navigation
The AI can navigate the platform for you:
- "Take me to project settings"
- "Show the procurement view"
- "Open the sustainability dashboard"

### Data Analysis
Ask analytical questions:
- "What's our burn rate this month?"
- "Are we on track to meet the deadline?"
- "What are the critical path items?"

## Security Notes

- API keys are stored securely in Supabase and never exposed to the browser
- All AI requests go through authenticated edge functions
- Conversation history is stored per user/project
- Voice data is processed locally when possible

## Next Steps

1. Configure your API keys in Supabase
2. Test the chat functionality
3. Try voice commands
4. Explore asking questions about your project data

The AI is designed to be your intelligent assistant for construction management - use it to streamline your workflow and get instant insights!
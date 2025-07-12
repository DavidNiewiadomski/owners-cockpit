# AI Proxy Server

A local development server that handles AI API calls securely, avoiding the need to expose API keys in the frontend or deal with Supabase edge function limitations during local development.

## Features

- **Secure API Key Management**: All AI API keys are stored server-side in `.env.local`
- **Multiple AI Provider Support**: OpenAI, Anthropic (Claude), Google Gemini, ElevenLabs
- **Automatic Model Selection**: Intelligently routes requests to the best available model
- **Cost Tracking**: Monitors daily AI spend with configurable budgets
- **Health Monitoring**: Built-in health check endpoint for all AI services
- **Fallback Support**: Graceful degradation when API keys are not configured
- **CORS Enabled**: Works seamlessly with the Vite development server

## Setup

1. **Install dependencies**:
   ```bash
   cd services/ai-proxy
   npm install
   ```

2. **Configure API keys**:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local and add your actual API keys
   ```

3. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The server will start on `http://localhost:3001` by default.

## Configuration

Edit `.env.local` with your API keys:

```env
# Required for AI functionality
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Optional
ELEVENLABS_API_KEY=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_KEY=...

# Server settings
PORT=3001
DAILY_AI_BUDGET_CENTS=10000
```

## API Endpoints

### POST `/construction-assistant`
Main AI chat endpoint that mirrors the Supabase edge function API.

**Request body**:
```json
{
  "message": "What's the project status?",
  "project_id": "project-123",
  "task_type": "analysis",
  "enable_voice": false
}
```

### GET `/health-check`
Returns the health status of all configured AI services.

## Frontend Integration

The frontend automatically uses this proxy server in development mode. No configuration needed!

To force the use of Supabase edge functions in development:
```env
VITE_FORCE_SUPABASE=true
```

To use a different proxy URL:
```env
VITE_AI_PROXY_URL=http://localhost:3001
```

## Model Selection Logic

The server intelligently selects models based on:
- Task type (analysis, creative writing, summarization, etc.)
- Token count and context length
- Latency requirements
- Daily budget constraints
- Available API keys

## Cost Management

- Tracks daily AI spend in cents
- Automatically switches to cheaper models when approaching budget limits
- Configurable daily budget via `DAILY_AI_BUDGET_CENTS`

## Development Tips

1. **Testing without API keys**: The server provides intelligent fallback responses when no API keys are configured
2. **Debugging**: Check the console for detailed logs of model selection and API calls
3. **Performance**: The server uses in-memory caching for daily spend tracking

## Security Notes

- Never commit `.env.local` to version control
- The `.gitignore` file already excludes `.env.local`
- API keys are never exposed to the frontend
- All API calls are proxied through this server

## Troubleshooting

1. **"API key not configured"**: Make sure you've copied `.env.example` to `.env.local` and added your keys
2. **CORS errors**: Ensure the frontend is running on one of the allowed origins (localhost:5173, 3000, or 8080)
3. **Connection refused**: Make sure the proxy server is running on the expected port
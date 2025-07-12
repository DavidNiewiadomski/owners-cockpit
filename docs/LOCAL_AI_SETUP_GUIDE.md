# Local AI Development Setup Guide

This guide explains how to set up AI functionality for local development without relying on Supabase edge functions.

## Overview

The local AI proxy server allows you to:
- Use real AI API keys during development
- Avoid Supabase edge function limitations
- Test AI features locally with full functionality
- Switch between multiple AI providers seamlessly

## Quick Start

1. **Run the setup script**:
   ```bash
   npm run ai-proxy:setup
   ```

2. **Add your API keys** to `services/ai-proxy/.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GEMINI_API_KEY=...
   ```

3. **Start both servers**:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - AI Proxy
   npm run ai-proxy
   ```

That's it! The AI chat will now work with your real API keys.

## How It Works

1. **Development Mode Detection**: The frontend automatically detects when running in development mode
2. **Proxy Routing**: AI requests are routed to `http://localhost:3001` instead of Supabase
3. **Secure API Keys**: Your API keys stay on the server, never exposed to the browser
4. **Same API Interface**: The proxy mimics the Supabase edge function API exactly

## Configuration Options

### Environment Variables

In your main `.env` or `.env.local`:
```env
# Use a different proxy port
VITE_AI_PROXY_URL=http://localhost:3001

# Force Supabase even in development
VITE_FORCE_SUPABASE=true
```

### AI Provider Priority

The proxy automatically selects the best available model based on:
- Available API keys
- Task type (analysis, creative writing, etc.)
- Token count
- Budget constraints

### Daily Budget

Set a daily spending limit in `services/ai-proxy/.env.local`:
```env
DAILY_AI_BUDGET_CENTS=10000  # $100 daily limit
```

## Testing Without API Keys

The proxy includes intelligent fallback responses when no API keys are configured. This allows you to:
- Test the UI flow
- Debug integration issues
- Demo the application

## Monitoring

### Health Check
Visit http://localhost:3001/health-check to see the status of all AI services.

### Logs
The proxy logs all requests with:
- Selected model
- Response time
- Token usage
- Cost estimates

## Troubleshooting

### Common Issues

1. **"Cannot connect to proxy"**
   - Ensure the proxy is running: `npm run ai-proxy`
   - Check the port isn't already in use

2. **"API key not configured"**
   - Verify `.env.local` exists in `services/ai-proxy/`
   - Check API keys don't contain placeholder text

3. **CORS errors**
   - The proxy allows localhost:5173, 3000, and 8080
   - Ensure your frontend runs on one of these ports

### Debug Mode

Check the browser console for:
```
🤖 AI Service Configuration: {
  environment: 'development',
  useLocalProxy: true,
  localProxyUrl: 'http://localhost:3001'
}
```

## Production Deployment

In production, the system automatically uses Supabase edge functions. No changes needed!

## Advanced Usage

### Adding New AI Providers

1. Install the provider's SDK in `services/ai-proxy/package.json`
2. Add initialization in `routes/construction-assistant.js`
3. Update the model selection logic
4. Add health check in `routes/health-check.js`

### Custom Model Selection

Override the automatic model selection by passing `preferred_model` in the request:
```javascript
{
  message: "Analyze this data",
  preferred_model: "gpt-4o",
  // ... other parameters
}
```

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use read-only API keys** when possible
3. **Monitor usage** via provider dashboards
4. **Rotate keys regularly**
5. **Set reasonable budget limits**

## Next Steps

- Test the AI chat functionality
- Monitor token usage and costs
- Experiment with different models
- Provide feedback on model selection
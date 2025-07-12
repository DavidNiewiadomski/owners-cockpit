import express from 'express';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

const router = express.Router();

// Initialize AI clients
let openai = null;
let anthropic = null;
let gemini = null;

// Initialize clients based on available API keys
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-')) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your-')) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your-')) {
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Simple in-memory store for daily spend tracking
const dailySpend = new Map();

// Helper function to get or reset daily spend
function getDailySpend() {
  const today = new Date().toISOString().split('T')[0];
  if (!dailySpend.has(today)) {
    dailySpend.clear(); // Clear previous days
    dailySpend.set(today, 0);
  }
  return dailySpend.get(today);
}

function updateDailySpend(amount) {
  const today = new Date().toISOString().split('T')[0];
  const current = getDailySpend();
  dailySpend.set(today, current + amount);
}

// Cost estimation per 1k tokens
const modelCosts = {
  'gpt-4o': 1.5,
  'gpt-4o-mini': 0.15,
  'gpt-3.5-turbo': 0.05,
  'claude-3-5-sonnet-20241022': 1.5,
  'claude-3-haiku-20240307': 0.25,
  'gemini-1.5-pro': 1.25,
  'gemini-1.5-flash': 0.075
};

// Estimate token count (rough approximation)
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

// Select optimal model based on request parameters
function selectModel(tokenCount, taskType, latencyReq, budget) {
  const currentSpend = getDailySpend();
  const budgetRemaining = budget - currentSpend;
  const budgetUsedPercent = (currentSpend / budget) * 100;
  
  // Available models based on configured API keys
  const availableModels = [];
  if (openai) {
    availableModels.push('gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo');
  }
  if (anthropic) {
    availableModels.push('claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307');
  }
  if (gemini) {
    availableModels.push('gemini-1.5-pro', 'gemini-1.5-flash');
  }
  
  if (availableModels.length === 0) {
    return { model: 'fallback', provider: 'mock' };
  }
  
  // Budget conservation mode
  if (budgetUsedPercent >= 80) {
    const cheapModels = ['gpt-3.5-turbo', 'claude-3-haiku-20240307', 'gemini-1.5-flash', 'gpt-4o-mini'];
    const available = cheapModels.find(m => availableModels.includes(m));
    if (available) return { model: available, provider: getProvider(available) };
  }
  
  // Low latency requirements
  if (latencyReq === 'low') {
    const fastModels = ['gpt-3.5-turbo', 'claude-3-haiku-20240307', 'gpt-4o-mini'];
    const available = fastModels.find(m => availableModels.includes(m));
    if (available) return { model: available, provider: getProvider(available) };
  }
  
  // Default selection based on task type
  const taskPreferences = {
    'analysis': ['gpt-4o', 'claude-3-5-sonnet-20241022', 'gemini-1.5-pro'],
    'creative_writing': ['claude-3-5-sonnet-20241022', 'gpt-4o'],
    'summarization': tokenCount > 5000 ? ['claude-3-5-sonnet-20241022', 'gemini-1.5-pro'] : ['gpt-4o-mini', 'claude-3-haiku-20240307'],
    'translation': ['gemini-1.5-pro', 'gpt-4o'],
    'code_review': ['gpt-4o', 'claude-3-5-sonnet-20241022']
  };
  
  const preferred = taskPreferences[taskType] || ['gpt-4o', 'claude-3-5-sonnet-20241022'];
  const available = preferred.find(m => availableModels.includes(m)) || availableModels[0];
  
  return { model: available, provider: getProvider(available) };
}

function getProvider(model) {
  if (model.startsWith('gpt')) return 'openai';
  if (model.startsWith('claude')) return 'anthropic';
  if (model.startsWith('gemini')) return 'google';
  return 'unknown';
}

// Call AI providers
async function callOpenAI(content, model = 'gpt-4o') {
  if (!openai) throw new Error('OpenAI client not initialized');
  
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are Atlas, an expert construction management AI assistant.' },
      { role: 'user', content }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  return {
    content: completion.choices[0].message.content,
    usage: completion.usage,
    model,
    provider: 'openai'
  };
}

async function callAnthropic(content, model = 'claude-3-5-sonnet-20241022') {
  if (!anthropic) throw new Error('Anthropic client not initialized');
  
  const message = await anthropic.messages.create({
    model,
    max_tokens: 4000,
    temperature: 0.7,
    system: 'You are Atlas, an expert construction management AI assistant.',
    messages: [{ role: 'user', content }]
  });
  
  return {
    content: message.content[0].text,
    usage: message.usage,
    model,
    provider: 'anthropic'
  };
}

async function callGemini(content, model = 'gemini-1.5-pro') {
  if (!gemini) throw new Error('Gemini client not initialized');
  
  const genModel = gemini.getGenerativeModel({ model });
  const result = await genModel.generateContent(content);
  const response = await result.response;
  
  return {
    content: response.text(),
    usage: { total_tokens: estimateTokenCount(content) + estimateTokenCount(response.text()) },
    model,
    provider: 'google'
  };
}

// Fallback response for when no API keys are configured
function generateFallbackResponse(message) {
  const responses = {
    greeting: "Hello! I'm Atlas, your AI construction assistant. I'm currently running in demo mode. To enable full AI capabilities, please configure your API keys in the .env.local file.",
    status: "I'm running in demo mode. Your projects appear to be progressing well based on the sample data. To get real-time insights, please configure your AI API keys.",
    default: "I understand you're asking about your construction projects. This is a demo response. To enable real AI-powered insights, please set up your API keys in the local development environment."
  };
  
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return responses.greeting;
  } else if (lowerMessage.includes('status') || lowerMessage.includes('progress')) {
    return responses.status;
  }
  
  return responses.default;
}

// Main endpoint
router.post('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const {
      message,
      user_id = 'local_dev_user',
      project_id = 'local_project',
      conversation_id = `conv_${Date.now()}`,
      task_type = 'analysis',
      latency_requirement = 'medium',
      ai_budget = parseInt(process.env.DAILY_AI_BUDGET_CENTS || '10000'),
      enable_voice = false,
      context = {}
    } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    // Estimate tokens and select model
    const tokenCount = estimateTokenCount(message);
    const { model, provider } = selectModel(tokenCount, task_type, latency_requirement, ai_budget);
    
    let response = null;
    let error = null;
    
    // Try to call the selected AI provider
    try {
      if (provider === 'openai' && openai) {
        response = await callOpenAI(message, model);
      } else if (provider === 'anthropic' && anthropic) {
        response = await callAnthropic(message, model);
      } else if (provider === 'google' && gemini) {
        response = await callGemini(message, model);
      } else {
        // Fallback response
        response = {
          content: generateFallbackResponse(message),
          usage: { total_tokens: tokenCount },
          model: 'fallback',
          provider: 'mock'
        };
      }
    } catch (aiError) {
      console.error(`AI call failed for ${model}:`, aiError);
      error = aiError.message;
      
      // Try fallback
      response = {
        content: generateFallbackResponse(message),
        usage: { total_tokens: tokenCount },
        model: 'fallback',
        provider: 'mock'
      };
    }
    
    // Calculate cost and update spend
    const costPerToken = modelCosts[model] || 0.1;
    const estimatedCost = Math.round((response.usage.total_tokens / 1000) * costPerToken);
    updateDailySpend(estimatedCost);
    
    // Format response to match Supabase edge function format
    const result = {
      success: true,
      response: response.content,
      audio_url: enable_voice ? null : undefined, // Would implement voice synthesis here
      tool_results: [], // Would implement tool calling here
      conversation_id,
      model_info: {
        model_used: response.model,
        provider: response.provider,
        token_count: response.usage.total_tokens || tokenCount,
        estimated_cost_cents: estimatedCost,
        budget_used_percent: Math.round((getDailySpend() / ai_budget) * 100),
        final_model_used: response.model
      },
      memory_info: {
        total_messages: 1,
        total_tokens: response.usage.total_tokens || tokenCount,
        was_summarized: false
      },
      ui: {
        should_play_audio: false,
        show_tool_results: false,
        requires_user_action: false,
        streaming_complete: true
      },
      metadata: {
        timestamp: new Date().toISOString(),
        response_id: `resp_${Date.now()}`,
        execution_time_ms: Date.now() - startTime
      }
    };
    
    console.log(`✅ AI response generated in ${Date.now() - startTime}ms using ${response.model}`);
    res.json(result);
    
  } catch (error) {
    console.error('❌ Construction assistant error:', error);
    res.status(500).json({
      success: false,
      response: 'I apologize, but I encountered an error. Please try again.',
      error: error.message,
      metadata: {
        timestamp: new Date().toISOString(),
        response_id: `error_${Date.now()}`,
        execution_time_ms: Date.now() - startTime
      }
    });
  }
});

export { router as constructionAssistantRouter };
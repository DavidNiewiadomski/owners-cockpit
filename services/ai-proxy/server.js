import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { LLMRouter } from './llm-router.js';
import { ToolExecutor } from './tool-executor.js';
import { MemoryManager } from './memory-manager.js';
import { VoiceSynthesizer } from './voice-synthesizer.js';
import { ActionExecutor } from './action-executor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: join(__dirname, '../../.env.local') });

const app = express();
const PORT = process.env.AI_PROXY_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasAzure: !!process.env.AZURE_OPENAI_KEY,
      hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasElevenLabs: !!process.env.ELEVENLABS_API_KEY
    }
  });
});

// Get available voices
app.get('/api/voices', (req, res) => {
  const voiceSynthesizer = new VoiceSynthesizer();
  res.json({
    success: true,
    voices: voiceSynthesizer.getAvailableVoices()
  });
});

// Preview a voice
app.post('/api/voices/preview', async (req, res) => {
  try {
    const { voice_id, text } = req.body;
    const voiceSynthesizer = new VoiceSynthesizer();
    
    const audioUrl = await voiceSynthesizer.previewVoice(
      voice_id || 'sarah',
      text
    );
    
    res.json({
      success: true,
      audio_url: audioUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute platform actions
app.post('/api/actions/execute', async (req, res) => {
  try {
    const { action, user_id, project_id } = req.body;
    const actionExecutor = new ActionExecutor();
    
    const result = await actionExecutor.execute(
      action,
      user_id || 'system',
      project_id
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Parse natural language to actions
app.post('/api/actions/parse', async (req, res) => {
  try {
    const { text, context } = req.body;
    const actionExecutor = new ActionExecutor();
    
    const action = await actionExecutor.parseNaturalLanguageAction(text, context);
    
    res.json({
      success: true,
      action: action,
      requires_confirmation: action ? action.type !== 'navigate' : false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Main AI endpoint that mirrors Supabase edge function
app.post('/functions/v1/construction-assistant', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const {
      message,
      user_id = 'default_user',
      project_id = 'default_project',
      conversation_id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      task_type = 'analysis',
      latency_requirement = 'medium',
      ai_budget = 1000,
      enable_voice = false,
      voice_optimized = false,
      context = {},
      tools_enabled = true,
      require_approval = false
    } = req.body;

    console.log('🤖 AI Assistant Request:', {
      user_id,
      project_id,
      conversation_id,
      task_type,
      message_length: message?.length || 0
    });

    // Initialize services
    const llmRouter = new LLMRouter();
    const toolExecutor = new ToolExecutor();
    const memoryManager = new MemoryManager();
    const voiceSynthesizer = new VoiceSynthesizer();
    const actionExecutor = new ActionExecutor();

    // Step 1: Retrieve conversation memory
    console.log('📚 Retrieving conversation memory...');
    const memoryResult = await memoryManager.retrieve(user_id, project_id);
    
    // Step 2: Execute tools if enabled
    let toolResults = [];
    if (tools_enabled) {
      console.log('🔧 Executing tools to get project data...');
      toolResults = await toolExecutor.execute(message, project_id);
    }

    // Step 3: Build enhanced prompt
    const enhancedPrompt = buildPrompt(message, context, memoryResult.conversation_history, project_id, toolResults);

    // Step 4: Route to optimal LLM
    console.log('🧠 Routing to optimal LLM...');
    const llmResult = await llmRouter.route({
      content: enhancedPrompt,
      task_type,
      latency_requirement,
      ai_budget
    });

    // Step 5: Store conversation in memory
    console.log('💾 Storing conversation memory...');
    await memoryManager.store(user_id, project_id, message, llmResult.response);
    
    // Step 5.5: Check if AI response indicates an action should be performed
    let detectedAction = null;
    if (llmResult.response.toLowerCase().includes("i'll") && llmResult.response.toLowerCase().includes("for you")) {
      console.log('🎯 Detected potential action in AI response');
      detectedAction = await actionExecutor.parseNaturalLanguageAction(message, { projectId: project_id });
      
      if (detectedAction && require_approval === false) {
        console.log('🚀 Executing detected action:', detectedAction.type);
        const actionResult = await actionExecutor.execute(detectedAction, user_id, project_id);
        console.log('✅ Action result:', actionResult);
      }
    }

    // Step 6: Generate voice if enabled
    let audioUrl;
    if (enable_voice) {
      console.log('🎤 Generating voice synthesis...');
      try {
        // Get voice preference from request or use default
        const voiceId = req.body.voice_id || 'sarah';
        const voiceSettings = req.body.voice_settings || {};
        
        audioUrl = await voiceSynthesizer.synthesize(
          voice_optimized ? optimizeResponseForVoice(llmResult.response) : llmResult.response,
          voiceId,
          voiceSettings
        );
        
        if (audioUrl) {
          console.log('✅ Voice synthesis successful');
        } else {
          console.log('⚠️ Voice synthesis returned no audio');
        }
      } catch (voiceError) {
        console.error('❌ Voice synthesis error:', voiceError);
      }
    }

    // Prepare response
    const response = {
      success: true,
      response: llmResult.response,
      audio_url: audioUrl,
      tool_results: toolResults,
      conversation_id,
      model_info: {
        model_used: llmResult.model_info.final_model_used,
        provider: llmResult.model_info.provider,
        token_count: llmResult.model_info.token_count,
        estimated_cost_cents: llmResult.model_info.estimated_cost_cents,
        budget_used_percent: llmResult.model_info.budget_used_percent
      },
      memory_info: {
        total_messages: memoryResult.conversation_history.length + 2,
        total_tokens: llmResult.model_info.token_count,
        was_summarized: false
      },
      ui: {
        shouldPlayAudio: !!audioUrl,
        showToolResults: toolResults.length > 0,
        requiresUserAction: !!detectedAction && require_approval,
        streamingComplete: true
      },
      metadata: {
        timestamp: new Date().toISOString(),
        response_id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        execution_time_ms: Date.now() - startTime
      },
      detected_action: detectedAction
    };

    console.log('✅ AI Assistant Response:', {
      success: true,
      model: llmResult.model_info.final_model_used,
      provider: llmResult.model_info.provider,
      execution_time_ms: response.metadata.execution_time_ms
    });

    res.json(response);

  } catch (error) {
    console.error('❌ AI Assistant Error:', error);
    
    res.status(500).json({
      success: false,
      response: 'I apologize, but I encountered an error processing your request. Please try again.',
      error: error.message,
      metadata: {
        timestamp: new Date().toISOString(),
        response_id: `error_${Date.now()}`,
        execution_time_ms: Date.now() - startTime
      }
    });
  }
});

function buildPrompt(userMessage, context, conversationHistory, projectId, toolResults) {
  const recentConversation = conversationHistory.slice(-8).map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n');

  return `
You are Atlas, a construction expert. Talk like a knowledgeable colleague, not a formal assistant.

CRITICAL RULES:
- Give direct, concise answers - no fluff or over-explaining
- Talk naturally, like you're having a conversation at a job site
- Skip greetings, acknowledgments, and "I understand" phrases
- Get straight to the point
- If asked a simple question, give a simple answer
- Only elaborate if specifically asked for details

When performing actions, just say what you're doing: "Creating that task now" or "Sending the email"

CONVERSATION HISTORY:
${recentConversation}

PROJECT: ${projectId}
${toolResults.length > 0 ? `DATA: ${JSON.stringify(toolResults[0], null, 2)}` : ''}

USER: ${userMessage}

Answer directly and conversationally:`.trim();
}

function optimizeResponseForVoice(text) {
  // Remove markdown formatting for voice
  let optimized = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/`/g, '')
    .replace(/\n\n/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/•/g, ',')
    .replace(/[[\]]/g, '');
  
  // Add natural pauses
  optimized = optimized
    .replace(/([.!?])\s+/g, '$1 ... ')
    .replace(/:/g, ':,');
  
  return optimized;
}

app.listen(PORT, () => {
  console.log(`🚀 AI Proxy Server running on http://localhost:${PORT}`);
  console.log('📋 Environment check:', {
    OpenAI: !!process.env.OPENAI_API_KEY,
    Azure: !!process.env.AZURE_OPENAI_KEY,
    Anthropic: !!process.env.ANTHROPIC_API_KEY,
    Gemini: !!process.env.GEMINI_API_KEY
  });
});
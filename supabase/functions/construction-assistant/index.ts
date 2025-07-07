import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// AI router components
import { LLMRouter } from './llm-router.ts'
import { MemoryManager } from './memory-manager.ts'
import { ToolExecutor } from './tool-executor.ts'
import { ResponseFormatter } from './response-formatter.ts'
import { VoiceSynthesizer } from './voice-synthesizer.ts'

interface ConstructionAssistantRequest {
  message: string
  user_id?: string
  project_id?: string
  conversation_id?: string
  task_type?: 'email_draft' | 'policy_doc' | 'vision' | 'code_review' | 'translation' | 'summarization' | 'creative_writing' | 'analysis'
  latency_requirement?: 'low' | 'medium' | 'high'
  ai_budget?: number
  enable_voice?: boolean
  voice_optimized?: boolean
  context?: any
  tools_enabled?: boolean
  require_approval?: boolean
}

interface ConstructionAssistantResponse {
  success: boolean
  response: string
  audio_url?: string
  tool_results?: any[]
  conversation_id: string
  model_info: {
    model_used: string
    provider: string
    token_count: number
    estimated_cost_cents: number
    budget_used_percent: number
  }
  memory_info?: {
    total_messages: number
    total_tokens: number
    was_summarized: boolean
  }
  ui: {
    should_play_audio: boolean
    show_tool_results: boolean
    requires_user_action: boolean
    streaming_complete: boolean
  }
  metadata: {
    timestamp: string
    response_id: string
    execution_time_ms: number
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()

  try {
    // Initialize Supabase client  
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('🔧 Supabase initialization:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      urlPrefix: supabaseUrl?.substring(0, 20) || 'none'
    })

    // Parse request
    const requestData: ConstructionAssistantRequest = await req.json()
    
    // Validate required fields
    if (!requestData.message) {
      throw new Error('Message is required')
    }

    // Set defaults
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
      require_approval = true
    } = requestData

    console.log('🤖 Construction Assistant Request:', {
      user_id,
      project_id,
      conversation_id,
      task_type,
      message_length: message.length
    })

    // Initialize AI components
    const llmRouter = new LLMRouter(supabase)
    const memoryManager = new MemoryManager(supabase)
    const toolExecutor = new ToolExecutor(supabase)
    const responseFormatter = new ResponseFormatter()
    const voiceSynthesizer = new VoiceSynthesizer()

    // Step 1: Retrieve conversation memory
    console.log('📚 Retrieving conversation memory...')
    const memoryResult = await memoryManager.retrieve(user_id, project_id)
    
    // Step 2: Enhance message with context and memory
    const enhancedPrompt = await buildConstructionPrompt(
      message,
      context,
      memoryResult.conversation_history,
      project_id,
      supabase
    )

    // Step 3: Execute tools first to get current project data
    let toolResults: any[] = []
    if (tools_enabled) {
      console.log('🔧 Executing tools to get project data...')
      toolResults = await toolExecutor.analyzeAndExecute(
        message,
        '',
        project_id,
        user_id,
        require_approval
      )
    }
    
    // Step 4: Build enhanced prompt with tool results
    const finalPrompt = await buildConstructionPromptWithTools(
      message,
      context,
      memoryResult.conversation_history,
      project_id,
      toolResults,
      supabase
    )

    // Step 5: Route to optimal LLM based on requirements
    console.log('🧠 Routing to optimal LLM...')
    const llmResult = await llmRouter.route({
      content: finalPrompt,
      task_type,
      latency_requirement,
      ai_budget
    })

    // Step 5: Store conversation in memory
    console.log('💾 Storing conversation memory...')
    const memoryStoreResult = await memoryManager.store(
      user_id,
      project_id,
      message,
      llmResult.response
    )

    // Step 6: Generate voice if enabled
    let audioUrl: string | undefined
    if (enable_voice) {
      console.log('🎤 Generating voice synthesis...')
      try {
        audioUrl = await voiceSynthesizer.synthesize(
          voice_optimized ? responseFormatter.formatForSpeech(llmResult.response) : llmResult.response
        )
      } catch (voiceError) {
        console.warn('Voice synthesis failed:', voiceError)
      }
    }

    // Step 7: Format final response
    console.log('📄 Formatting response...')
    const formattedResponse = responseFormatter.format({
      aiResponse: llmResult.response,
      audioUrl,
      toolResults,
      memoryData: memoryStoreResult,
      isStreaming: false,
      voiceOptimized: voice_optimized,
      conversationId: conversation_id,
      userId: user_id
    })

    // Prepare final response
    const executionTime = Date.now() - startTime
    const response: ConstructionAssistantResponse = {
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
        total_messages: memoryStoreResult.total_messages,
        total_tokens: memoryStoreResult.total_tokens,
        was_summarized: memoryStoreResult.was_summarized
      },
      ui: formattedResponse.data.ui,
      metadata: {
        timestamp: new Date().toISOString(),
        response_id: formattedResponse.data.metadata.responseId,
        execution_time_ms: executionTime
      }
    }

    console.log('✅ Construction Assistant Response:', {
      success: true,
      model: llmResult.model_info.final_model_used,
      cost_cents: llmResult.model_info.estimated_cost_cents,
      execution_time_ms: executionTime,
      has_audio: !!audioUrl,
      tool_count: toolResults.length
    })

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Construction Assistant Error:', error)
    
    const errorResponse: Partial<ConstructionAssistantResponse> = {
      success: false,
      response: 'I apologize, but I encountered a technical issue. Please try again in a moment.',
      metadata: {
        timestamp: new Date().toISOString(),
        response_id: `error_${Date.now()}`,
        execution_time_ms: Date.now() - startTime
      }
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function buildConstructionPrompt(
  userMessage: string,
  context: any,
  conversationHistory: any[],
  projectId: string,
  supabase: any
): Promise<string> {
  // Get project context
  const { data: projectData } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  // Get recent project activity
  const { data: recentActivity } = await supabase
    .from('project_activities')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get current issues/risks
  const { data: openIssues } = await supabase
    .from('project_issues')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'open')
    .limit(3)

  // Build enhanced context
  const enhancedContext = {
    user_message: userMessage,
    project_context: projectData,
    recent_activity: recentActivity || [],
    open_issues: openIssues || [],
    dashboard_context: context,
    conversation_history: conversationHistory.slice(-10) // Last 10 messages for context
  }

  return `
You are Atlas, a construction management expert. Answer questions directly based on the real project data provided. Be conversational and specific.

PROJECT DATA:
${JSON.stringify(enhancedContext, null, 2)}

INSTRUCTIONS:
- Answer the user's question directly using the specific data shown above
- If asked about budget, use the exact numbers from project_financial_metrics
- If asked about progress, use the exact percentages from project_construction_metrics  
- If asked about timeline, use the actual dates from the project data
- Be conversational like talking to a colleague
- Don't give generic advice - analyze the actual data
- Keep responses focused and concise
- Only mention next steps if specifically asked

USER QUESTION: ${userMessage}

Answer directly based on the real data above.
  `.trim()
}

async function buildConstructionPromptWithTools(
  userMessage: string,
  context: any,
  conversationHistory: any[],
  projectId: string,
  toolResults: any[],
  supabase: any
): Promise<string> {
  // Get project context
  const { data: projectData } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  // Build conversation context
  const recentConversation = conversationHistory.slice(-8).map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n')

  // Build enhanced context with tool results
  const enhancedContext = {
    user_message: userMessage,
    project_context: projectData,
    live_project_data: toolResults.length > 0 ? toolResults[0] : null,
    dashboard_context: context,
    conversation_history: conversationHistory.slice(-5) // Last 5 messages for context
  }

  return `
You are Atlas, a highly experienced construction management expert with 20+ years in the industry. You have deep knowledge of construction processes, project management, safety protocols, building codes, scheduling, budgeting, and industry best practices.

You are having a natural conversation with a construction professional. Be conversational, helpful, and knowledgeable - like talking to a colleague who knows everything about construction.

CONVERSATION HISTORY:
${recentConversation}

CURRENT PROJECT CONTEXT:
${projectId === 'portfolio' ? 'Portfolio Overview - Multiple Projects' : `Project: ${projectData?.name || 'Unknown Project'}`}

LIVE PROJECT DATA (if available):
${enhancedContext.live_project_data ? JSON.stringify(enhancedContext.live_project_data, null, 2) : 'No specific project data retrieved for this question'}

INSTRUCTIONS:
- Answer naturally like a seasoned construction expert would in a casual conversation
- If you have specific project data above, use those EXACT numbers and analyze them
- For general construction questions, draw from your vast industry knowledge
- Give practical, actionable advice based on real-world experience
- Be friendly, conversational, and personable - not robotic or overly formal
- Reference conversation history when relevant to maintain flow
- Share insights, tips, and best practices from your years of experience
- If you don't have specific data, still provide valuable expert guidance
- Use appropriate industry terminology but explain complex concepts clearly
- Feel free to ask clarifying questions if helpful
- Give complete, thoughtful responses that demonstrate deep expertise

USER QUESTION: ${userMessage}

Respond as an expert construction professional would in a natural conversation, combining any specific project data with your extensive industry knowledge and experience.
  `.trim()
}

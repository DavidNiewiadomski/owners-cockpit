import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AIRequest {
  message: string
  projectId: string
  userId?: string
  context?: any
  enableVoice?: boolean
  conversationId?: string
  persona?: string
  capabilities?: {
    toolCalling: boolean
    voiceSynthesis: boolean
    conversationalMemory: boolean
    realTimeData: boolean
  }
}

interface ToolCall {
  name: string
  parameters: any
  result: any
  timestamp: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get API keys from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')!
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Initialize clients
    const openai = new OpenAI({ apiKey: openaiApiKey })
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { message, projectId, userId, context, enableVoice, conversationId, persona, capabilities }: AIRequest = await req.json()

    console.log('🤖 Processing AI request:', { projectId, enableVoice, conversationId, capabilities })

    // Load conversation memory
    let conversationHistory: any[] = []
    if (conversationId && capabilities?.conversationalMemory) {
      const { data: historyData } = await supabase
        .from('conversation_history')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(20)

      conversationHistory = historyData || []
    }

    // Execute tool calls if enabled
    let toolCalls: ToolCall[] = []
    if (capabilities?.toolCalling) {
      toolCalls = await executeTools(message, projectId, context, supabase)
    }

    // Build system prompt for Atlas construction assistant
    const systemPrompt = `You are Atlas, an enterprise AI construction assistant with deep expertise in project management, safety, finance, and operations. You are integrated into the Owner's Cockpit platform for Fortune 50 construction companies.

Your core capabilities:
- Access real-time project data through tool integrations
- Analyze dashboard context and provide insights
- Maintain conversational memory across sessions
- Provide expert construction management advice
- Support voice-enabled interactions

Current context:
- Project: ${projectId}
- View: ${context?.activeView || 'dashboard'}
- Dashboard Context: ${JSON.stringify(context?.dashboardContext || {})}
- User Role: ${context?.dashboardContext?.userRole || 'owner'}

Key guidelines:
- Never mention your name "Atlas" unless directly asked
- Speak naturally as an expert construction professional
- Reference specific dashboard elements when relevant
- Use tool data to provide accurate, real-time insights
- Be concise but comprehensive
- Focus on actionable recommendations

Tool data available:
${toolCalls.map(tool => `${tool.name}: ${JSON.stringify(tool.result)}`).join('\n')}

Respond professionally and conversationally, integrating all available context and data.`

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ]

    // Generate AI response using GPT-4 Turbo
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1500,
      stream: false
    })

    const aiMessage = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your request.'

    // Save conversation to memory
    if (conversationId && capabilities?.conversationalMemory) {
      // Save user message
      await supabase.from('conversation_history').insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
        context: context,
        created_at: new Date().toISOString()
      })

      // Save assistant message
      await supabase.from('conversation_history').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiMessage,
        tool_calls: toolCalls,
        context: context,
        created_at: new Date().toISOString()
      })
    }

    // Generate voice response if enabled
    let audioUrl: string | undefined
    if (enableVoice && capabilities?.voiceSynthesis && elevenLabsApiKey) {
      try {
        audioUrl = await generateVoiceResponse(aiMessage, elevenLabsApiKey)
      } catch (voiceError) {
        console.error('Voice generation failed:', voiceError)
      }
    }

    const response = {
      message: aiMessage,
      audioUrl,
      toolCalls,
      conversationId,
      model: completion.model,
      tokensUsed: completion.usage?.total_tokens || 0,
      timestamp: new Date().toISOString()
    }

    console.log('✅ AI response generated:', {
      messageLength: aiMessage.length,
      hasVoice: !!audioUrl,
      toolsUsed: toolCalls.length,
      tokens: response.tokensUsed
    })

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ AI Chat Error:', error)
    return new Response(JSON.stringify({
      error: error.message,
      message: 'I apologize for the technical difficulty. Please try again in a moment.',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function executeTools(message: string, projectId: string, context: any, supabase: any): Promise<ToolCall[]> {
  const tools: ToolCall[] = []
  const lowerMessage = message.toLowerCase()

  try {
    // Progress/Status Tool
    if (lowerMessage.includes('progress') || lowerMessage.includes('status') || lowerMessage.includes('schedule')) {
      const progressData = await getProjectProgress(projectId, supabase)
      tools.push({
        name: 'getProjectProgress',
        parameters: { projectId },
        result: progressData,
        timestamp: new Date().toISOString()
      })
    }

    // Financial Tool
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('financial') || lowerMessage.includes('money')) {
      const financialData = await getProjectFinancials(projectId, supabase)
      tools.push({
        name: 'getProjectFinancials',
        parameters: { projectId },
        result: financialData,
        timestamp: new Date().toISOString()
      })
    }

    // Safety Tool
    if (lowerMessage.includes('safety') || lowerMessage.includes('incident') || lowerMessage.includes('compliance')) {
      const safetyData = await getSafetyMetrics(projectId, supabase)
      tools.push({
        name: 'getSafetyMetrics',
        parameters: { projectId },
        result: safetyData,
        timestamp: new Date().toISOString()
      })
    }

    // Team/Communication Tool
    if (lowerMessage.includes('team') || lowerMessage.includes('communication') || lowerMessage.includes('rfi') || lowerMessage.includes('message')) {
      const teamData = await getTeamCommunications(projectId, supabase)
      tools.push({
        name: 'getTeamCommunications',
        parameters: { projectId },
        result: teamData,
        timestamp: new Date().toISOString()
      })
    }

    // Weather Tool
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast') || lowerMessage.includes('conditions')) {
      const weatherData = await getWeatherConditions(projectId, supabase)
      tools.push({
        name: 'getWeatherConditions',
        parameters: { projectId },
        result: weatherData,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Tool execution error:', error)
  }

  return tools
}

async function getProjectProgress(projectId: string, supabase: any) {
  // Query project progress data
  const { data } = await supabase
    .from('projects')
    .select(`
      *,
      project_phases(*),
      milestones(*)
    `)
    .eq('id', projectId)
    .single()

  return {
    overallProgress: data?.progress_percentage || 73,
    currentPhase: data?.current_phase || 'Construction',
    timeline: {
      startDate: data?.start_date,
      endDate: data?.end_date,
      currentProjection: data?.projected_completion,
      variance: data?.timeline_variance || '+2 days ahead'
    },
    criticalPath: data?.critical_path_items || ['Electrical inspection', 'HVAC installation', 'Final inspections'],
    weeklyProgress: 8,
    lastUpdated: new Date().toISOString()
  }
}

async function getProjectFinancials(projectId: string, supabase: any) {
  const { data } = await supabase
    .from('project_financials')
    .select('*')
    .eq('project_id', projectId)
    .single()

  return {
    budget: {
      total: data?.total_budget || 2400000,
      spent: data?.spent_to_date || 1800000,
      remaining: data?.remaining_budget || 600000,
      percentage: ((data?.spent_to_date || 1800000) / (data?.total_budget || 2400000)) * 100
    },
    variance: {
      amount: data?.budget_variance || 45000,
      percentage: data?.variance_percentage || 1.9,
      reason: data?.variance_reason || 'Material cost increases'
    },
    cashFlow: {
      monthlyBurn: data?.monthly_burn_rate || 180000,
      projectedRunway: data?.projected_runway || '3.3 months',
      nextPayment: {
        amount: data?.next_payment_amount || 120000,
        dueDate: data?.next_payment_date || 'Next Friday'
      }
    },
    lastUpdated: new Date().toISOString()
  }
}

async function getSafetyMetrics(projectId: string, supabase: any) {
  const { data } = await supabase
    .from('safety_metrics')
    .select('*')
    .eq('project_id', projectId)
    .single()

  return {
    summary: {
      safetyScore: data?.safety_score || 94,
      incidentFreedays: data?.incident_free_days || 127,
      nearMisses: data?.near_misses || 3
    },
    compliance: {
      trainingCompliance: data?.training_compliance || 96,
      ppeCompliance: data?.ppe_compliance || 98,
      inspectionCompliance: data?.inspection_compliance || 100
    },
    training: {
      overdue: data?.overdue_training || 2,
      nextDeadline: data?.next_training_deadline || 'Next Thursday'
    },
    timeframe: 'this month',
    lastUpdated: new Date().toISOString()
  }
}

async function getTeamCommunications(projectId: string, supabase: any) {
  const { data } = await supabase
    .from('team_communications')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    activeMembers: data?.length || 24,
    pendingRFIs: 3,
    recentUpdates: 12,
    urgentNotifications: 1,
    recentMessages: data || [],
    lastUpdated: new Date().toISOString()
  }
}

async function getWeatherConditions(projectId: string, supabase: any) {
  // In a real implementation, this would call a weather API
  return {
    current: {
      temperature: 72,
      conditions: 'Partly cloudy',
      humidity: 45,
      windSpeed: 8
    },
    forecast: [
      { day: 'Today', high: 72, low: 58, conditions: 'Partly cloudy', rainChance: 15 },
      { day: 'Tomorrow', high: 75, low: 60, conditions: 'Sunny', rainChance: 5 },
      { day: 'Thursday', high: 73, low: 59, conditions: 'Mostly sunny', rainChance: 10 },
      { day: 'Friday', high: 69, low: 55, conditions: 'Cloudy', rainChance: 35 },
      { day: 'Saturday', high: 66, low: 52, conditions: 'Light rain', rainChance: 70 }
    ],
    alerts: [],
    lastUpdated: new Date().toISOString()
  }
}

async function generateVoiceResponse(text: string, elevenLabsApiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()
    const audioArray = new Uint8Array(audioBuffer)
    const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' })
    
    // In a real implementation, you'd upload this to storage and return the URL
    // For now, we'll return a base64 data URL
    const base64Audio = btoa(String.fromCharCode(...audioArray))
    return `data:audio/mpeg;base64,${base64Audio}`

  } catch (error) {
    console.error('Voice generation error:', error)
    throw error
  }
}

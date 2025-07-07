// Adaptation from premium-ai-construction-assistant-p_OKC6bz3/response_formatter/entry.js
export class ResponseFormatter {
  
  formatForSpeech(text: string): string {
    if (!text) return text

    // Add natural pauses and optimize for speech
    return text
      // Add pauses after sentences
      .replace(/([.!?])\s+/g, '$1... ')
      // Add pauses after commas for better speech flow
      .replace(/,\s+/g, ', ... ')
      // Expand contractions for clearer speech
      .replace(/won't/g, 'will not')
      .replace(/can't/g, 'cannot')
      .replace(/n't/g, ' not')
      .replace(/'ll/g, ' will')
      .replace(/'re/g, ' are')
      .replace(/'ve/g, ' have')
      .replace(/'d/g, ' would')
      // Convert numbers to words for better speech
      .replace(/\b(\d+)\b/g, (match, num) => {
        const numbers: Record<string, string> = {
          '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
          '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
          '10': 'ten'
        }
        return numbers[num] || num
      })
  }

  private parseToolResults(results: any[]): any[] {
    if (!results || !Array.isArray(results)) return []

    return results.map(result => {
      try {
        const parsed = typeof result === 'string' ? JSON.parse(result) : result
        return {
          toolName: parsed.toolName || 'unknown',
          status: parsed.status || 'completed',
          result: parsed.result || null,
          error: parsed.error || null,
          requiresApproval: parsed.requiresApproval || false,
          approvalMessage: parsed.approvalMessage || null,
          executionTime: parsed.executionTime || null,
          metadata: parsed.metadata || {}
        }
      } catch (error) {
        return {
          toolName: 'unknown',
          status: 'error',
          result: null,
          error: `Failed to parse tool result: ${(error as Error).message}`,
          requiresApproval: false,
          approvalMessage: null,
          executionTime: null,
          metadata: {}
        }
      }
    })
  }

  private parseMemoryData(memoryData: any): any {
    if (!memoryData) return null

    try {
      return typeof memoryData === 'string' ? JSON.parse(memoryData) : memoryData
    } catch (error) {
      return {
        error: `Failed to parse memory data: ${(error as Error).message}`,
        raw: memoryData
      }
    }
  }

  private generateResponseMetadata(conversationId?: string, userId?: string): any {
    return {
      timestamp: new Date().toISOString(),
      conversationId: conversationId || null,
      userId: userId || null,
      responseId: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isStreaming: false,
      voiceOptimized: false,
      hasAudio: false,
      hasToolResults: false,
      hasMemoryData: false
    }
  }

  format(params: {
    aiResponse: string
    audioUrl?: string
    toolResults?: any[]
    memoryData?: any
    isStreaming?: boolean
    voiceOptimized?: boolean
    conversationId?: string
    userId?: string
  }): any {
    // Parse and format tool results
    const toolResults = this.parseToolResults(params.toolResults || [])

    // Parse memory data
    const memoryData = this.parseMemoryData(params.memoryData)

    // Format text for voice if needed
    const formattedText = params.voiceOptimized
      ? this.formatForSpeech(params.aiResponse)
      : params.aiResponse

    // Generate response metadata
    const metadata = this.generateResponseMetadata(params.conversationId, params.userId)
    metadata.isStreaming = params.isStreaming || false
    metadata.voiceOptimized = params.voiceOptimized || false
    metadata.hasAudio = !!params.audioUrl
    metadata.hasToolResults = toolResults.length > 0
    metadata.hasMemoryData = !!params.memoryData

    // Check if any tools require approval
    const pendingApprovals = toolResults.filter(result => result.requiresApproval)

    // Build the comprehensive response
    const response = {
      success: true,
      data: {
        // Core AI response
        text: formattedText,
        originalText: params.aiResponse,

        // Audio data
        audio: params.audioUrl ? {
          url: params.audioUrl,
          available: true
        } : {
          url: null,
          available: false
        },

        // Tool execution results
        tools: {
          results: toolResults,
          hasResults: toolResults.length > 0,
          pendingApprovals: pendingApprovals,
          hasPendingApprovals: pendingApprovals.length > 0,
          totalExecuted: toolResults.length,
          successfulExecutions: toolResults.filter(r => r.status === 'completed').length,
          failedExecutions: toolResults.filter(r => r.status === 'error').length
        },

        // Memory and conversation data
        memory: memoryData,

        // Response metadata
        metadata: metadata,

        // Frontend-specific formatting
        ui: {
          shouldPlayAudio: !!params.audioUrl && !!params.voiceOptimized,
          showToolResults: toolResults.length > 0,
          requiresUserAction: pendingApprovals.length > 0,
          streamingComplete: !params.isStreaming
        }
      },

      // Webhook response formatting for Next.js
      webhook: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Conversation-Id': params.conversationId || 'unknown',
          'X-Response-Id': metadata.responseId,
          'X-Has-Audio': params.audioUrl ? 'true' : 'false',
          'X-Has-Tools': toolResults.length > 0 ? 'true' : 'false',
          'X-Requires-Approval': pendingApprovals.length > 0 ? 'true' : 'false'
        }
      }
    }

    return response
  }
}

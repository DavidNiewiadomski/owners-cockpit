// Adaptation from premium-ai-construction-assistant-p_OKC6bz3/memory_management/entry.js
export class MemoryManager {
  private dataStore: any

  constructor(supabase: any) {
    this.dataStore = supabase
  }

  private async countTokens(text: string): Promise<number> {
    // Rough token estimation (OpenAI uses ~4 chars per token)
    return Math.ceil(text.length / 4)
  }

  private async summarizeText(text: string): Promise<string> {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key required for summarization')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a conversation summarizer. Summarize the following conversation history while preserving key context, important details, and the overall flow of the conversation. Keep the summary concise but comprehensive enough to maintain conversational continuity.'
          },
          {
            role: 'user',
            content: `Please summarize this conversation history:\n\n${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.choices[0].message.content
  }

  private async storeInMemory(key: string, data: any): Promise<void> {
    try {
      // Try to store in conversation_memory table
      await this.dataStore
        .from('conversation_memory')
        .upsert({
          key: key,
          value: JSON.stringify(data),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })
    } catch (error) {
      console.error('Error storing in conversation_memory:', error)
      // Fallback: create table structure if it doesn't exist
      await this.dataStore
        .from('data_store')
        .upsert({
          key: key,
          value: JSON.stringify(data),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })
    }
  }

  private async retrieveFromMemory(key: string): Promise<any> {
    try {
      const { data } = await this.dataStore
        .from('conversation_memory')
        .select('value')
        .eq('key', key)
        .single()

      return data?.value ? JSON.parse(data.value) : null
    } catch (error) {
      // Fallback to data_store table
      try {
        const { data } = await this.dataStore
          .from('data_store')
          .select('value')
          .eq('key', key)
          .single()

        return data?.value ? JSON.parse(data.value) : null
      } catch (fallbackError) {
        console.warn('No memory data found:', fallbackError)
        return null
      }
    }
  }

  async retrieve(userId: string, projectId: string): Promise<{
    key: string
    conversation_history: any[]
    total_messages: number
  }> {
    const memoryKey = `${userId}:${projectId}`
    
    // Retrieve conversation history
    const conversationHistory = await this.retrieveFromMemory(memoryKey)
    
    return {
      key: memoryKey,
      conversation_history: conversationHistory || [],
      total_messages: conversationHistory ? conversationHistory.length : 0
    }
  }

  async store(userId: string, projectId: string, userMessage: string, assistantMessage: string): Promise<{
    key: string
    stored: boolean
    total_messages: number
    total_tokens: number
    was_summarized: boolean
    conversation_history: any[]
  }> {
    const memoryKey = `${userId}:${projectId}`
    
    if (!assistantMessage) {
      throw new Error('Assistant message is required for store action')
    }
    
    // Retrieve existing conversation history
    let conversationHistory = await this.retrieveFromMemory(memoryKey) || []
    
    // Add new messages to history
    if (userMessage) {
      conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      })
    }
    
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date().toISOString()
    })
    
    // Calculate total tokens
    const fullText = conversationHistory.map((msg: any) => msg.content).join('\n')
    const totalTokens = await this.countTokens(fullText)
    
    let wasSummarized = false
    
    // If exceeding 15k tokens, summarize older chunks
    if (totalTokens > 15000) {
      // Keep recent messages (last 20% of conversation)
      const keepCount = Math.max(4, Math.floor(conversationHistory.length * 0.2))
      const recentMessages = conversationHistory.slice(-keepCount)
      const olderMessages = conversationHistory.slice(0, -keepCount)
      
      if (olderMessages.length > 0) {
        try {
          // Summarize older messages
          const olderText = olderMessages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
          const summary = await this.summarizeText(olderText)
          
          // Create new conversation history with summary + recent messages
          conversationHistory = [
            {
              role: 'system',
              content: `[Conversation Summary]: ${summary}`,
              timestamp: new Date().toISOString(),
              is_summary: true
            },
            ...recentMessages
          ]
          wasSummarized = true
        } catch (summaryError) {
          console.warn('Failed to summarize conversation, keeping full history:', summaryError)
        }
      }
    }
    
    // Store updated conversation history
    await this.storeInMemory(memoryKey, conversationHistory)
    
    const finalTokens = await this.countTokens(conversationHistory.map((msg: any) => msg.content).join('\n'))
    
    return {
      key: memoryKey,
      stored: true,
      total_messages: conversationHistory.length,
      total_tokens: finalTokens,
      was_summarized: wasSummarized,
      conversation_history: conversationHistory
    }
  }
}

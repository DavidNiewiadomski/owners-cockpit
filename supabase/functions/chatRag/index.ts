
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question, projectId } = await req.json()
    
    if (!question) {
      throw new Error('Question is required')
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Generate embedding for the question
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: question,
      }),
    })

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate embedding')
    }

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data[0].embedding

    // Search for relevant documents using the vector similarity function
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Search for similar content
    const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: 5,
      filter_project_id: projectId || null,
    })

    if (searchError) {
      console.error('Search error:', searchError)
    }

    // Create context from found documents
    const context = documents?.map(doc => doc.content).join('\n\n') || ''

    // Generate response using GPT-4
    const systemPrompt = `You are an AI assistant specialized in construction project management. You help project owners understand their data and make informed decisions.

Context from project documents:
${context}

If no relevant context is found, provide general construction project guidance based on best practices. Always be helpful and professional.`

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!chatResponse.ok) {
      throw new Error('Failed to generate response')
    }

    const chatData = await chatResponse.json()
    const answer = chatData.choices[0].message.content

    return new Response(
      JSON.stringify({
        answer,
        sources: documents || [],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in chatRag function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

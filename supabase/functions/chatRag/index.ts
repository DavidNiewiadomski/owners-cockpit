
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS utilities
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const corsResponse = () => new Response(null, { status: 200, headers: corsHeaders });

// Validation utilities
const validateChatRequest = (body: any) => {
  if (!body.question || typeof body.question !== 'string') {
    return { isValid: false, error: 'Question is required and must be a string' };
  }
  if (body.question.length > 2000) {
    return { isValid: false, error: 'Question is too long (max 2000 characters)' };
  }
  return { isValid: true };
};

// Embedding creation using Gemini
const createEmbedding = async (text: string, apiKey: string): Promise<number[]> => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/embedding-001',
      content: { parts: [{ text }] }
    })
  });
  
  const data = await response.json();
  return data.embedding.values;
};

// Document search
const searchDocuments = async (supabase: any, embedding: number[], projectId: string, matchCount: number) => {
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: matchCount,
    project_filter: projectId !== 'portfolio' ? projectId : null
  });
  
  if (error) {
    console.error('Document search error:', error);
    return [];
  }
  
  return data || [];
};

// Communication search
const searchCommunications = async (supabase: any, embedding: number[], projectId: string, matchCount: number) => {
  const { data, error } = await supabase.rpc('match_communications', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: matchCount,
    project_filter: projectId !== 'portfolio' ? projectId : null
  });
  
  if (error) {
    console.error('Communication search error:', error);
    return [];
  }
  
  return data || [];
};

// Project data retrieval
const getProjectData = async (supabase: any, projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (error) {
    console.error('Project data error:', error);
    return null;
  }
  
  return data;
};

// Portfolio data retrieval
const getPortfolioData = async (supabase: any) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .limit(10);
  
  if (error) {
    console.error('Portfolio data error:', error);
    return [];
  }
  
  return data || [];
};

// Prompt building
const buildPrompt = (options: any) => {
  const { question, documentChunks, communicationResults, projectData, context, enableActions } = options;
  
  let prompt = `You are an AI assistant for construction project management. Answer the following question based on the provided context.

Question: ${question}

`;
  
  if (documentChunks.length > 0) {
    prompt += `\nDocument Context:\n${documentChunks.map((chunk: any, i: number) => `[${i + 1}] ${chunk.content}`).join('\n\n')}\n`;
  }
  
  if (communicationResults.length > 0) {
    prompt += `\nCommunication Context:\n${communicationResults.map((comm: any, i: number) => 
      `[${i + 1}] ${comm.subject || 'No Subject'}: ${comm.body || ''}`
    ).join('\n\n')}\n`;
  }
  
  if (projectData) {
    prompt += `\nProject Context: ${JSON.stringify(projectData)}\n`;
  }
  
  if (enableActions) {
    prompt += `\nIf appropriate, suggest actionable items using the format [ACTION:description]. Available actions include teams messages, outlook emails, and calendar events.\n`;
  }
  
  prompt += `\nProvide a helpful, accurate response based on the available context. If you cannot answer based on the provided information, say so clearly.`;
  
  return prompt;
};

// Gemini response generation
const generateResponse = async (prompt: string, apiKey: string): Promise<string> => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    })
  });
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }
  
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { 
      question, 
      project_id, 
      conversation_id,
      search_only = false,
      include_communications = true,
      match_count = 12,
      context = {},
      enable_actions = false
    } = body;

    console.log('📝 Processing chat request:', { question, project_id, search_only, include_communications });

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create embedding for the question
    const questionEmbedding = await createEmbedding(question, geminiKey);

    // Search documents
    const documentChunks = await searchDocuments(supabase, questionEmbedding, project_id, match_count);

    // Search communications if requested
    let communicationResults = [];
    if (include_communications) {
      communicationResults = await searchCommunications(supabase, questionEmbedding, project_id, match_count);
    }

    // If this is a search-only request, return results immediately
    if (search_only) {
      return new Response(JSON.stringify({
        documents: documentChunks,
        communications: communicationResults
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get project or portfolio data
    let projectData;
    if (project_id === 'portfolio') {
      projectData = await getPortfolioData(supabase);
    } else {
      projectData = await getProjectData(supabase, project_id);
    }

    // Build prompt with context
    const prompt = buildPrompt({
      question,
      documentChunks,
      communicationResults,
      projectData,
      conversationId: conversation_id,
      context,
      enableActions: enable_actions
    });

    // Generate response
    const response = await generateResponse(prompt, geminiKey);

    // Parse actions from response if enabled
    let actions = [];
    if (enable_actions) {
      // Look for action markers in the response
      const actionMatches = response.match(/\[ACTION:(.*?)\]/g);
      if (actionMatches) {
        actions = actionMatches.map((match, index) => {
          const actionText = match.replace(/\[ACTION:|\]/g, '');
          return {
            id: `action_${index}`,
            type: actionText.includes('teams') ? 'teams_message' : 
                  actionText.includes('email') ? 'outlook_email' :
                  actionText.includes('calendar') ? 'calendar_event' : 'platform_action',
            description: actionText,
            status: 'pending' as const
          };
        });
      }
    }

    // Clean response of action markers
    const cleanResponse = response.replace(/\[ACTION:.*?\]/g, '').trim();

    // Build citations from both documents and communications
    const citations = [
      ...documentChunks.map(chunk => ({
        id: chunk.chunk_id,
        snippet: chunk.content.substring(0, 200) + '...',
        source: 'document',
        similarity: chunk.similarity
      })),
      ...communicationResults.map(comm => ({
        id: comm.id,
        snippet: `${comm.subject || 'No subject'}: ${(comm.body || '').substring(0, 200)}...`,
        source: 'communication',
        speaker: comm.speaker?.name || 'Unknown',
        timestamp: comm.message_ts,
        comm_type: comm.comm_type,
        provider: comm.provider,
        similarity: comm.similarity
      }))
    ];

    return new Response(JSON.stringify({
      answer: cleanResponse,
      citations,
      actions,
      usage: {
        total_tokens: cleanResponse.length // Simplified usage tracking
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat RAG error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

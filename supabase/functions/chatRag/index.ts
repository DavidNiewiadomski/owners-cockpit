
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsResponse, corsHeaders } from "./cors.ts";
import { validateChatRequest } from "./validation.ts";
import { createEmbedding } from "./embedding.ts";
import { searchDocuments } from "./vectorSearch.ts";
import { searchCommunications } from "./communicationsSearch.ts";
import { buildPrompt } from "./promptBuilder.ts";
import { generateResponse } from "./geminiChat.ts";
import { getProjectData } from "./projectData.ts";

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
      match_count = 12
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
    const documentChunks = await searchDocuments(supabase, questionEmbedding, project_id);

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

    // Get additional project data
    const projectData = await getProjectData(supabase, project_id);

    // Build prompt with context
    const prompt = buildPrompt({
      question,
      documentChunks,
      communicationResults,
      projectData,
      conversationId: conversation_id
    });

    // Generate response
    const response = await generateResponse(prompt, geminiKey);

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
      answer: response,
      citations,
      usage: {
        total_tokens: response.length // Simplified usage tracking
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

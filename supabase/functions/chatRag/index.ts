
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { ChatRequest, ChatResponse } from './types.ts';
import { corsHeaders, handleCorsRequest, createErrorResponse, createSuccessResponse } from './cors.ts';
import { validateRequest, validateEnvironment } from './validation.ts';
import { createEmbedding } from './embedding.ts';
import { searchDocuments } from './vectorSearch.ts';
import { getProjectContext } from './projectData.ts';
import { buildSystemPrompt, formatContextChunks } from './promptBuilder.ts';
import { generateChatResponse, prepareCitations } from './geminiChat.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  if (req.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  try {
    // Validate environment and request
    const geminiKey = validateEnvironment();
    const requestBody = await req.json();
    const { project_id, question, conversation_id }: ChatRequest = validateRequest(requestBody);

    console.log(`Processing chat question for project: ${project_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create embedding for the question
    const questionEmbedding = await createEmbedding(question, geminiKey);

    // Search for relevant documents
    const chunks = await searchDocuments(supabase, questionEmbedding, project_id);

    // Get project context
    const projectContext = await getProjectContext(supabase, project_id);

    // Build system prompt
    const contextChunks = formatContextChunks(chunks);
    const systemPrompt = buildSystemPrompt(projectContext, contextChunks);

    // Generate chat response
    const { answer, usage } = await generateChatResponse(systemPrompt, question, geminiKey);

    // Prepare citations
    const citations = prepareCitations(chunks);

    const response: ChatResponse = {
      answer,
      citations,
      usage
    };

    console.log(`Chat completed. Tokens used: ${response.usage.total_tokens}`);

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Chat RAG error:', error);
    return createErrorResponse(error.message);
  }
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ChatRequest {
  project_id: string;
  question: string;
  conversation_id?: string;
}

interface Citation {
  id: string;
  snippet: string;
}

interface ChatResponse {
  answer: string;
  citations: Citation[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiKey) {
    console.error('GEMINI_API_KEY environment variable is missing');
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY environment variable is required' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { project_id, question, conversation_id }: ChatRequest = await req.json();

    if (!project_id || !question) {
      return new Response(JSON.stringify({ error: 'project_id and question are required' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing chat question for project: ${project_id}`);

    // Step 1: Embed the question using Gemini
    console.log('Creating embedding for question...');
    const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text: question }]
        }
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('Gemini embedding API error:', errorText);
      throw new Error(`Embedding API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const questionEmbedding = embeddingData.embedding.values;

    // Step 2: Similarity search in vector_index
    console.log('Searching for relevant documents...');
    const { data: vectorResults, error: vectorError } = await supabase.rpc('match_documents', {
      query_embedding: questionEmbedding,
      match_count: 12,
      filter_project_id: project_id
    });

    if (vectorError) {
      console.error('Vector search error:', vectorError);
    }

    const chunks = vectorResults || [];
    console.log(`Found ${chunks.length} relevant chunks`);

    // Step 3: Quick metrics SQL for context
    const { data: projectData } = await supabase
      .from('projects')
      .select('name, description, status, start_date, end_date')
      .eq('id', project_id)
      .single();

    const { data: taskStats } = await supabase
      .from('tasks')
      .select('status')
      .eq('project_id', project_id);

    const { data: budgetStats } = await supabase
      .from('budget_items')
      .select('budgeted_amount, actual_amount')
      .eq('project_id', project_id);

    // Compile project context
    const taskSummary = taskStats?.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const budgetSummary = budgetStats?.reduce((acc, item) => {
      acc.budgeted += item.budgeted_amount || 0;
      acc.actual += item.actual_amount || 0;
      return acc;
    }, { budgeted: 0, actual: 0 }) || { budgeted: 0, actual: 0 };

    // Step 4: Compose system prompt with injected chunks
    const contextChunks = chunks.map((chunk, index) => 
      `[Document ${index + 1}]: ${chunk.content}`
    ).join('\n\n');

    const systemPrompt = `You are an AI assistant for the Owners Cockpit construction management platform. 
You help project owners understand their construction projects by analyzing documents, schedules, budgets, and other project data.

PROJECT CONTEXT:
- Project: ${projectData?.name || 'Unknown'}
- Status: ${projectData?.status || 'Unknown'}
- Description: ${projectData?.description || 'No description'}
- Tasks Summary: ${JSON.stringify(taskSummary)}
- Budget Summary: Budgeted: $${budgetSummary.budgeted.toLocaleString()}, Actual: $${budgetSummary.actual.toLocaleString()}

RELEVANT DOCUMENTS:
${contextChunks}

Instructions:
- Answer based on the provided project context and documents
- Always cite specific documents when referencing information
- If information is not available in the context, clearly state that
- Be concise but thorough
- Focus on actionable insights for project owners
- Use professional construction industry terminology`;

    // Step 5: Call Gemini
    console.log('Calling Gemini chat completion...');
    const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt + '\n\nUser question: ' + question }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error('Gemini chat API error:', errorText);
      throw new Error(`Chat API error: ${chatResponse.statusText}`);
    }

    const chatData = await chatResponse.json();
    const answer = chatData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    // Step 6: Prepare citations
    const citations: Citation[] = chunks.slice(0, 5).map((chunk, index) => ({
      id: chunk.chunk_id,
      snippet: chunk.content.substring(0, 150) + '...'
    }));

    const response: ChatResponse = {
      answer,
      citations,
      usage: {
        prompt_tokens: chatData.usageMetadata?.promptTokenCount || 0,
        completion_tokens: chatData.usageMetadata?.candidatesTokenCount || 0,
        total_tokens: chatData.usageMetadata?.totalTokenCount || 0,
      }
    };

    console.log(`Chat completed. Tokens used: ${response.usage.total_tokens}`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat RAG error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

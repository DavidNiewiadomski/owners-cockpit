
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

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const openaiKey = Deno.env.get('OPENAI_KEY');
  if (!openaiKey) {
    return new Response('OPENAI_KEY environment variable is required', { status: 400 });
  }

  try {
    const { project_id, question, conversation_id }: ChatRequest = await req.json();

    if (!project_id || !question) {
      return new Response('project_id and question are required', { status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing chat question for project: ${project_id}`);

    // Step 1: Embed the question
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-large',
        input: question,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`Embedding API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const questionEmbedding = embeddingData.data[0].embedding;

    // Step 2: Similarity search in vector_index
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

    // Step 5: Call GPT-4
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!chatResponse.ok) {
      throw new Error(`Chat API error: ${chatResponse.statusText}`);
    }

    const chatData = await chatResponse.json();
    const answer = chatData.choices[0].message.content;

    // Step 6: Prepare citations
    const citations: Citation[] = chunks.slice(0, 5).map((chunk, index) => ({
      id: chunk.chunk_id,
      snippet: chunk.content.substring(0, 150) + '...'
    }));

    const response: ChatResponse = {
      answer,
      citations,
      usage: {
        prompt_tokens: chatData.usage?.prompt_tokens || 0,
        completion_tokens: chatData.usage?.completion_tokens || 0,
        total_tokens: chatData.usage?.total_tokens || 0,
      }
    };

    console.log(`Chat completed. Tokens used: ${response.usage.total_tokens}`);

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat RAG error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

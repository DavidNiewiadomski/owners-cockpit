import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Using service role key for admin operations
    );

    // Fetch all clauses without embeddings
    const { data: clauses, error: fetchError } = await supabaseClient
      .from('rfp_clause_library')
      .select('id, title, content')
      .is('embedding', null);

    if (fetchError) {
      throw new Error(`Failed to fetch clauses: ${fetchError.message}`);
    }

    if (!clauses || clauses.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No clauses found without embeddings', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let processed = 0;
    let errors = 0;

    for (const clause of clauses) {
      try {
        // Combine title and content for embedding
        const textToEmbed = `${clause.title}\n\n${clause.content}`;
        
        // Generate embedding
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: textToEmbed,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Update the clause with the embedding
        const { error: updateError } = await supabaseClient
          .from('rfp_clause_library')
          .update({ embedding })
          .eq('id', clause.id);

        if (updateError) {
          console.error(`Failed to update clause ${clause.id}:`, updateError);
          errors++;
        } else {
          processed++;
          console.log(`Processed clause ${clause.id}: ${clause.title}`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing clause ${clause.id}:`, error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Embedding generation completed',
        processed,
        errors,
        total: clauses.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate embeddings error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

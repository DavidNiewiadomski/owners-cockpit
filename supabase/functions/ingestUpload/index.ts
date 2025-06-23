
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
    const formData = await req.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('project_id') as string
    const docType = formData.get('doc_type') as string || 'other'

    if (!file || !projectId) {
      throw new Error('File and project_id are required')
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Read file content
    const fileBuffer = await file.arrayBuffer()
    const fileContent = new TextDecoder().decode(fileBuffer)

    // Store document in database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        project_id: projectId,
        file_size: file.size,
        mime_type: file.type,
        doc_type: docType,
        processed: false,
      })
      .select()
      .single()

    if (docError) {
      throw new Error(`Failed to store document: ${docError.message}`)
    }

    // Extract text content (simplified - in production you'd use proper PDF/image processing)
    let textContent = fileContent
    if (file.type === 'application/pdf') {
      // For PDFs, you'd use a proper PDF parser
      textContent = fileContent.substring(0, 10000) // Simplified
    }

    // Split text into chunks
    const chunkSize = 1000
    const chunks = []
    for (let i = 0; i < textContent.length; i += chunkSize) {
      chunks.push(textContent.slice(i, i + chunkSize))
    }

    // Generate embeddings and store chunks
    let chunksProcessed = 0
    for (const chunk of chunks.slice(0, 10)) { // Limit to first 10 chunks
      try {
        // Generate embedding
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: chunk,
          }),
        })

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json()
          const embedding = embeddingData.data[0].embedding

          // Store in vector index
          await supabase
            .from('vector_index')
            .insert({
              project_id: projectId,
              doc_id: document.id,
              content: chunk,
              embedding: JSON.stringify(embedding),
              metadata: {
                file_name: file.name,
                chunk_index: chunksProcessed,
              },
            })

          chunksProcessed++
        }
      } catch (error) {
        console.error('Error processing chunk:', error)
      }
    }

    // Mark document as processed
    await supabase
      .from('documents')
      .update({ processed: true })
      .eq('id', document.id)

    return new Response(
      JSON.stringify({
        success: true,
        document_id: document.id,
        chunks_processed: chunksProcessed,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in ingestUpload function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

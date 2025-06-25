
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.20.1";

// Import chunking utility (in Edge Function context, we'll inline a simplified version)
interface TextChunk {
  content: string;
  startIndex: number;
  endIndex: number;
  estimatedTokens: number;
}

function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

function chunkText(text: string, maxTokens: number = 500): TextChunk[] {
  if (!text.trim()) return [];
  
  const chunks: TextChunk[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  let chunkStartIndex = 0;
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim() + '.';
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
    const estimatedTokens = estimateTokenCount(potentialChunk);
    
    if (estimatedTokens > maxTokens && currentChunk) {
      chunks.push({
        content: currentChunk.trim(),
        startIndex: chunkStartIndex,
        endIndex: chunkStartIndex + currentChunk.length,
        estimatedTokens: estimateTokenCount(currentChunk)
      });
      
      currentChunk = sentence;
      chunkStartIndex = chunks[chunks.length - 1].endIndex;
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      startIndex: chunkStartIndex,
      endIndex: chunkStartIndex + currentChunk.length,
      estimatedTokens: estimateTokenCount(currentChunk)
    });
  }
  
  return chunks;
}

interface _UploadRequest {
  project_id: string;
  file: File;
  doc_type?: string;
}

interface ProcessingResult {
  chunks_saved: number;
  doc_id: string;
  file_path: string;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Environment checks
    const openaiKey = Deno.env.get('OPENAI_KEY');
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_KEY environment variable not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const openai = new OpenAI({ apiKey: openaiKey });

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('project_id') as string;
    const docType = formData.get('doc_type') as string || 'other';

    if (!file || !projectId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, project_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const uniqueId = crypto.randomUUID();
    const fileName = `${uniqueId}.${fileExtension}`;
    const filePath = `docs/${projectId}/${fileName}`;

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: _uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file to storage' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert document record
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        project_id: projectId,
        title: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        doc_type: docType,
        source: 'upload',
        external_id: uniqueId
      })
      .select('id')
      .single();

    if (docError) {
      console.error('Document insert error:', docError);
      return new Response(
        JSON.stringify({ error: 'Failed to create document record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const docId = docData.id;
    let extractedText = '';

    // Process different file types
    if (file.type === 'application/pdf') {
      // For PDF processing, we'll use a simplified approach
      // In production, you'd use pdf-lib or similar
      extractedText = `[PDF content extraction not implemented in demo - would extract text from ${file.name}]`;
      
      // TODO: Implement PDF text extraction
      // import { PDFDocument } from 'pdf-lib';
      // const pdfDoc = await PDFDocument.load(fileBuffer);
      // extractedText = await extractTextFromPDF(pdfDoc);
      
    } else if (file.type.startsWith('image/')) {
      // For image processing, we'll use OpenAI Vision
      try {
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract and describe all text visible in this construction-related image. Include any measurements, specifications, or technical details."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${file.type};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        });

        extractedText = visionResponse.choices[0]?.message?.content || '';
        
        // TODO: Also implement Tesseract OCR as fallback
        // extractedText += await runTesseractOCR(fileBuffer);
        
      } catch (visionError) {
        console.error('Vision API error:', visionError);
        extractedText = `[Image processing failed for ${file.name}]`;
      }
    } else {
      extractedText = `[Unsupported file type: ${file.type}]`;
    }

    // Chunk the extracted text
    const chunks = chunkText(extractedText, 500);
    let chunksInserted = 0;

    // Generate embeddings and insert chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        // Generate embedding
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-large",
          input: chunk.content
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Insert into vector_index
        const { error: vectorError } = await supabase
          .from('vector_index')
          .insert({
            project_id: projectId,
            doc_id: docId,
            content: chunk.content,
            embedding: embedding,
            metadata: {
              page: 1, // TODO: Track actual page numbers for PDFs
              file_path: filePath,
              doc_type: docType,
              chunk_index: i,
              estimated_tokens: chunk.estimatedTokens
            }
          });

        if (vectorError) {
          console.error(`Chunk ${i} insert error:`, vectorError);
        } else {
          chunksInserted++;
        }

      } catch (embeddingError) {
        console.error(`Embedding error for chunk ${i}:`, embeddingError);
      }
    }

    // Update document as processed
    await supabase
      .from('documents')
      .update({ processed: true })
      .eq('id', docId);

    // Log integration success
    await supabase
      .from('integration_logs')
      .insert({
        integration_type: 'document_upload',
        status: 'completed',
        external_id: uniqueId,
        metadata: {
          file_name: file.name,
          file_size: file.size,
          chunks_created: chunksInserted,
          project_id: projectId
        }
      });

    const result: ProcessingResult = {
      chunks_saved: chunksInserted,
      doc_id: docId,
      file_path: filePath
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Document processing error:', error);
    
    // Log integration failure
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!
      );
      
      await supabase
        .from('integration_logs')
        .insert({
          integration_type: 'document_upload',
          status: 'failed',
          metadata: {
            error: error.message,
            timestamp: new Date().toISOString()
          }
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error during document processing' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

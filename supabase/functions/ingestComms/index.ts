
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.20.1";

interface _TeamsWebhookPayload {
  subscriptionId: string;
  changeType: string;
  resource: string;
  resourceData: {
    id: string;
    '@odata.type': string;
    '@odata.id': string;
  };
  subscriptionExpirationDateTime: string;
  clientState?: string;
  tenantId: string;
}

interface OutlookDeltaPayload {
  '@odata.context': string;
  '@odata.deltaLink'?: string;
  value: Array<{
    id: string;
    subject: string;
    bodyPreview: string;
    body: {
      contentType: string;
      content: string;
    };
    from: {
      emailAddress: {
        name: string;
        address: string;
      };
    };
    toRecipients: Array<{
      emailAddress: {
        name: string;
        address: string;
      };
    }>;
    receivedDateTime: string;
    webLink: string;
    conversationId: string;
  }>;
}

interface CommunicationRecord {
  project_id: string;
  provider: 'teams' | 'outlook' | 'zoom' | 'google_meet';
  comm_type: 'email' | 'chat_message' | 'meeting_recording' | 'meeting_transcript' | 'channel_message';
  subject?: string;
  body?: string;
  speaker: unknown;
  message_ts: string;
  url?: string;
  participants: string[];
  thread_id?: string;
  external_id: string;
  metadata: unknown;
}

serve(async (req) => {
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const openaiKey = Deno.env.get('OPENAI_KEY');
    let openai: OpenAI | null = null;
    if (openaiKey) {
      openai = new OpenAI({ apiKey: openaiKey });
    }

    const payload = await req.json();
    const _authHeader = req.headers.get('authorization');
    
    // Extract project_id from auth context or payload
    const projectId = payload.project_id || req.headers.get('x-project-id');
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'Project ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const communicationRecords: CommunicationRecord[] = [];

    // Handle Teams webhook
    if (payload.subscriptionId && payload.resource) {
      console.log('Processing Teams webhook:', payload);
      
      // This is a Teams webhook notification
      // In a real implementation, you would:
      // 1. Validate the webhook signature
      // 2. Use the Graph API to fetch the actual message content
      // 3. Parse and normalize the data
      
      // For now, we'll create a placeholder record
      communicationRecords.push({
        project_id: projectId,
        provider: 'teams',
        comm_type: 'chat_message',
        subject: 'Teams Message',
        body: 'Message content would be fetched from Graph API',
        speaker: { id: 'teams-user', name: 'Teams User' },
        message_ts: new Date().toISOString(),
        participants: [],
        external_id: payload.resourceData.id,
        metadata: payload
      });
    }
    
    // Handle Outlook Delta
    else if (payload['@odata.context'] && payload.value) {
      console.log('Processing Outlook delta:', payload);
      
      const outlookPayload = payload as OutlookDeltaPayload;
      
      for (const email of outlookPayload.value) {
        communicationRecords.push({
          project_id: projectId,
          provider: 'outlook',
          comm_type: 'email',
          subject: email.subject,
          body: email.body?.content || email.bodyPreview,
          speaker: {
            id: email.from.emailAddress.address,
            name: email.from.emailAddress.name,
            email: email.from.emailAddress.address
          },
          message_ts: email.receivedDateTime,
          url: email.webLink,
          participants: email.toRecipients.map(r => r.emailAddress.address),
          thread_id: email.conversationId,
          external_id: email.id,
          metadata: {
            toRecipients: email.toRecipients,
            bodyType: email.body?.contentType
          }
        });
      }
    }
    
    // Handle manual communication submission
    else if (payload.comm_type) {
      console.log('Processing manual communication:', payload);
      
      communicationRecords.push({
        project_id: projectId,
        provider: payload.provider || 'manual',
        comm_type: payload.comm_type,
        subject: payload.subject,
        body: payload.body,
        speaker: payload.speaker || {},
        message_ts: payload.message_ts || new Date().toISOString(),
        url: payload.url,
        participants: payload.participants || [],
        thread_id: payload.thread_id,
        external_id: payload.external_id || crypto.randomUUID(),
        metadata: payload.metadata || {}
      });
    }

    // Insert communications and generate embeddings
    const insertedRecords = [];
    
    for (const record of communicationRecords) {
      try {
        // Generate embedding if OpenAI is available and there's content
        let embedding = null;
        if (openai && (record.body || record.subject)) {
          const textToEmbed = `${record.subject || ''} ${record.body || ''}`.trim();
          if (textToEmbed.length > 0) {
            const embeddingResponse = await openai.embeddings.create({
              model: "text-embedding-3-large",
              input: textToEmbed
            });
            embedding = embeddingResponse.data[0].embedding;
          }
        }

        // Insert communication record
        const { data, error } = await supabase
          .from('communications')
          .insert({
            ...record,
            embedding
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting communication:', error);
          continue;
        }

        insertedRecords.push(data);

        // If this is a meeting recording, trigger transcription
        if (record.comm_type === 'meeting_recording' && record.url) {
          console.log('Meeting recording detected, would trigger transcription queue');
          // In a real implementation, you would:
          // 1. Download the recording from the URL
          // 2. Upload to storage bucket
          // 3. Queue for transcription using Whisper API
          // 4. Create a follow-up communication record with the transcript
        }

      } catch (insertError) {
        console.error('Error processing communication record:', insertError);
      }
    }

    // Log the ingestion
    await supabase
      .from('integration_logs')
      .insert({
        project_id: projectId,
        operation: 'ingest_communications',
        source: 'webhook',
        status: 'completed',
        records_processed: insertedRecords.length,
        metadata: {
          webhook_type: payload.subscriptionId ? 'teams' : payload['@odata.context'] ? 'outlook' : 'manual',
          records_inserted: insertedRecords.length
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        records_processed: insertedRecords.length,
        records: insertedRecords
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Communication ingestion error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during communication ingestion',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

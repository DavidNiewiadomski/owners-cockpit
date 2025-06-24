
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    const { thread_id, prompt, project_id, user_id } = await req.json();

    if (!thread_id || !prompt || !project_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's Outlook token
    const { data: tokenData, error: tokenError } = await supabase
      .from('integration_tokens')
      .select('*')
      .eq('user_id', user_id)
      .eq('project_id', project_id)
      .eq('provider', 'outlook')
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: 'Outlook integration not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get email thread from Microsoft Graph
    const emailResponse = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${thread_id}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    if (!emailResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch email thread' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailData = await emailResponse.json();

    // Get related communications from our database for context
    const { data: communications } = await supabase
      .from('communications')
      .select('*')
      .eq('project_id', project_id)
      .eq('thread_id', emailData.conversationId)
      .order('message_ts', { ascending: true });

    // Build context for AI
    const emailContext = `
Original Email:
Subject: ${emailData.subject}
From: ${emailData.from?.emailAddress?.name} <${emailData.from?.emailAddress?.address}>
Date: ${emailData.receivedDateTime}
Body: ${emailData.body?.content?.replace(/<[^>]*>/g, '') || emailData.bodyPreview}

${communications?.length ? `
Related Communications:
${communications.map(comm => `
- ${comm.comm_type}: ${comm.subject || 'No subject'}
- From: ${comm.speaker?.name || 'Unknown'}
- Date: ${comm.message_ts}
- Content: ${comm.body?.substring(0, 200)}...
`).join('\n')}
` : ''}
`;

    // Generate AI reply
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant helping to draft professional email replies for construction project communication. 
          
          Context: You have access to the email thread and related project communications. 
          
          Guidelines:
          - Keep replies professional and concise
          - Reference specific details from the email context when relevant
          - If the email is about construction matters, use appropriate industry terminology
          - Always maintain a helpful and collaborative tone
          - Include a proper email signature placeholder [SIGNATURE]
          
          Generate only the email body content, not the subject line or headers.`
        },
        {
          role: "user",
          content: `Please draft a reply to this email based on the following context and user prompt:

${emailContext}

User's prompt/instructions: ${prompt}

Please draft an appropriate reply.`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const draftReply = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({
        draft: draftReply,
        original_subject: emailData.subject,
        thread_id: thread_id,
        conversation_id: emailData.conversationId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Draft reply error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

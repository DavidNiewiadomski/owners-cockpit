
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
    const payload = await req.json();

    console.log('Teams bot webhook received:', payload);

    // Handle Teams message webhook
    if (payload.type === 'message' && payload.text) {
      const messageText = payload.text;
      const teamId = payload.channelData?.team?.id;
      const channelId = payload.channelData?.channel?.id;
      const userId = payload.from?.id;
      const userName = payload.from?.name;

      // Check if message mentions the bot (@AI)
      if (!messageText.includes('@AI')) {
        return new Response(JSON.stringify({ status: 'ignored' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Extract the question/prompt
      const prompt = messageText.replace(/@AI\s*/gi, '').trim();

      if (!prompt) {
        return new Response(JSON.stringify({ status: 'no_prompt' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get project context if available
      let projectContext = '';
      const projectId = payload.channelData?.project_id;
      
      if (projectId) {
        // Get recent communications for context
        const { data: communications } = await supabase
          .from('communications')
          .select('*')
          .eq('project_id', projectId)
          .order('message_ts', { ascending: false })
          .limit(5);

        if (communications?.length) {
          projectContext = `Recent project communications:
${communications.map(comm => `
- ${comm.comm_type}: ${comm.subject || 'No subject'}
- From: ${comm.speaker?.name || 'Unknown'}
- Content: ${comm.body?.substring(0, 150)}...
`).join('\n')}`;
        }
      }

      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for construction project management. You help with:
            - Project updates and status
            - Safety protocols and compliance
            - Schedule and budget questions
            - Risk management
            - General construction industry guidance
            
            Keep responses concise and professional. If you need more specific information, ask clarifying questions.
            
            ${projectContext ? `Project context:\n${projectContext}` : ''}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = completion.choices[0].message.content;

      // Store the interaction in communications
      if (projectId) {
        await supabase
          .from('communications')
          .insert({
            project_id: projectId,
            provider: 'teams',
            comm_type: 'chat_message',
            subject: 'Teams Bot Interaction',
            body: `User: ${prompt}\n\nAI: ${aiResponse}`,
            speaker: {
              id: userId,
              name: userName
            },
            message_ts: new Date().toISOString(),
            participants: [userId],
            external_id: payload.id,
            metadata: {
              team_id: teamId,
              channel_id: channelId,
              bot_response: true
            }
          });
      }

      return new Response(
        JSON.stringify({
          type: 'message',
          text: aiResponse
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle other webhook types (like installation events)
    return new Response(
      JSON.stringify({ status: 'received' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Teams bot error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

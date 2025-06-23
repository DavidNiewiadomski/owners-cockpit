
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteRequest {
  email: string;
  projectId: string;
  role: 'admin' | 'gc' | 'vendor' | 'viewer';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    // Parse request body
    const { email, projectId, role }: InviteRequest = await req.json();

    console.log('Invite request:', { email, projectId, role });

    // Validate input
    if (!email || !projectId || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, projectId, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin access to the project
    const { data: hasAccess, error: accessError } = await supabase
      .rpc('has_admin_access', { _user_id: user.id, _project_id: projectId });

    if (accessError) {
      console.error('Error checking admin access:', accessError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions to invite users to this project' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invite already exists
    const { data: existingInvite, error: checkError } = await supabase
      .from('external_invites')
      .select('id, status')
      .eq('email', email)
      .eq('project_id', projectId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking existing invite:', checkError);
      return new Response(
        JSON.stringify({ error: 'Failed to check existing invitations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingInvite && existingInvite.status === 'pending') {
      return new Response(
        JSON.stringify({ error: 'An invitation is already pending for this email' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the external invite record
    const { data: invite, error: inviteError } = await supabase
      .from('external_invites')
      .upsert([{
        email,
        project_id: projectId,
        role,
        invited_by: user.id,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }])
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invite:', inviteError);
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Invite created:', invite);

    // Send the invitation email using Supabase Auth
    const redirectUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token={token}&type=invite&redirect_to=${encodeURIComponent('https://c590e3e6-e6c7-4d88-bddd-3e106c2d4cfe.lovableproject.com/')}`;
    
    const { error: emailError } = await supabase.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: redirectUrl,
        data: {
          project_id: projectId,
          role: role,
          invite_id: invite.id
        }
      }
    );

    if (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the request if email sending fails, the invite record is still created
      console.log('Invitation created but email sending failed');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        invite: invite,
        message: 'Invitation sent successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

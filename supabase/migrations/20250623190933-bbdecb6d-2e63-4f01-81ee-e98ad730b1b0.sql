
-- Create table for storing project integrations with encrypted credentials
CREATE TABLE public.project_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('procore', 'primavera', 'box', 'iot_sensors', 'smartsheet')),
    status TEXT NOT NULL DEFAULT 'not_connected' CHECK (status IN ('connected', 'error', 'not_connected', 'syncing')),
    api_key TEXT, -- Will be encrypted via Supabase secrets
    refresh_token TEXT, -- Will be encrypted via Supabase secrets  
    oauth_data JSONB DEFAULT '{}', -- Store OAuth tokens and metadata
    last_sync TIMESTAMPTZ,
    sync_error TEXT,
    config JSONB DEFAULT '{}', -- Provider-specific configuration
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, provider)
);

-- Enable RLS
ALTER TABLE public.project_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access integrations for projects they have access to
CREATE POLICY "Users can view integrations for accessible projects"
    ON public.project_integrations
    FOR ALL
    USING (
        project_id IN (
            SELECT project_id 
            FROM public.user_projects 
            WHERE user_id = auth.uid()
        )
    );

-- Add updated_at trigger
CREATE TRIGGER update_project_integrations_updated_at 
    BEFORE UPDATE ON public.project_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for live status updates
ALTER TABLE public.project_integrations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_integrations;

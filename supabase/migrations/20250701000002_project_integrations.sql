-- Create project_integrations table for connected services
CREATE TABLE IF NOT EXISTS project_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN (
        'procore', 'primavera', 'onedrive', 'iot_sensors', 'smartsheet', 
        'green_badger', 'billy', 'clearstory', 'track3d', 'bim360', 
        'microsoft_teams', 'zoom', 'outlook'
    )),
    status TEXT NOT NULL DEFAULT 'not_connected' CHECK (status IN (
        'connected', 'error', 'not_connected', 'syncing'
    )),
    api_key TEXT,
    refresh_token TEXT,
    oauth_data JSONB DEFAULT '{}',
    last_sync TIMESTAMPTZ,
    sync_error TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one integration per project per provider
    UNIQUE(project_id, provider)
);

-- Add indexes for performance
CREATE INDEX idx_project_integrations_project_id ON project_integrations(project_id);
CREATE INDEX idx_project_integrations_provider ON project_integrations(provider);
CREATE INDEX idx_project_integrations_status ON project_integrations(status);

-- Enable RLS
ALTER TABLE project_integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only access integrations for their own projects
CREATE POLICY "Users can view project integrations" ON project_integrations FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_integrations.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can modify project integrations" ON project_integrations FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_integrations.project_id AND projects.owner_id = auth.uid())
);

-- Add updated_at trigger
CREATE TRIGGER update_project_integrations_updated_at 
    BEFORE UPDATE ON project_integrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

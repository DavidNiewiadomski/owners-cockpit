
-- Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfi ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts_sent ENABLE ROW LEVEL SECURITY;

-- Create user_projects table for project-level access control
CREATE TABLE IF NOT EXISTS user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create org_members table for organization-level access
CREATE TABLE IF NOT EXISTS org_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, org_id)
);

-- Add org_id to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- Enable RLS on new tables
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view project tasks" ON tasks;
DROP POLICY IF EXISTS "Users can modify project tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view project budget" ON budget_items;
DROP POLICY IF EXISTS "Users can modify project budget" ON budget_items;
DROP POLICY IF EXISTS "Users can view project RFIs" ON rfi;
DROP POLICY IF EXISTS "Users can modify project RFIs" ON rfi;
DROP POLICY IF EXISTS "Users can view project documents" ON documents;
DROP POLICY IF EXISTS "Users can modify project documents" ON documents;
DROP POLICY IF EXISTS "Users can view project images" ON images;
DROP POLICY IF EXISTS "Users can modify project images" ON images;
DROP POLICY IF EXISTS "Users can view project vectors" ON vector_index;
DROP POLICY IF EXISTS "Users can modify project vectors" ON vector_index;

-- Create security definer function to check project access
CREATE OR REPLACE FUNCTION has_project_access(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_projects up
    WHERE up.user_id = auth.uid() AND up.project_id = project_uuid
  );
$$;

-- Create security definer function to check org membership
CREATE OR REPLACE FUNCTION is_org_member(org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.user_id = auth.uid() AND om.org_id = org_uuid
  );
$$;

-- Projects table policies
CREATE POLICY "allow_project_access" ON projects
    FOR ALL USING (has_project_access(id));

CREATE POLICY "allow_own_org" ON projects
    FOR ALL USING (org_id IS NOT NULL AND is_org_member(org_id));

-- Tasks table policies
CREATE POLICY "allow_project_access" ON tasks
    FOR ALL USING (has_project_access(project_id));

-- Budget items table policies
CREATE POLICY "allow_project_access" ON budget_items
    FOR ALL USING (has_project_access(project_id));

-- RFI table policies
CREATE POLICY "allow_project_access" ON rfi
    FOR ALL USING (has_project_access(project_id));

-- Documents table policies
CREATE POLICY "allow_project_access" ON documents
    FOR ALL USING (has_project_access(project_id));

-- Images table policies
CREATE POLICY "allow_project_access" ON images
    FOR ALL USING (has_project_access(project_id));

-- Vector index table policies
CREATE POLICY "allow_project_access" ON vector_index
    FOR ALL USING (has_project_access(project_id));

-- Integration logs table policies
CREATE POLICY "allow_project_access" ON integration_logs
    FOR ALL USING (has_project_access(project_id));

-- Reports table policies
CREATE POLICY "allow_project_access" ON reports
    FOR ALL USING (has_project_access(project_id));

-- Alerts table policies
CREATE POLICY "allow_project_access" ON alerts
    FOR ALL USING (has_project_access(project_id));

-- Alerts sent table policies
CREATE POLICY "allow_project_access" ON alerts_sent
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM alerts a 
            WHERE a.id = alerts_sent.alert_id 
            AND has_project_access(a.project_id)
        )
    );

-- User projects table policies
CREATE POLICY "users_own_access" ON user_projects
    FOR ALL USING (user_id = auth.uid());

-- Organizations table policies
CREATE POLICY "members_can_view_org" ON organizations
    FOR SELECT USING (is_org_member(id));

CREATE POLICY "members_can_update_org" ON organizations
    FOR UPDATE USING (is_org_member(id));

-- Org members table policies
CREATE POLICY "members_can_view_membership" ON org_members
    FOR SELECT USING (user_id = auth.uid() OR is_org_member(org_id));

CREATE POLICY "users_can_manage_own_membership" ON org_members
    FOR ALL USING (user_id = auth.uid());

-- Create trigger function to auto-add users to default org
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Get or create default organization
    SELECT id INTO default_org_id FROM organizations WHERE name = 'Default Organization' LIMIT 1;
    
    IF default_org_id IS NULL THEN
        INSERT INTO organizations (name) VALUES ('Default Organization') RETURNING id INTO default_org_id;
    END IF;
    
    -- Add user to default organization
    INSERT INTO org_members (user_id, org_id, role)
    VALUES (NEW.id, default_org_id, 'member')
    ON CONFLICT (user_id, org_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_project_id ON user_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);

-- Test SQL: Create test users and organizations
-- Insert test organization
INSERT INTO organizations (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'Test Org A'),
('22222222-2222-2222-2222-222222222222', 'Test Org B')
ON CONFLICT DO NOTHING;

-- Test project access scenarios
-- This would typically be done with actual auth.users, but for testing we'll simulate

-- Create test projects
INSERT INTO projects (id, name, org_id, description) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Project Alpha', '11111111-1111-1111-1111-111111111111', 'Test project for Org A'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Project Beta', '22222222-2222-2222-2222-222222222222', 'Test project for Org B')
ON CONFLICT DO NOTHING;

-- Test query examples (uncomment to test with real user IDs):
/*
-- Simulate User 1 (replace with actual user ID)
-- SET session.user_id = 'user1-uuid-here';

-- User 1 should only see Project Alpha if they have access
SELECT * FROM projects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- User 1 should NOT see Project Beta without proper access
SELECT * FROM projects WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- Grant User 1 access to Project Alpha
INSERT INTO user_projects (user_id, project_id) VALUES ('user1-uuid-here', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Add User 1 to Org A
INSERT INTO org_members (user_id, org_id) VALUES ('user1-uuid-here', '11111111-1111-1111-1111-111111111111');
*/

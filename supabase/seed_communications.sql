-- Seed communication connections data
-- This makes the communication integrations appear live

-- Create a temporary user for demo purposes if needed
DO $$
DECLARE
    demo_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Create demo user in auth.users
    INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
    VALUES (demo_user_id, 'demo@ownerscockpit.com', NOW(), NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    -- Temporarily disable RLS for communication_connections seeding
    ALTER TABLE communication_connections DISABLE ROW LEVEL SECURITY;
    
    -- Insert sample communication connections
    INSERT INTO communication_connections (user_id, provider, access_token, refresh_token, expires_at, scope, created_at, updated_at) VALUES
    (demo_user_id, 'outlook', 'mock_outlook_access_token_12345', 'mock_outlook_refresh_token_67890', NOW() + INTERVAL '1 hour', 'https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite', NOW() - INTERVAL '2 days', NOW() - INTERVAL '15 minutes'),
    (demo_user_id, 'teams', 'mock_teams_access_token_54321', 'mock_teams_refresh_token_09876', NOW() + INTERVAL '50 minutes', 'https://graph.microsoft.com/Team.ReadBasic.All https://graph.microsoft.com/Channel.ReadBasic.All', NOW() - INTERVAL '5 days', NOW() - INTERVAL '30 minutes'),
    (demo_user_id, 'zoom', 'mock_zoom_access_token_abcdef', 'mock_zoom_refresh_token_fedcba', NOW() + INTERVAL '2 hours', 'meeting:write meeting:read user:read', NOW() - INTERVAL '1 day', NOW() - INTERVAL '45 minutes'),
    (demo_user_id, 'slack', 'xoxb-mock-slack-token-123456789', NULL, NOW() + INTERVAL '1 day', 'channels:read chat:write files:read', NOW() - INTERVAL '3 days', NOW() - INTERVAL '10 minutes'),
    (demo_user_id, 'whatsapp', 'mock_whatsapp_token_xyz789', 'mock_whatsapp_refresh_abc123', NOW() + INTERVAL '6 hours', 'messages:send messages:read', NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 minutes');
    
    -- Re-enable RLS for communication_connections
    ALTER TABLE communication_connections ENABLE ROW LEVEL SECURITY;
    
END $$;

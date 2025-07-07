-- Seed integration logs data to show recent sync activity
-- This makes the integration syncs appear live with recent activity

DO $$
DECLARE
    demo_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Temporarily disable RLS for integration_logs seeding
    ALTER TABLE integration_logs DISABLE ROW LEVEL SECURITY;
    
    -- Insert sample integration logs for recent activity
    INSERT INTO integration_logs (integration_type, status, external_id, metadata, created_at) VALUES
    
    -- Recent Procore sync activities
    ('procore', 'completed', 'daily-sync-2024070116', 
     jsonb_build_object('user_id', demo_user_id, 'project_count', 3, 'records_synced', 1250, 'duration_ms', 4200), 
     NOW() - INTERVAL '2 hours'),
    ('procore', 'completed', 'hourly-sync-2024070115', 
     jsonb_build_object('user_id', demo_user_id, 'project_count', 3, 'records_synced', 45, 'duration_ms', 1800), 
     NOW() - INTERVAL '3 hours'),
    
    -- Recent Outlook sync activities 
    ('outlook', 'completed', 'mail-sync-latest',
     jsonb_build_object('user_id', demo_user_id, 'emails_processed', 23, 'meetings_synced', 8, 'duration_ms', 2100),
     NOW() - INTERVAL '15 minutes'),
    ('outlook', 'completed', 'mail-sync-previous',
     jsonb_build_object('user_id', demo_user_id, 'emails_processed', 67, 'meetings_synced', 12, 'duration_ms', 3500),
     NOW() - INTERVAL '45 minutes'),
    
    -- Recent Teams sync activities
    ('microsoft_teams', 'completed', 'teams-channels-sync',
     jsonb_build_object('user_id', demo_user_id, 'channels_synced', 15, 'messages_processed', 342, 'duration_ms', 1950),
     NOW() - INTERVAL '5 minutes'),
    ('microsoft_teams', 'completed', 'teams-files-sync',
     jsonb_build_object('user_id', demo_user_id, 'files_indexed', 28, 'size_mb', 145, 'duration_ms', 8200),
     NOW() - INTERVAL '20 minutes'),
    
    -- Recent OneDrive sync activities
    ('onedrive', 'completed', 'files-delta-sync',
     jsonb_build_object('user_id', demo_user_id, 'files_updated', 12, 'files_added', 5, 'size_mb', 78, 'duration_ms', 5400),
     NOW() - INTERVAL '30 minutes'),
    
    -- Recent Smartsheet activities
    ('smartsheet', 'completed', 'sheet-data-sync',
     jsonb_build_object('user_id', demo_user_id, 'sheets_synced', 4, 'rows_processed', 1840, 'duration_ms', 3200),
     NOW() - INTERVAL '1 hour'),
    
    -- Recent Track3D activities
    ('track3d', 'completed', 'progress-analysis',
     jsonb_build_object('user_id', demo_user_id, 'cameras_processed', 12, 'progress_percentage', 67.5, 'duration_ms', 15600),
     NOW() - INTERVAL '6 hours'),
    
    -- Recent IoT sensor activities
    ('iot_sensors', 'completed', 'sensor-data-batch',
     jsonb_build_object('user_id', demo_user_id, 'sensors_count', 45, 'data_points', 2400, 'duration_ms', 800),
     NOW() - INTERVAL '10 minutes'),
    ('iot_sensors', 'completed', 'sensor-data-batch',
     jsonb_build_object('user_id', demo_user_id, 'sensors_count', 45, 'data_points', 2400, 'duration_ms', 750),
     NOW() - INTERVAL '20 minutes'),
    
    -- Green Badger error and recovery
    ('green_badger', 'failed', 'sustainability-sync-fail',
     jsonb_build_object('user_id', demo_user_id, 'error', 'API rate limit exceeded', 'retry_after', '2024-07-02T16:30:00Z'),
     NOW() - INTERVAL '2 days'),
    ('green_badger', 'started', 'sustainability-retry',
     jsonb_build_object('user_id', demo_user_id, 'retry_attempt', 1),
     NOW() - INTERVAL '30 minutes'),
    
    -- Primavera activities
    ('primavera', 'completed', 'schedule-update',
     jsonb_build_object('user_id', demo_user_id, 'tasks_updated', 156, 'milestones_synced', 23, 'duration_ms', 12400),
     NOW() - INTERVAL '3 hours'),
    
    -- BIM360 activities  
    ('bim360', 'completed', 'model-sync',
     jsonb_build_object('user_id', demo_user_id, 'models_synced', 8, 'issues_processed', 23, 'duration_ms', 9800),
     NOW() - INTERVAL '2 hours'),
    
    -- Zoom activities
    ('zoom', 'completed', 'meetings-sync',
     jsonb_build_object('user_id', demo_user_id, 'meetings_today', 3, 'recordings_processed', 2, 'duration_ms', 2200),
     NOW() - INTERVAL '45 minutes'),
    
    -- Clearstory in-progress sync
    ('clearstory', 'started', 'analytics-sync',
     jsonb_build_object('user_id', demo_user_id, 'progress_percentage', 65, 'estimated_completion', '2024-07-01T17:00:00Z'),
     NOW() - INTERVAL '25 minutes'),
    
    -- Billy insurance activities
    ('billy', 'completed', 'policy-check',
     jsonb_build_object('user_id', demo_user_id, 'policies_reviewed', 8, 'claims_status', 'all_clear', 'duration_ms', 1200),
     NOW() - INTERVAL '6 hours'),
    
    -- Slack sync activities
    ('slack', 'completed', 'channels-sync',
     jsonb_build_object('user_id', demo_user_id, 'channels_synced', 8, 'messages_processed', 156, 'duration_ms', 1800),
     NOW() - INTERVAL '10 minutes'),
    
    -- WhatsApp sync activities  
    ('whatsapp', 'completed', 'messages-sync',
     jsonb_build_object('user_id', demo_user_id, 'messages_processed', 34, 'media_files', 8, 'duration_ms', 950),
     NOW() - INTERVAL '5 minutes');
    
    -- Re-enable RLS for integration_logs
    ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
    
END $$;

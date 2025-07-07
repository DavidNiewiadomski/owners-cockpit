-- Add project integrations for Downtown Office Building (the project that maps to project-1 in demo)
DO $$
DECLARE
    downtown_project_id UUID := 'aa2e669f-c1e4-4da6-a705-c2fb776d64ec';
BEGIN
    -- Temporarily disable RLS for project_integrations seeding
    ALTER TABLE project_integrations DISABLE ROW LEVEL SECURITY;
    
    -- Insert sample project integrations for Downtown Office Building (demo project)
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (downtown_project_id, 'procore', 'connected', NOW() - INTERVAL '45 minutes', '{"sync_frequency": "hourly", "last_records": 780, "project_code": "DOB-2024"}'),
    (downtown_project_id, 'outlook', 'connected', NOW() - INTERVAL '8 minutes', '{"mailbox_id": "info@downtownoffice.com", "sync_folders": ["Inbox", "Project Files", "Meetings"]}'),
    (downtown_project_id, 'microsoft_teams', 'connected', NOW() - INTERVAL '12 minutes', '{"team_id": "downtown-office-team", "channels": ["General", "Construction", "Design"]}'),
    (downtown_project_id, 'onedrive', 'connected', NOW() - INTERVAL '25 minutes', '{"folder_path": "/Projects/Downtown Office", "file_count": 1456}'),
    (downtown_project_id, 'bim360', 'connected', NOW() - INTERVAL '1 hour', '{"model_count": 6, "issue_count": 18, "last_model_sync": "2024-07-01T15:30:00Z"}'),
    (downtown_project_id, 'zoom', 'connected', NOW() - INTERVAL '2 hours', '{"meeting_count_today": 2, "recorded_meetings": 12}'),
    (downtown_project_id, 'smartsheet', 'connected', NOW() - INTERVAL '90 minutes', '{"sheet_ids": ["budget-tracker", "schedule"], "last_update": "2024-07-01T15:00:00Z"}'),
    (downtown_project_id, 'iot_sensors', 'connected', NOW() - INTERVAL '15 minutes', '{"sensor_count": 32, "data_points_today": 8400}'),
    (downtown_project_id, 'track3d', 'error', NOW() - INTERVAL '4 hours', '{"error_count": 1}'),
    (downtown_project_id, 'green_badger', 'connected', NOW() - INTERVAL '3 hours', '{"sustainability_score": 85, "certifications": ["LEED Gold"]}')
    ON CONFLICT (project_id, provider) DO NOTHING;
    
    -- Set sync error for track3d
    UPDATE project_integrations 
    SET sync_error = 'Camera connectivity issues. Technician dispatched.'
    WHERE project_id = downtown_project_id AND provider = 'track3d';
    
    -- Re-enable RLS for project_integrations
    ALTER TABLE project_integrations ENABLE ROW LEVEL SECURITY;
    
END $$;

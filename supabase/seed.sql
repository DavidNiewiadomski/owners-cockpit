-- Seed data for projects

-- Temporarily disable RLS for seeding
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Insert sample projects
INSERT INTO projects (name, description, status, start_date, end_date) VALUES
('Downtown Mixed-Use Development', 'Modern mixed-use development with retail, office, and residential spaces in downtown core', 'active', '2024-01-15', '2025-12-30'),
('Green Valley Office Complex', 'Sustainable office complex with LEED Platinum certification target', 'active', '2024-03-01', '2026-02-28'),
('Riverside Residential Tower', 'Luxury residential tower with premium amenities and river views', 'planning', '2024-06-01', '2026-08-31');

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Get project IDs for integration seeding
DO $$
DECLARE
    project1_id UUID;
    project2_id UUID;
    project3_id UUID;
BEGIN
    -- Get the project IDs
    SELECT id INTO project1_id FROM projects WHERE name = 'Downtown Mixed-Use Development' LIMIT 1;
    SELECT id INTO project2_id FROM projects WHERE name = 'Green Valley Office Complex' LIMIT 1;
    SELECT id INTO project3_id FROM projects WHERE name = 'Riverside Residential Tower' LIMIT 1;
    
    -- Temporarily disable RLS for project_integrations seeding
    ALTER TABLE project_integrations DISABLE ROW LEVEL SECURITY;
    
    -- Insert sample project integrations for Downtown Mixed-Use Development
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (project1_id, 'procore', 'connected', NOW() - INTERVAL '2 hours', '{"sync_frequency": "hourly", "last_records": 1250}'),
    (project1_id, 'outlook', 'connected', NOW() - INTERVAL '15 minutes', '{"mailbox_id": "construction@downtowndev.com", "sync_folders": ["Inbox", "Project Updates"]}'),
    (project1_id, 'microsoft_teams', 'connected', NOW() - INTERVAL '5 minutes', '{"team_id": "downtown-dev-team", "channels": ["General", "Construction Updates", "Safety"]}'),
    (project1_id, 'onedrive', 'connected', NOW() - INTERVAL '30 minutes', '{"folder_path": "/Projects/Downtown Development", "file_count": 2847}'),
    (project1_id, 'smartsheet', 'connected', NOW() - INTERVAL '1 hour', '{"sheet_ids": ["scheduling", "budget-tracking"], "last_update": "2024-07-01T14:30:00Z"}'),
    (project1_id, 'track3d', 'connected', NOW() - INTERVAL '6 hours', '{"camera_count": 12, "progress_percentage": 67.5}'),
    (project1_id, 'iot_sensors', 'connected', NOW() - INTERVAL '10 minutes', '{"sensor_count": 45, "data_points_today": 12600}'),
    (project1_id, 'green_badger', 'error', NOW() - INTERVAL '2 days', '{"error_count": 3}');
    
    -- Set sync error for green_badger
    UPDATE project_integrations 
    SET sync_error = 'API rate limit exceeded. Retrying in 24 hours.'
    WHERE project_id = project1_id AND provider = 'green_badger';
    
    -- Insert sample project integrations for Green Valley Office Complex
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (project2_id, 'procore', 'connected', NOW() - INTERVAL '1 hour', '{"sync_frequency": "hourly", "last_records": 890}'),
    (project2_id, 'primavera', 'connected', NOW() - INTERVAL '3 hours', '{"project_code": "GV-OFFICE-2024", "last_schedule_update": "2024-07-01T11:00:00Z"}'),
    (project2_id, 'outlook', 'connected', NOW() - INTERVAL '8 minutes', '{"mailbox_id": "pm@greenvalley.com", "sync_folders": ["Inbox", "Vendor Communications"]}'),
    (project2_id, 'zoom', 'connected', NOW() - INTERVAL '45 minutes', '{"meeting_count_today": 3, "recorded_meetings": 18}'),
    (project2_id, 'bim360', 'connected', NOW() - INTERVAL '2 hours', '{"model_count": 8, "issue_count": 23, "last_model_sync": "2024-07-01T12:15:00Z"}'),
    (project2_id, 'green_badger', 'connected', NOW() - INTERVAL '4 hours', '{"sustainability_score": 92, "certifications": ["LEED Platinum"]}'),
    (project2_id, 'clearstory', 'syncing', NULL, '{"sync_status": "in_progress", "progress": 65}');
    
    -- Insert sample project integrations for Riverside Residential Tower
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (project3_id, 'procore', 'connected', NOW() - INTERVAL '30 minutes', '{"sync_frequency": "hourly", "last_records": 445}'),
    (project3_id, 'outlook', 'connected', NOW() - INTERVAL '12 minutes', '{"mailbox_id": "riverside@luxury.com", "sync_folders": ["Inbox", "Permits", "Inspections"]}'),
    (project3_id, 'microsoft_teams', 'connected', NOW() - INTERVAL '20 minutes', '{"team_id": "riverside-tower", "channels": ["General", "Design Reviews", "Permits"]}'),
    (project3_id, 'smartsheet', 'error', NOW() - INTERVAL '1 day', '{"error_count": 1}'),
    (project3_id, 'billy', 'connected', NOW() - INTERVAL '6 hours', '{"policy_count": 8, "claims_count": 0, "premium_status": "current"}'),
    (project3_id, 'iot_sensors', 'not_connected', NULL, '{"setup_required": true}');
    
    -- Set sync error for smartsheet
    UPDATE project_integrations 
    SET sync_error = 'Authentication token expired. Please reconnect.'
    WHERE project_id = project3_id AND provider = 'smartsheet';
    
    -- Re-enable RLS for project_integrations
    ALTER TABLE project_integrations ENABLE ROW LEVEL SECURITY;
    
END $$;


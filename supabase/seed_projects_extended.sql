-- Extended Project Seed Data to make the system look more realistic

DO $$
DECLARE
    tech_campus_id UUID;
    medical_center_id UUID;
    retail_plaza_id UUID;
    airport_terminal_id UUID;
    university_dorm_id UUID;
    hotel_resort_id UUID;
BEGIN
    -- Temporarily disable RLS
    ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_integrations DISABLE ROW LEVEL SECURITY;
    
    -- Insert additional realistic projects
    INSERT INTO projects (name, description, status, start_date, end_date, budget) VALUES
    ('Tech Campus Innovation Center', 'State-of-the-art technology campus with research labs, offices, and collaborative spaces', 'active', '2023-09-15', '2025-06-30', 125000000),
    ('St. Mary Medical Center Expansion', 'New patient tower and emergency department expansion with 200 additional beds', 'active', '2024-02-01', '2026-03-31', 185000000),
    ('Harbor Point Retail Plaza', 'Mixed retail and dining destination with waterfront access and public spaces', 'active', '2024-05-01', '2025-08-31', 45000000),
    ('International Airport Terminal C', 'New international terminal with 30 gates and modern passenger amenities', 'planning', '2024-08-01', '2027-12-31', 450000000),
    ('State University Student Housing', 'Modern dormitory complex housing 1,200 students with dining and recreation facilities', 'completed', '2022-06-01', '2024-08-15', 78000000),
    ('Oceanview Resort & Spa', 'Luxury beachfront resort with 350 rooms, conference center, and spa facilities', 'on_hold', '2024-03-01', '2026-09-30', 220000000);
    
    -- Get the new project IDs
    SELECT id INTO tech_campus_id FROM projects WHERE name = 'Tech Campus Innovation Center' LIMIT 1;
    SELECT id INTO medical_center_id FROM projects WHERE name = 'St. Mary Medical Center Expansion' LIMIT 1;
    SELECT id INTO retail_plaza_id FROM projects WHERE name = 'Harbor Point Retail Plaza' LIMIT 1;
    SELECT id INTO airport_terminal_id FROM projects WHERE name = 'International Airport Terminal C' LIMIT 1;
    SELECT id INTO university_dorm_id FROM projects WHERE name = 'State University Student Housing' LIMIT 1;
    SELECT id INTO hotel_resort_id FROM projects WHERE name = 'Oceanview Resort & Spa' LIMIT 1;
    
    -- Add project integrations for Tech Campus
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (tech_campus_id, 'procore', 'connected', NOW() - INTERVAL '45 minutes', '{"sync_frequency": "hourly", "last_records": 3450}'),
    (tech_campus_id, 'primavera', 'connected', NOW() - INTERVAL '2 hours', '{"project_code": "TECH-IC-2023", "activities": 2890}'),
    (tech_campus_id, 'bim360', 'connected', NOW() - INTERVAL '30 minutes', '{"model_count": 24, "issue_count": 156}'),
    (tech_campus_id, 'microsoft_teams', 'connected', NOW() - INTERVAL '10 minutes', '{"team_id": "tech-campus-team", "channels": 8}'),
    (tech_campus_id, 'smartsheet', 'connected', NOW() - INTERVAL '1 hour', '{"sheet_count": 45, "automations": 12}'),
    (tech_campus_id, 'green_badger', 'connected', NOW() - INTERVAL '4 hours', '{"sustainability_score": 88, "certifications": ["LEED Gold", "WELL"]}');
    
    -- Add project integrations for Medical Center
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (medical_center_id, 'procore', 'connected', NOW() - INTERVAL '20 minutes', '{"sync_frequency": "hourly", "last_records": 4200}'),
    (medical_center_id, 'outlook', 'connected', NOW() - INTERVAL '5 minutes', '{"mailbox_id": "medical-expansion@stmary.com"}'),
    (medical_center_id, 'track3d', 'connected', NOW() - INTERVAL '3 hours', '{"camera_count": 18, "progress_percentage": 42.5}'),
    (medical_center_id, 'billy', 'connected', NOW() - INTERVAL '12 hours', '{"policy_count": 12, "claims_count": 2}'),
    (medical_center_id, 'iot_sensors', 'connected', NOW() - INTERVAL '15 minutes', '{"sensor_count": 85, "critical_areas": ["ICU", "OR", "Emergency"]}');
    
    -- Add project integrations for Retail Plaza
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (retail_plaza_id, 'procore', 'connected', NOW() - INTERVAL '1 hour', '{"sync_frequency": "hourly", "last_records": 1250}'),
    (retail_plaza_id, 'smartsheet', 'connected', NOW() - INTERVAL '30 minutes', '{"sheet_count": 18, "tenant_coordination": true}'),
    (retail_plaza_id, 'onedrive', 'connected', NOW() - INTERVAL '2 hours', '{"folder_path": "/Projects/Harbor Point", "file_count": 1890}');
    
    -- Add Division 1 data for new active projects
    ALTER TABLE division1_sections DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues DISABLE ROW LEVEL SECURITY;
    
    -- Tech Campus Division 1 Sections
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (tech_campus_id, '01 10 00', 'Summary', 'completed', '2023-11-15', 14, 14, 'high', 100.0),
    (tech_campus_id, '01 20 00', 'Price and Payment Procedures', 'completed', '2023-12-30', 20, 20, 'high', 100.0),
    (tech_campus_id, '01 30 00', 'Administrative Requirements', 'completed', '2024-01-15', 28, 28, 'medium', 100.0),
    (tech_campus_id, '01 31 00', 'Project Management and Coordination', 'completed', '2024-02-28', 15, 15, 'high', 100.0),
    (tech_campus_id, '01 32 00', 'Construction Progress Documentation', 'in_progress', '2025-05-30', 85, 100, 'medium', 85.0),
    (tech_campus_id, '01 40 00', 'Quality Requirements', 'in_progress', '2025-04-15', 22, 25, 'high', 88.0),
    (tech_campus_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-03-01', 18, 18, 'medium', 100.0),
    (tech_campus_id, '01 60 00', 'Product Requirements', 'in_progress', '2025-05-20', 45, 60, 'medium', 75.0),
    (tech_campus_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2025-06-15', 12, 30, 'high', 40.0),
    (tech_campus_id, '01 80 00', 'Performance Requirements', 'in_progress', '2025-06-01', 8, 15, 'medium', 53.3);
    
    -- Medical Center Division 1 Sections
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (medical_center_id, '01 10 00', 'Summary', 'completed', '2024-04-01', 16, 16, 'high', 100.0),
    (medical_center_id, '01 20 00', 'Price and Payment Procedures', 'completed', '2024-05-15', 22, 22, 'high', 100.0),
    (medical_center_id, '01 30 00', 'Administrative Requirements', 'in_progress', '2025-02-28', 26, 32, 'medium', 81.3),
    (medical_center_id, '01 33 00', 'Submittal Procedures', 'in_progress', '2025-03-15', 120, 180, 'high', 66.7),
    (medical_center_id, '01 35 00', 'Special Procedures - Healthcare', 'in_progress', '2025-04-01', 15, 25, 'high', 60.0),
    (medical_center_id, '01 40 00', 'Quality Requirements', 'in_progress', '2025-04-30', 18, 28, 'high', 64.3),
    (medical_center_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-06-01', 20, 20, 'medium', 100.0),
    (medical_center_id, '01 60 00', 'Product Requirements', 'pending', '2025-06-30', 8, 35, 'medium', 22.9),
    (medical_center_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2026-02-28', 0, 35, 'high', 0.0),
    (medical_center_id, '01 80 00', 'Performance Requirements', 'pending', '2026-03-15', 0, 18, 'medium', 0.0);
    
    -- Add some issues for Tech Campus
    DECLARE section_id UUID;
    BEGIN
        SELECT id INTO section_id FROM division1_sections WHERE project_id = tech_campus_id AND section_number = '01 32 00' LIMIT 1;
        INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, notes) VALUES
        (section_id, 'Photo documentation system needs upgrade for AI progress tracking', 'medium', 'in_progress', 'Tech Team Lead', 'Evaluating new AI-powered documentation platforms');
        
        SELECT id INTO section_id FROM division1_sections WHERE project_id = tech_campus_id AND section_number = '01 60 00' LIMIT 1;
        INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, notes) VALUES
        (section_id, 'Smart building system specifications pending final approval', 'high', 'open', 'MEP Coordinator', 'Waiting for IT department security review');
    END;
    
    -- Re-enable RLS
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_integrations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues ENABLE ROW LEVEL SECURITY;
    
END $$;
-- Complete Division 1 Seed Script (All-in-One)
-- This script contains all seed data in one file for easy execution

-- ============================
-- STEP 1: BASE PROJECTS
-- ============================

-- Temporarily disable RLS for seeding
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Insert sample projects
INSERT INTO projects (name, description, status, start_date, end_date, budget) VALUES
('Downtown Mixed-Use Development', 'Modern mixed-use development with retail, office, and residential spaces in downtown core', 'active', '2024-01-15', '2025-12-30', 145000000),
('Green Valley Office Complex', 'Sustainable office complex with LEED Platinum certification target', 'active', '2024-03-01', '2026-02-28', 98000000),
('Riverside Residential Tower', 'Luxury residential tower with premium amenities and river views', 'planning', '2024-06-01', '2026-08-31', 125000000),
('Tech Campus Innovation Center', 'State-of-the-art technology campus with research labs, offices, and collaborative spaces', 'active', '2023-09-15', '2025-06-30', 125000000),
('St. Mary Medical Center Expansion', 'New patient tower and emergency department expansion with 200 additional beds', 'active', '2024-02-01', '2026-03-31', 185000000),
('Harbor Point Retail Plaza', 'Mixed retail and dining destination with waterfront access and public spaces', 'active', '2024-05-01', '2025-08-31', 45000000),
('International Airport Terminal C', 'New international terminal with 30 gates and modern passenger amenities', 'planning', '2024-08-01', '2027-12-31', 450000000),
('State University Student Housing', 'Modern dormitory complex housing 1,200 students with dining and recreation facilities', 'completed', '2022-06-01', '2024-08-15', 78000000),
('Oceanview Resort & Spa', 'Luxury beachfront resort with 350 rooms, conference center, and spa facilities', 'on_hold', '2024-03-01', '2026-09-30', 220000000);

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================
-- STEP 2: PROJECT INTEGRATIONS AND DIVISION 1 DATA
-- ============================

DO $$
DECLARE
    -- Project IDs
    downtown_id UUID;
    greenvalley_id UUID;
    riverside_id UUID;
    tech_campus_id UUID;
    medical_center_id UUID;
    retail_plaza_id UUID;
    airport_terminal_id UUID;
    university_dorm_id UUID;
    hotel_resort_id UUID;
    section_id UUID;
BEGIN
    -- Get project IDs
    SELECT id INTO downtown_id FROM projects WHERE name = 'Downtown Mixed-Use Development' LIMIT 1;
    SELECT id INTO greenvalley_id FROM projects WHERE name = 'Green Valley Office Complex' LIMIT 1;
    SELECT id INTO riverside_id FROM projects WHERE name = 'Riverside Residential Tower' LIMIT 1;
    SELECT id INTO tech_campus_id FROM projects WHERE name = 'Tech Campus Innovation Center' LIMIT 1;
    SELECT id INTO medical_center_id FROM projects WHERE name = 'St. Mary Medical Center Expansion' LIMIT 1;
    SELECT id INTO retail_plaza_id FROM projects WHERE name = 'Harbor Point Retail Plaza' LIMIT 1;
    SELECT id INTO airport_terminal_id FROM projects WHERE name = 'International Airport Terminal C' LIMIT 1;
    SELECT id INTO university_dorm_id FROM projects WHERE name = 'State University Student Housing' LIMIT 1;
    SELECT id INTO hotel_resort_id FROM projects WHERE name = 'Oceanview Resort & Spa' LIMIT 1;
    
    -- Disable RLS for all tables
    ALTER TABLE project_integrations DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_sections DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_audit_results DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend DISABLE ROW LEVEL SECURITY;
    
    -- Insert project integrations for Downtown Mixed-Use Development
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (downtown_id, 'procore', 'connected', NOW() - INTERVAL '2 hours', '{"sync_frequency": "hourly", "last_records": 1250}'),
    (downtown_id, 'outlook', 'connected', NOW() - INTERVAL '15 minutes', '{"mailbox_id": "construction@downtowndev.com", "sync_folders": ["Inbox", "Project Updates"]}'),
    (downtown_id, 'microsoft_teams', 'connected', NOW() - INTERVAL '5 minutes', '{"team_id": "downtown-dev-team", "channels": ["General", "Construction Updates", "Safety"]}'),
    (downtown_id, 'onedrive', 'connected', NOW() - INTERVAL '30 minutes', '{"folder_path": "/Projects/Downtown Development", "file_count": 2847}'),
    (downtown_id, 'smartsheet', 'connected', NOW() - INTERVAL '1 hour', '{"sheet_ids": ["scheduling", "budget-tracking"], "last_update": "2024-07-01T14:30:00Z"}'),
    (downtown_id, 'track3d', 'connected', NOW() - INTERVAL '6 hours', '{"camera_count": 12, "progress_percentage": 67.5}'),
    (downtown_id, 'iot_sensors', 'connected', NOW() - INTERVAL '10 minutes', '{"sensor_count": 45, "data_points_today": 12600}');
    
    -- ============================
    -- DOWNTOWN DIVISION 1 DATA
    -- ============================
    
    -- Division 1 Sections
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (downtown_id, '01 10 00', 'Summary', 'completed', '2024-03-15', 12, 12, 'high', 100.0),
    (downtown_id, '01 20 00', 'Price and Payment Procedures', 'completed', '2024-04-30', 18, 18, 'high', 100.0),
    (downtown_id, '01 30 00', 'Administrative Requirements', 'completed', '2024-05-15', 25, 25, 'medium', 100.0),
    (downtown_id, '01 40 00', 'Quality Requirements', 'in_progress', '2025-02-15', 14, 20, 'high', 70.0),
    (downtown_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-06-01', 16, 16, 'medium', 100.0),
    (downtown_id, '01 60 00', 'Product Requirements', 'in_progress', '2025-03-20', 11, 18, 'medium', 61.1),
    (downtown_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2025-10-01', 3, 22, 'high', 13.6),
    (downtown_id, '01 80 00', 'Performance Requirements', 'pending', '2025-09-30', 2, 15, 'medium', 13.3),
    (downtown_id, '01 90 00', 'Life Cycle Activities', 'pending', '2025-11-30', 0, 10, 'low', 0.0);
    
    -- Issues for Downtown
    SELECT id INTO section_id FROM division1_sections WHERE project_id = downtown_id AND section_number = '01 40 00' LIMIT 1;
    INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, notes) VALUES
    (section_id, 'Quality control procedures need updating for new city requirements', 'high', 'in_progress', 'John Smith', 'Working with city officials to clarify requirements'),
    (section_id, 'Missing inspection reports from subcontractors', 'medium', 'open', 'Sarah Johnson', 'Following up with electrical and plumbing subs');
    
    -- Attachments
    SELECT id INTO section_id FROM division1_sections WHERE project_id = downtown_id AND section_number = '01 10 00' LIMIT 1;
    INSERT INTO division1_attachments (section_id, name, file_path, file_size, mime_type, uploaded_by) VALUES
    (section_id, 'Project Manual Summary.pdf', '/projects/downtown/division1/01-10-00/project-manual-summary.pdf', 2458000, 'application/pdf', 'Tom Wilson'),
    (section_id, 'Specifications Index.xlsx', '/projects/downtown/division1/01-10-00/specs-index.xlsx', 156000, 'application/vnd.ms-excel', 'Tom Wilson');
    
    -- Transactions
    INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
    (downtown_id, '2024-12-01', 'Division 1 - Initial Documentation Package', 'ABC Consultants', -45000, 'Professional Services', 'completed'),
    (downtown_id, '2024-12-15', 'Progress Billing #12 - Division 1 Compliance', 'Owner Payment', 250000, 'billing', 'completed'),
    (downtown_id, '2024-12-20', 'Division 1 - Quality Control Services', 'QC Specialists Inc', -28000, 'quality', 'completed'),
    (downtown_id, '2025-01-05', 'Division 1 - BIM Coordination Services', 'BIM Solutions LLC', -35000, 'coordination', 'pending'),
    (downtown_id, '2025-01-10', 'Progress Billing #13 - Division 1 Updates', 'Owner Payment', 180000, 'billing', 'pending');
    
    -- Cash Flow
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (downtown_id, '2024-12', 2500000, 2180000, 4250000),
    (downtown_id, '2024-11', 2800000, 2450000, 3930000),
    (downtown_id, '2024-10', 3100000, 2900000, 3580000);
    
    -- Monthly Spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (downtown_id, '2024-12', 2200000, 2180000, 2190000),
    (downtown_id, '2025-01', 2300000, 0, 2280000);
    
    -- Compliance Logs
    INSERT INTO division1_compliance_logs (project_id, action, performed_by, notes, metadata) VALUES
    (downtown_id, 'Monthly Compliance Review Completed', 'Tom Wilson', 'All sections reviewed, 3 items need attention', '{"review_date": "2024-12-28", "sections_reviewed": 9, "issues_found": 3}'),
    (downtown_id, 'City Inspector Site Visit', 'City Building Dept', 'Passed inspection with minor notes', '{"inspector": "J. Martinez", "result": "passed"}');
    
    -- Audit Results
    INSERT INTO division1_audit_results (project_id, audit_date, overall_compliance_score, sections_compliant, total_sections, critical_issues, medium_issues, low_issues, auditor, summary, recommendations) VALUES
    (downtown_id, '2024-12-15', 94.5, 6, 9, 0, 2, 4, 'External Auditors LLC', 
     'Project shows excellent compliance with Division 1 requirements. Minor documentation gaps identified.',
     ARRAY['Update product submittal tracking log', 'Implement weekly closeout planning meetings']);
    
    -- ============================
    -- GREEN VALLEY DIVISION 1 DATA
    -- ============================
    
    -- Project Integrations
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (greenvalley_id, 'procore', 'connected', NOW() - INTERVAL '1 hour', '{"sync_frequency": "hourly", "last_records": 890}'),
    (greenvalley_id, 'primavera', 'connected', NOW() - INTERVAL '3 hours', '{"project_code": "GV-OFFICE-2024"}'),
    (greenvalley_id, 'bim360', 'connected', NOW() - INTERVAL '2 hours', '{"model_count": 8, "issue_count": 23}');
    
    -- Division 1 Sections
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (greenvalley_id, '01 10 00', 'Summary', 'completed', '2024-05-01', 10, 10, 'high', 100.0),
    (greenvalley_id, '01 20 00', 'Price and Payment Procedures', 'completed', '2024-06-15', 15, 15, 'high', 100.0),
    (greenvalley_id, '01 30 00', 'Administrative Requirements', 'in_progress', '2025-01-31', 19, 24, 'medium', 79.2),
    (greenvalley_id, '01 31 00', 'Project Management and Coordination', 'in_progress', '2025-02-28', 8, 12, 'high', 66.7),
    (greenvalley_id, '01 40 00', 'Quality Requirements', 'in_progress', '2025-03-15', 12, 18, 'high', 66.7),
    (greenvalley_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-07-01', 14, 14, 'medium', 100.0),
    (greenvalley_id, '01 60 00', 'Product Requirements', 'pending', '2025-04-30', 5, 20, 'medium', 25.0),
    (greenvalley_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2026-01-15', 0, 25, 'high', 0.0);
    
    -- ============================
    -- TECH CAMPUS DIVISION 1 DATA
    -- ============================
    
    -- Project Integrations
    INSERT INTO project_integrations (project_id, provider, status, last_sync, config) VALUES
    (tech_campus_id, 'procore', 'connected', NOW() - INTERVAL '45 minutes', '{"sync_frequency": "hourly", "last_records": 3450}'),
    (tech_campus_id, 'bim360', 'connected', NOW() - INTERVAL '30 minutes', '{"model_count": 24, "issue_count": 156}'),
    (tech_campus_id, 'green_badger', 'connected', NOW() - INTERVAL '4 hours', '{"sustainability_score": 88}');
    
    -- Division 1 Sections
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (tech_campus_id, '01 10 00', 'Summary', 'completed', '2023-11-15', 14, 14, 'high', 100.0),
    (tech_campus_id, '01 20 00', 'Price and Payment Procedures', 'completed', '2023-12-30', 20, 20, 'high', 100.0),
    (tech_campus_id, '01 30 00', 'Administrative Requirements', 'completed', '2024-01-15', 28, 28, 'medium', 100.0),
    (tech_campus_id, '01 32 00', 'Construction Progress Documentation', 'in_progress', '2025-05-30', 85, 100, 'medium', 85.0),
    (tech_campus_id, '01 40 00', 'Quality Requirements', 'in_progress', '2025-04-15', 22, 25, 'high', 88.0),
    (tech_campus_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-03-01', 18, 18, 'medium', 100.0),
    (tech_campus_id, '01 60 00', 'Product Requirements', 'in_progress', '2025-05-20', 45, 60, 'medium', 75.0),
    (tech_campus_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2025-06-15', 12, 30, 'high', 40.0);
    
    -- Re-enable RLS for all tables
    ALTER TABLE project_integrations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_audit_results ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Division 1 seed data loaded successfully!';
END $$;
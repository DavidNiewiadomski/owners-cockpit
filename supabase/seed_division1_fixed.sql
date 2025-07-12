-- Fixed Division 1 Seed Script with Correct Project IDs
-- Seeds Division 1 data for all projects

DO $$
BEGIN
    -- Disable RLS for seeding
    ALTER TABLE division1_sections DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_audit_results DISABLE ROW LEVEL SECURITY;
    
    -- Clear existing Division 1 data
    DELETE FROM division1_audit_results;
    DELETE FROM division1_compliance_logs;
    DELETE FROM division1_attachments;
    DELETE FROM division1_issues;
    DELETE FROM division1_sections;
    
    -- ============ DOWNTOWN OFFICE BUILDING - Division 1 Data ============
    -- Division 1 Sections
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    ('11111111-1111-1111-1111-111111111111', '01 10 00', 'Summary', 'completed', '2024-03-15', 12, 12, 'high', 100.0),
    ('11111111-1111-1111-1111-111111111111', '01 20 00', 'Price and Payment Procedures', 'completed', '2024-04-30', 18, 18, 'high', 100.0),
    ('11111111-1111-1111-1111-111111111111', '01 30 00', 'Administrative Requirements', 'completed', '2024-04-15', 22, 22, 'medium', 100.0),
    ('11111111-1111-1111-1111-111111111111', '01 40 00', 'Quality Requirements', 'in_progress', '2024-07-15', 8, 12, 'high', 66.7),
    ('11111111-1111-1111-1111-111111111111', '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-05-01', 16, 16, 'medium', 100.0),
    ('11111111-1111-1111-1111-111111111111', '01 60 00', 'Product Requirements', 'in_progress', '2024-07-20', 12, 18, 'medium', 66.7),
    ('11111111-1111-1111-1111-111111111111', '01 70 00', 'Execution and Closeout Requirements', 'pending', '2024-11-01', 0, 20, 'high', 0.0),
    ('11111111-1111-1111-1111-111111111111', '01 80 00', 'Performance Requirements', 'pending', '2024-10-30', 2, 14, 'medium', 14.3);
    
    -- Division 1 Issues for Downtown Office
    INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, notes) VALUES
    ((SELECT id FROM division1_sections WHERE project_id = '11111111-1111-1111-1111-111111111111' AND section_number = '01 40 00'), 
     'Missing quality control procedures for concrete testing', 'high', 'open', 'Quality Manager', 'Need to submit testing protocols by end of week'),
    ((SELECT id FROM division1_sections WHERE project_id = '11111111-1111-1111-1111-111111111111' AND section_number = '01 60 00'), 
     'Product submittal log incomplete', 'medium', 'in_progress', 'Project Engineer', 'Working with subs to collect remaining submittals');
    
    -- Division 1 Audit Results
    INSERT INTO division1_audit_results (project_id, audit_date, overall_compliance_score, sections_compliant, total_sections, critical_issues, medium_issues, low_issues, auditor, summary) VALUES
    ('11111111-1111-1111-1111-111111111111', '2024-06-01', 87.5, 6, 8, 1, 2, 3, 'John Smith, CCA', 'Overall compliance is good. Focus needed on quality requirements and closeout procedures.');
    
    -- ============ RESIDENTIAL COMPLEX - Division 1 Data ============
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    ('22222222-2222-2222-2222-222222222222', '01 10 00', 'Summary', 'in_progress', '2024-08-15', 8, 10, 'high', 80.0),
    ('22222222-2222-2222-2222-222222222222', '01 20 00', 'Price and Payment Procedures', 'pending', '2024-09-30', 0, 15, 'high', 0.0),
    ('22222222-2222-2222-2222-222222222222', '01 30 00', 'Administrative Requirements', 'in_progress', '2024-08-30', 12, 20, 'medium', 60.0),
    ('22222222-2222-2222-2222-222222222222', '01 40 00', 'Quality Requirements', 'pending', '2024-10-15', 0, 10, 'high', 0.0),
    ('22222222-2222-2222-2222-222222222222', '01 50 00', 'Temporary Facilities and Controls', 'pending', '2024-09-01', 2, 14, 'medium', 14.3),
    ('22222222-2222-2222-2222-222222222222', '01 60 00', 'Product Requirements', 'pending', '2024-10-20', 0, 16, 'medium', 0.0),
    ('22222222-2222-2222-2222-222222222222', '01 70 00', 'Execution and Closeout Requirements', 'pending', '2025-01-01', 0, 18, 'high', 0.0),
    ('22222222-2222-2222-2222-222222222222', '01 80 00', 'Performance Requirements', 'pending', '2024-12-30', 0, 12, 'medium', 0.0);
    
    -- Division 1 Issues for Residential Complex
    INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, notes) VALUES
    ((SELECT id FROM division1_sections WHERE project_id = '22222222-2222-2222-2222-222222222222' AND section_number = '01 10 00'), 
     'Project summary needs owner approval', 'medium', 'open', 'Project Manager', 'Scheduled for review next week'),
    ((SELECT id FROM division1_sections WHERE project_id = '22222222-2222-2222-2222-222222222222' AND section_number = '01 30 00'), 
     'Insurance certificates pending from 3 subcontractors', 'high', 'open', 'Admin Assistant', 'Follow up emails sent');
    
    -- ============ HIGHWAY BRIDGE - Division 1 Data ============
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    ('33333333-3333-3333-3333-333333333333', '01 10 00', 'Summary', 'completed', '2024-02-28', 14, 14, 'high', 100.0),
    ('33333333-3333-3333-3333-333333333333', '01 20 00', 'Price and Payment Procedures', 'completed', '2024-03-15', 20, 20, 'high', 100.0),
    ('33333333-3333-3333-3333-333333333333', '01 30 00', 'Administrative Requirements', 'completed', '2024-03-30', 25, 25, 'medium', 100.0),
    ('33333333-3333-3333-3333-333333333333', '01 40 00', 'Quality Requirements', 'completed', '2024-04-15', 15, 15, 'high', 100.0),
    ('33333333-3333-3333-3333-333333333333', '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-04-01', 18, 18, 'medium', 100.0),
    ('33333333-3333-3333-3333-333333333333', '01 60 00', 'Product Requirements', 'in_progress', '2024-08-20', 14, 20, 'medium', 70.0),
    ('33333333-3333-3333-3333-333333333333', '01 70 00', 'Execution and Closeout Requirements', 'in_progress', '2024-10-01', 10, 22, 'high', 45.5),
    ('33333333-3333-3333-3333-333333333333', '01 80 00', 'Performance Requirements', 'in_progress', '2024-09-30', 8, 16, 'medium', 50.0);
    
    -- Division 1 Issues for Highway Bridge
    INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, notes) VALUES
    ((SELECT id FROM division1_sections WHERE project_id = '33333333-3333-3333-3333-333333333333' AND section_number = '01 70 00'), 
     'Closeout documentation checklist needs updating', 'low', 'open', 'Document Controller', 'Review with owner rep'),
    ((SELECT id FROM division1_sections WHERE project_id = '33333333-3333-3333-3333-333333333333' AND section_number = '01 60 00'), 
     'Material certifications pending for structural steel', 'medium', 'in_progress', 'QC Manager', 'Supplier to provide by month end');
    
    -- Division 1 Audit Results for Highway Bridge
    INSERT INTO division1_audit_results (project_id, audit_date, overall_compliance_score, sections_compliant, total_sections, critical_issues, medium_issues, low_issues, auditor, summary) VALUES
    ('33333333-3333-3333-3333-333333333333', '2024-05-15', 92.0, 7, 8, 0, 1, 2, 'State DOT Inspector', 'Excellent compliance overall. Minor issues with product documentation.');
    
    -- Division 1 Compliance Logs
    INSERT INTO division1_compliance_logs (project_id, action, performed_by, notes) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Monthly compliance review completed', 'Sarah Johnson', 'All sections reviewed, 2 issues identified'),
    ('22222222-2222-2222-2222-222222222222', 'Initial Division 1 setup', 'David Kim', 'Created structure and assigned responsibilities'),
    ('33333333-3333-3333-3333-333333333333', 'Quarterly audit performed', 'Robert Chang', 'State DOT requirements verified');
    
    -- Re-enable RLS
    ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_audit_results ENABLE ROW LEVEL SECURITY;
    
END $$;

-- Verify data was inserted
DO $$
DECLARE
    section_count INTEGER;
    issue_count INTEGER;
    audit_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO section_count FROM division1_sections;
    SELECT COUNT(*) INTO issue_count FROM division1_issues;
    SELECT COUNT(*) INTO audit_count FROM division1_audit_results;
    
    RAISE NOTICE 'Division 1 seed completed!';
    RAISE NOTICE 'Sections created: %', section_count;
    RAISE NOTICE 'Issues created: %', issue_count;
    RAISE NOTICE 'Audit results created: %', audit_count;
END $$;
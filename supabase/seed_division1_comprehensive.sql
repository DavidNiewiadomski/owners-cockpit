-- Comprehensive Division 1 Seed Data
-- This script seeds Division 1 data for all existing projects

DO $$
DECLARE
    downtown_id UUID;
    greenvalley_id UUID;
    riverside_id UUID;
    section_id UUID;
BEGIN
    -- Get existing project IDs
    SELECT id INTO downtown_id FROM projects WHERE name = 'Downtown Mixed-Use Development' LIMIT 1;
    SELECT id INTO greenvalley_id FROM projects WHERE name = 'Green Valley Office Complex' LIMIT 1;
    SELECT id INTO riverside_id FROM projects WHERE name = 'Riverside Residential Tower' LIMIT 1;
    
    -- Disable RLS temporarily
    ALTER TABLE division1_sections DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_audit_results DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend DISABLE ROW LEVEL SECURITY;
    
    -- Clear existing Division 1 data
    DELETE FROM division1_audit_results;
    DELETE FROM division1_compliance_logs;
    DELETE FROM division1_attachments;
    DELETE FROM division1_issues;
    DELETE FROM division1_sections;
    
    -- ============================
    -- DOWNTOWN MIXED-USE DEVELOPMENT
    -- ============================
    
    -- Division 1 Sections for Downtown
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
    
    -- Get a section ID for issues
    SELECT id INTO section_id FROM division1_sections WHERE project_id = downtown_id AND section_number = '01 40 00' LIMIT 1;
    
    -- Issues for Downtown
    INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, resolved_date, notes) VALUES
    (section_id, 'Quality control procedures need updating for new city requirements', 'high', 'in_progress', 'John Smith', NULL, 'Working with city officials to clarify requirements'),
    (section_id, 'Missing inspection reports from subcontractors', 'medium', 'open', 'Sarah Johnson', NULL, 'Following up with electrical and plumbing subs');
    
    SELECT id INTO section_id FROM division1_sections WHERE project_id = downtown_id AND section_number = '01 60 00' LIMIT 1;
    INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, resolved_date, notes) VALUES
    (section_id, 'Product submittal delays from steel supplier', 'high', 'in_progress', 'Mike Chen', NULL, 'Escalated to procurement team'),
    (section_id, 'Environmental product declarations missing for 3 materials', 'low', 'resolved', 'Lisa Wang', '2024-12-20', 'All EPDs received and approved');
    
    -- Attachments for Downtown sections
    SELECT id INTO section_id FROM division1_sections WHERE project_id = downtown_id AND section_number = '01 10 00' LIMIT 1;
    INSERT INTO division1_attachments (section_id, name, file_path, file_size, mime_type, uploaded_by) VALUES
    (section_id, 'Project Manual Summary.pdf', '/projects/downtown/division1/01-10-00/project-manual-summary.pdf', 2458000, 'application/pdf', 'Tom Wilson'),
    (section_id, 'Specifications Index.xlsx', '/projects/downtown/division1/01-10-00/specs-index.xlsx', 156000, 'application/vnd.ms-excel', 'Tom Wilson'),
    (section_id, 'Drawing Index Rev3.pdf', '/projects/downtown/division1/01-10-00/drawing-index-rev3.pdf', 890000, 'application/pdf', 'Amy Brown');
    
    -- ============================
    -- GREEN VALLEY OFFICE COMPLEX
    -- ============================
    
    -- Division 1 Sections for Green Valley
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (greenvalley_id, '01 10 00', 'Summary', 'completed', '2024-05-01', 10, 10, 'high', 100.0),
    (greenvalley_id, '01 20 00', 'Price and Payment Procedures', 'completed', '2024-06-15', 15, 15, 'high', 100.0),
    (greenvalley_id, '01 30 00', 'Administrative Requirements', 'in_progress', '2025-01-31', 19, 24, 'medium', 79.2),
    (greenvalley_id, '01 31 00', 'Project Management and Coordination', 'in_progress', '2025-02-28', 8, 12, 'high', 66.7),
    (greenvalley_id, '01 40 00', 'Quality Requirements', 'in_progress', '2025-03-15', 12, 18, 'high', 66.7),
    (greenvalley_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-07-01', 14, 14, 'medium', 100.0),
    (greenvalley_id, '01 60 00', 'Product Requirements', 'pending', '2025-04-30', 5, 20, 'medium', 25.0),
    (greenvalley_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2026-01-15', 0, 25, 'high', 0.0),
    (greenvalley_id, '01 80 00', 'Performance Requirements', 'pending', '2026-01-30', 0, 12, 'medium', 0.0);
    
    -- Issues for Green Valley
    SELECT id INTO section_id FROM division1_sections WHERE project_id = greenvalley_id AND section_number = '01 31 00' LIMIT 1;
    INSERT INTO division1_issues (section_id, description, severity, status, assigned_to, resolved_date, notes) VALUES
    (section_id, 'BIM coordination meetings not properly documented', 'medium', 'in_progress', 'David Lee', NULL, 'Implementing new meeting minutes template'),
    (section_id, 'Subcontractor scheduling conflicts need resolution', 'high', 'open', 'Rachel Green', NULL, 'Critical path impact identified');
    
    -- ============================
    -- RIVERSIDE RESIDENTIAL TOWER
    -- ============================
    
    -- Division 1 Sections for Riverside (in planning phase)
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (riverside_id, '01 10 00', 'Summary', 'in_progress', '2024-08-15', 6, 10, 'high', 60.0),
    (riverside_id, '01 20 00', 'Price and Payment Procedures', 'pending', '2024-09-30', 3, 15, 'high', 20.0),
    (riverside_id, '01 30 00', 'Administrative Requirements', 'pending', '2024-10-15', 5, 22, 'medium', 22.7),
    (riverside_id, '01 40 00', 'Quality Requirements', 'pending', '2024-11-30', 0, 18, 'high', 0.0),
    (riverside_id, '01 50 00', 'Temporary Facilities and Controls', 'pending', '2024-12-15', 0, 14, 'medium', 0.0),
    (riverside_id, '01 60 00', 'Product Requirements', 'pending', '2025-01-30', 0, 20, 'medium', 0.0),
    (riverside_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2026-06-30', 0, 22, 'high', 0.0),
    (riverside_id, '01 80 00', 'Performance Requirements', 'pending', '2026-07-15', 0, 12, 'medium', 0.0);
    
    -- ============================
    -- PROJECT TRANSACTIONS
    -- ============================
    
    -- Downtown transactions
    INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
    (downtown_id, '2024-12-01', 'Division 1 - Initial Documentation Package', 'ABC Consultants', -45000, 'Professional Services', 'completed'),
    (downtown_id, '2024-12-15', 'Progress Billing #12 - Division 1 Compliance', 'Owner Payment', 250000, 'billing', 'completed'),
    (downtown_id, '2024-12-20', 'Division 1 - Quality Control Services', 'QC Specialists Inc', -28000, 'quality', 'completed'),
    (downtown_id, '2025-01-05', 'Division 1 - BIM Coordination Services', 'BIM Solutions LLC', -35000, 'coordination', 'pending'),
    (downtown_id, '2025-01-10', 'Progress Billing #13 - Division 1 Updates', 'Owner Payment', 180000, 'billing', 'pending');
    
    -- Green Valley transactions
    INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
    (greenvalley_id, '2024-11-15', 'Division 1 - LEED Documentation', 'Green Building Consultants', -55000, 'sustainability', 'completed'),
    (greenvalley_id, '2024-12-01', 'Division 1 - Commissioning Services', 'Building Cx Partners', -42000, 'commissioning', 'completed'),
    (greenvalley_id, '2024-12-28', 'Progress Payment - Division 1 Milestone', 'Owner Payment', 320000, 'billing', 'completed'),
    (greenvalley_id, '2025-01-08', 'Division 1 - Safety Program Implementation', 'Safety First LLC', -18000, 'safety', 'pending');
    
    -- ============================
    -- CASH FLOW DATA
    -- ============================
    
    -- Downtown cash flow
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (downtown_id, '2024-12', 2500000, 2180000, 4250000),
    (downtown_id, '2024-11', 2800000, 2450000, 3930000),
    (downtown_id, '2024-10', 3100000, 2900000, 3580000),
    (downtown_id, '2024-09', 2900000, 2700000, 3380000),
    (downtown_id, '2024-08', 3200000, 3000000, 3180000);
    
    -- Green Valley cash flow
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (greenvalley_id, '2024-12', 1800000, 1650000, 2850000),
    (greenvalley_id, '2024-11', 2000000, 1820000, 2700000),
    (greenvalley_id, '2024-10', 2200000, 2100000, 2520000),
    (greenvalley_id, '2024-09', 1900000, 1750000, 2420000);
    
    -- ============================
    -- MONTHLY SPEND DATA
    -- ============================
    
    -- Downtown monthly spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (downtown_id, '2024-12', 2200000, 2180000, 2190000),
    (downtown_id, '2024-11', 2400000, 2450000, 2420000),
    (downtown_id, '2025-01', 2300000, 0, 2280000),
    (downtown_id, '2025-02', 2500000, 0, 2480000);
    
    -- Green Valley monthly spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (greenvalley_id, '2024-12', 1700000, 1650000, 1680000),
    (greenvalley_id, '2024-11', 1850000, 1820000, 1830000),
    (greenvalley_id, '2025-01', 1900000, 0, 1880000);
    
    -- ============================
    -- COMPLIANCE LOGS
    -- ============================
    
    -- Downtown compliance logs
    INSERT INTO division1_compliance_logs (project_id, section_id, action, performed_by, notes, metadata) VALUES
    (downtown_id, NULL, 'Monthly Compliance Review Completed', 'Tom Wilson', 'All sections reviewed, 3 items need attention', '{"review_date": "2024-12-28", "sections_reviewed": 9, "issues_found": 3}'),
    (downtown_id, NULL, 'City Inspector Site Visit', 'City Building Dept', 'Passed inspection with minor notes', '{"inspector": "J. Martinez", "result": "passed", "follow_up_required": true}'),
    (downtown_id, NULL, 'Quality Audit Performed', 'QC Specialists Inc', 'Overall compliance at 94%', '{"audit_type": "comprehensive", "score": 94, "recommendations": 5}');
    
    -- Green Valley compliance logs
    SELECT id INTO section_id FROM division1_sections WHERE project_id = greenvalley_id AND section_number = '01 31 00' LIMIT 1;
    INSERT INTO division1_compliance_logs (project_id, section_id, action, performed_by, notes, metadata) VALUES
    (greenvalley_id, section_id, 'BIM Coordination Meeting', 'David Lee', 'Resolved 12 clashes, 5 remaining', '{"meeting_date": "2024-12-27", "attendees": 8, "clashes_resolved": 12}'),
    (greenvalley_id, NULL, 'LEED Documentation Review', 'Green Building Consultants', 'On track for Platinum certification', '{"credits_earned": 82, "credits_pending": 12, "certification_level": "platinum"}');
    
    -- ============================
    -- AUDIT RESULTS
    -- ============================
    
    -- Downtown audit results
    INSERT INTO division1_audit_results (project_id, audit_date, overall_compliance_score, sections_compliant, total_sections, critical_issues, medium_issues, low_issues, auditor, summary, recommendations) VALUES
    (downtown_id, '2024-12-15', 94.5, 6, 9, 0, 2, 4, 'External Auditors LLC', 
     'Project shows excellent compliance with Division 1 requirements. Minor documentation gaps identified in sections 01 60 00 and 01 70 00.',
     ARRAY['Update product submittal tracking log', 'Implement weekly closeout planning meetings', 'Enhance subcontractor documentation requirements']),
    (downtown_id, '2024-11-15', 91.2, 5, 9, 1, 3, 3, 'External Auditors LLC',
     'Good progress since last audit. Critical issue with payment procedures resolved. Focus needed on quality requirements.',
     ARRAY['Expedite quality control procedure updates', 'Increase inspection frequency', 'Improve document version control']),
    (downtown_id, '2024-10-15', 88.0, 4, 9, 2, 4, 5, 'External Auditors LLC',
     'Several areas need attention. Payment procedures and quality requirements have critical gaps.',
     ARRAY['Immediate action on payment procedure documentation', 'Establish quality control checkpoints', 'Create comprehensive submittal schedule']);
    
    -- Green Valley audit results
    INSERT INTO division1_audit_results (project_id, audit_date, overall_compliance_score, sections_compliant, total_sections, critical_issues, medium_issues, low_issues, auditor, summary, recommendations) VALUES
    (greenvalley_id, '2024-12-01', 87.5, 3, 9, 1, 4, 3, 'Sustainability Auditors Inc',
     'Project maintaining good compliance despite complex LEED requirements. BIM coordination needs improvement.',
     ARRAY['Formalize BIM coordination procedures', 'Complete pending administrative requirements', 'Accelerate product submittal reviews']),
    (greenvalley_id, '2024-10-01', 82.3, 2, 9, 2, 5, 4, 'Sustainability Auditors Inc',
     'Early stage compliance acceptable. Need to establish more robust procedures as project progresses.',
     ARRAY['Develop comprehensive quality plan', 'Establish project coordination protocols', 'Create submittal workflow system']);
    
    -- Riverside audit results (planning phase)
    INSERT INTO division1_audit_results (project_id, audit_date, overall_compliance_score, sections_compliant, total_sections, critical_issues, medium_issues, low_issues, auditor, summary, recommendations) VALUES
    (riverside_id, '2024-12-01', 45.0, 0, 8, 3, 4, 1, 'Planning Review Associates',
     'Project in early planning phase. Division 1 documentation development in progress. Critical items must be addressed before construction start.',
     ARRAY['Complete Division 1 summary documentation', 'Establish payment procedures framework', 'Define quality requirements for luxury residential standards']);
    
    -- Re-enable RLS
    ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_audit_results ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend ENABLE ROW LEVEL SECURITY;
    
END $$;
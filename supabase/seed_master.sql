-- Master Seed Script for Development Environment
-- This script runs all seed files in the correct order to populate the database

-- First, clear existing data to ensure clean state
DO $$
BEGIN
    -- Disable RLS temporarily for all tables
    ALTER TABLE division1_audit_results DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_sections DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_integrations DISABLE ROW LEVEL SECURITY;
    ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
    
    -- Clear data in reverse dependency order
    DELETE FROM division1_audit_results;
    DELETE FROM division1_compliance_logs;
    DELETE FROM division1_attachments;
    DELETE FROM division1_issues;
    DELETE FROM division1_sections;
    DELETE FROM project_monthly_spend;
    DELETE FROM project_cash_flow;
    DELETE FROM project_transactions;
    DELETE FROM project_integrations;
    DELETE FROM projects;
    
    -- Re-enable RLS
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_integrations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_issues ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_attachments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_compliance_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_audit_results ENABLE ROW LEVEL SECURITY;
END $$;

-- Step 1: Run base project seed (creates initial 3 projects)
\i seed.sql

-- Step 2: Run extended projects seed (adds 6 more realistic projects)
\i seed_projects_extended.sql

-- Step 3: Run comprehensive Division 1 seed (adds Division 1 data for all projects)
\i seed_division1_comprehensive.sql

-- Step 4: Add project metrics and performance data if needed
-- \i seed_project_metrics.sql

-- Step 5: Add action items and other dashboard data
-- \i seed_action_items.sql

-- Final verification
DO $$
DECLARE
    project_count INTEGER;
    section_count INTEGER;
    issue_count INTEGER;
    transaction_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO project_count FROM projects;
    SELECT COUNT(*) INTO section_count FROM division1_sections;
    SELECT COUNT(*) INTO issue_count FROM division1_issues;
    SELECT COUNT(*) INTO transaction_count FROM project_transactions;
    
    RAISE NOTICE 'Seed completed successfully!';
    RAISE NOTICE 'Projects: %', project_count;
    RAISE NOTICE 'Division 1 Sections: %', section_count;
    RAISE NOTICE 'Division 1 Issues: %', issue_count;
    RAISE NOTICE 'Project Transactions: %', transaction_count;
END $$;
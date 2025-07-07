-- Complete database setup with all tables and unique project data
-- This script creates all necessary tables and populates them with realistic data

-- Create projects table first
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create all metric tables
CREATE TABLE IF NOT EXISTS project_executive_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    portfolio_value BIGINT,
    stakeholders INTEGER,
    risk_score DECIMAL(3,1),
    strategic_alignment DECIMAL(5,2),
    market_position DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_financial_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_budget BIGINT,
    spent_to_date BIGINT,
    forecasted_cost BIGINT,
    contingency_used BIGINT,
    contingency_remaining BIGINT,
    roi DECIMAL(5,2),
    npv BIGINT,
    irr DECIMAL(5,2),
    cost_per_sqft DECIMAL(8,2),
    market_value BIGINT,
    leasing_projections BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_construction_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    overall_progress DECIMAL(5,2),
    days_ahead_behind INTEGER,
    total_workforce INTEGER,
    active_subcontractors INTEGER,
    completed_milestones INTEGER,
    total_milestones INTEGER,
    quality_score INTEGER,
    safety_score INTEGER,
    open_rfis INTEGER,
    pending_submittals INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_design_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_progress DECIMAL(5,2),
    approved_drawings INTEGER,
    total_drawings INTEGER,
    revision_cycles INTEGER,
    stakeholder_approvals INTEGER,
    design_changes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_sustainability_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    leed_target VARCHAR(50),
    current_score INTEGER,
    energy_efficiency INTEGER,
    carbon_reduction INTEGER,
    sustainable_materials INTEGER,
    certifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_cash_flow (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month VARCHAR(7),
    inflow BIGINT,
    outflow BIGINT,
    cumulative BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_monthly_spend (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month VARCHAR(7),
    budget BIGINT,
    actual BIGINT,
    forecast BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    transaction_date DATE,
    description TEXT,
    vendor VARCHAR(255),
    amount BIGINT,
    category VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Division 1 specific tables
CREATE TABLE IF NOT EXISTS division1_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    section_number VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    due_date DATE,
    docs_on_file INTEGER DEFAULT 0,
    required_docs INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium',
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, section_number)
);

-- Insert projects with fixed UUIDs
DO $$
DECLARE
    downtown_office_id UUID := 'aa2e669f-c1e4-4da6-a705-c2fb776d64ec';
    downtown_mixed_id UUID := 'b063f9d1-b7a5-4642-8b6a-513ea1b024bd';
    green_valley_id UUID := 'ffe84c21-4d38-4571-bf87-e7dd92f78066';
    riverside_tower_id UUID := 'a9133200-b56f-47cf-be42-a501637b49f5';
BEGIN
    -- Clear existing data
    DELETE FROM project_executive_metrics;
    DELETE FROM project_financial_metrics;
    DELETE FROM project_construction_metrics;
    DELETE FROM project_design_metrics;
    DELETE FROM project_sustainability_metrics;
    DELETE FROM project_cash_flow;
    DELETE FROM project_monthly_spend;
    DELETE FROM project_transactions;
    DELETE FROM division1_sections;
    DELETE FROM projects;
    
    -- Insert projects
    INSERT INTO projects (id, name, description, status) VALUES
    (downtown_office_id, 'Downtown Office Building', 'Modern 24-story office complex in downtown business district', 'active'),
    (downtown_mixed_id, 'Downtown Mixed-Use Development', 'Mixed-use development with retail, office, and residential components', 'active'),
    (green_valley_id, 'Green Valley Office Complex', 'Sustainable office campus with LEED Platinum certification target', 'active'),
    (riverside_tower_id, 'Riverside Residential Tower', '45-story luxury residential tower with river views', 'active');
    
    -- ============ DOWNTOWN OFFICE BUILDING DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
    (downtown_office_id, 45000000, 48, 2.1, 94.5, 87.2);
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
    (downtown_office_id, 45000000, 32400000, 46800000, 750000, 2250000, 12.5, 8500000, 15.2, 425.00, 52000000, 3800000);
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
    (downtown_office_id, 72.0, 5, 48, 12, 68, 100, 87, 94, 12, 8);
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
    (downtown_office_id, 95.0, 156, 164, 23, 89, 23);
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
    (downtown_office_id, 'LEED Gold', 85, 92, 35, 67, ARRAY['LEED Gold Target']);
    
    -- Cash Flow Data
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (downtown_office_id, '2024-11', 4200000, 3850000, 350000),
    (downtown_office_id, '2024-12', 3800000, 4100000, 50000),
    (downtown_office_id, '2025-01', 4500000, 3900000, 650000);
    
    -- Monthly Spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (downtown_office_id, '2024-11', 4000000, 3850000, 3900000),
    (downtown_office_id, '2024-12', 4200000, 4100000, 4150000),
    (downtown_office_id, '2025-01', 4300000, 3900000, 4050000);
    
    -- ============ DOWNTOWN MIXED-USE DEVELOPMENT DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
    (downtown_mixed_id, 125000000, 85, 3.8, 89.2, 92.5);
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
    (downtown_mixed_id, 125000000, 68750000, 129750000, 4750000, 6250000, 18.2, 24500000, 22.8, 485.00, 156000000, 12800000);
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
    (downtown_mixed_id, 55.0, -1, 85, 18, 52, 100, 89, 91, 28, 23);
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
    (downtown_mixed_id, 88.0, 245, 268, 67, 78, 67);
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
    (downtown_mixed_id, 'LEED Platinum', 92, 95, 42, 78, ARRAY['LEED Platinum Target', 'BREEAM Excellent']);
    
    -- Cash Flow Data
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (downtown_mixed_id, '2024-11', 11500000, 10200000, 1300000),
    (downtown_mixed_id, '2024-12', 9800000, 11500000, -400000),
    (downtown_mixed_id, '2025-01', 12200000, 10800000, 1000000);
    
    -- Monthly Spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (downtown_mixed_id, '2024-11', 10500000, 10200000, 10350000),
    (downtown_mixed_id, '2024-12', 11200000, 11500000, 11350000),
    (downtown_mixed_id, '2025-01', 11000000, 10800000, 10900000);
    
    -- ============ GREEN VALLEY OFFICE COMPLEX DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
    (green_valley_id, 78000000, 62, 1.5, 96.8, 94.2);
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
    (green_valley_id, 78000000, 31200000, 76830000, 1830000, 3900000, 16.8, 18200000, 19.5, 395.00, 95000000, 8600000);
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
    (green_valley_id, 40.0, 3, 62, 14, 38, 95, 92, 96, 18, 12);
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
    (green_valley_id, 92.0, 198, 210, 34, 85, 34);
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
    (green_valley_id, 'LEED Platinum', 96, 98, 55, 85, ARRAY['LEED Platinum', 'ENERGY STAR']);
    
    -- Cash Flow Data
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (green_valley_id, '2024-11', 7200000, 6800000, 400000),
    (green_valley_id, '2024-12', 6500000, 7200000, -300000),
    (green_valley_id, '2025-01', 8000000, 6900000, 800000);
    
    -- Monthly Spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (green_valley_id, '2024-11', 7000000, 6800000, 6900000),
    (green_valley_id, '2024-12', 7300000, 7200000, 7250000),
    (green_valley_id, '2025-01', 7100000, 6900000, 7000000);
    
    -- ============ RIVERSIDE RESIDENTIAL TOWER DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
    (riverside_tower_id, 89000000, 35, 0.8, 88.5, 82.1);
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
    (riverside_tower_id, 89000000, 12460000, 89712000, 712000, 4450000, 14.2, 15800000, 17.5, 465.00, 112000000, 9800000);
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
    (riverside_tower_id, 14.0, -4, 35, 8, 15, 105, 94, 98, 8, 6);
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
    (riverside_tower_id, 78.0, 124, 152, 18, 65, 18);
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
    (riverside_tower_id, 'LEED Silver', 78, 85, 28, 58, ARRAY['LEED Silver Target']);
    
    -- Cash Flow Data
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (riverside_tower_id, '2024-11', 8200000, 7800000, 400000),
    (riverside_tower_id, '2024-12', 7500000, 8200000, -300000),
    (riverside_tower_id, '2025-01', 9000000, 8100000, 600000);
    
    -- Monthly Spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (riverside_tower_id, '2024-11', 8000000, 7800000, 7900000),
    (riverside_tower_id, '2024-12', 8300000, 8200000, 8250000),
    (riverside_tower_id, '2025-01', 8100000, 8100000, 8100000);
    
    -- ============ DIVISION 1 DATA FOR RIVERSIDE TOWER ============
    
    -- Division 1 Sections for Riverside Tower (the project with Division 1 data)
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (riverside_tower_id, '01 10 00', 'Summary', 'completed', '2024-12-15', 8, 8, 'high', 100.0),
    (riverside_tower_id, '01 20 00', 'Price and Payment Procedures', 'in_progress', '2025-01-30', 12, 15, 'high', 80.0),
    (riverside_tower_id, '01 30 00', 'Administrative Requirements', 'in_progress', '2025-01-15', 18, 22, 'medium', 81.8),
    (riverside_tower_id, '01 40 00', 'Quality Requirements', 'pending', '2025-02-15', 5, 12, 'high', 41.7),
    (riverside_tower_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2024-12-01', 14, 14, 'medium', 100.0),
    (riverside_tower_id, '01 60 00', 'Product Requirements', 'in_progress', '2025-01-20', 9, 16, 'medium', 56.3),
    (riverside_tower_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2025-03-01', 3, 18, 'high', 16.7),
    (riverside_tower_id, '01 80 00', 'Performance Requirements', 'pending', '2025-02-28', 2, 10, 'medium', 20.0);
    
    -- Division 1 Transactions for Riverside Tower
    INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
    (riverside_tower_id, '2024-12-15', 'Division 1 Initial Contract Payment', 'Turner Construction', 500000, 'Payment', 'Completed'),
    (riverside_tower_id, '2024-12-20', 'Division 1 Progress Billing #1', 'General Contractor', 750000, 'Billing', 'Completed'),
    (riverside_tower_id, '2024-12-25', 'Division 1 Steel Supplier Payment', 'ABC Steel Corp', -250000, 'Payment', 'Pending'),
    (riverside_tower_id, '2024-12-28', 'Division 1 Progress Billing #2', 'General Contractor', 500000, 'Billing', 'Completed'),
    (riverside_tower_id, '2024-12-30', 'Division 1 Consultant Fee', 'XYZ Engineering', -150000, 'Payment', 'Completed'),
    (riverside_tower_id, '2025-01-01', 'Division 1 Admin Fee', 'Project Management', 75000, 'Fee', 'Pending');
    
END $$;

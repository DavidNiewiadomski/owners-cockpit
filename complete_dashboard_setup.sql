-- Complete Dashboard Setup SQL Script
-- Run this entire script in the Supabase SQL Editor

-- First, let's check if projects table exists and create it if needed
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_financial_metrics table
CREATE TABLE IF NOT EXISTS project_financial_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_budget DECIMAL(15, 2),
    spent_to_date DECIMAL(15, 2),
    forecasted_cost DECIMAL(15, 2),
    contingency_used DECIMAL(15, 2),
    contingency_remaining DECIMAL(15, 2),
    roi NUMERIC,
    npv DECIMAL(15, 2),
    irr NUMERIC,
    cost_per_sqft DECIMAL(15, 2),
    market_value DECIMAL(15, 2),
    leasing_projections DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_construction_metrics table
CREATE TABLE IF NOT EXISTS project_construction_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    overall_progress NUMERIC,
    days_ahead_behind INTEGER,
    total_workforce INTEGER,
    active_subcontractors INTEGER,
    completed_milestones INTEGER,
    total_milestones INTEGER,
    quality_score NUMERIC,
    safety_score NUMERIC,
    open_rfis INTEGER,
    pending_submittals INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_executive_metrics table
CREATE TABLE IF NOT EXISTS project_executive_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    portfolio_value DECIMAL(15, 2),
    stakeholders INTEGER,
    risk_score NUMERIC,
    strategic_alignment NUMERIC,
    market_position NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_design_metrics table
CREATE TABLE IF NOT EXISTS project_design_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_progress NUMERIC,
    approved_drawings INTEGER,
    total_drawings INTEGER,
    revision_cycles INTEGER,
    stakeholder_approvals INTEGER,
    design_changes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_legal_metrics table
CREATE TABLE IF NOT EXISTS project_legal_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contracts_active INTEGER,
    contracts_pending INTEGER,
    compliance_score NUMERIC,
    permit_status VARCHAR(255),
    legal_risks INTEGER,
    documentation_complete INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_planning_metrics table
CREATE TABLE IF NOT EXISTS project_planning_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    master_plan_approval NUMERIC,
    zoning_compliance NUMERIC,
    community_engagement NUMERIC,
    regulatory_approvals NUMERIC,
    feasibility_complete NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_preconstruction_metrics table
CREATE TABLE IF NOT EXISTS project_preconstruction_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_development NUMERIC,
    bidding_progress NUMERIC,
    contractor_selection NUMERIC,
    permit_submissions NUMERIC,
    value_engineering NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_sustainability_metrics table
CREATE TABLE IF NOT EXISTS project_sustainability_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    leed_target VARCHAR(50),
    current_score NUMERIC,
    energy_efficiency NUMERIC,
    carbon_reduction NUMERIC,
    sustainable_materials NUMERIC,
    certifications TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create project_facilities_metrics table
CREATE TABLE IF NOT EXISTS project_facilities_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    operational_readiness NUMERIC,
    systems_commissioned INTEGER,
    maintenance_planned NUMERIC,
    energy_performance NUMERIC,
    occupancy_readiness NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Create construction_daily_progress table
CREATE TABLE IF NOT EXISTS construction_daily_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    planned_progress DECIMAL(5,2) NOT NULL,
    actual_progress DECIMAL(5,2) NOT NULL,
    workforce_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, date)
);

-- Create construction_trade_progress table
CREATE TABLE IF NOT EXISTS construction_trade_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    floor_level VARCHAR(50) NOT NULL,
    structural_progress DECIMAL(5,2) NOT NULL,
    mechanical_progress DECIMAL(5,2) NOT NULL,
    electrical_progress DECIMAL(5,2) NOT NULL,
    plumbing_progress DECIMAL(5,2) NOT NULL,
    finishes_progress DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, floor_level)
);

-- Create construction_activities table
CREATE TABLE IF NOT EXISTS construction_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    trade VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    activity_date DATE NOT NULL,
    crew_name VARCHAR(100) NOT NULL,
    duration_hours INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create construction_quality_metrics table
CREATE TABLE IF NOT EXISTS construction_quality_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    week_ending DATE NOT NULL,
    quality_score DECIMAL(5,2) NOT NULL,
    rework_items INTEGER NOT NULL,
    inspection_pass_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, week_ending)
);

-- Create material_deliveries table
CREATE TABLE IF NOT EXISTS material_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    material_name VARCHAR(255) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    cost DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create safety_metrics table
CREATE TABLE IF NOT EXISTS safety_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    recordable_days INTEGER NOT NULL,
    total_incidents INTEGER NOT NULL,
    near_misses INTEGER NOT NULL,
    safety_training_hours INTEGER NOT NULL,
    compliance_score DECIMAL(5,2) NOT NULL,
    osha_rating VARCHAR(50) NOT NULL,
    last_incident_date DATE,
    active_safety_programs INTEGER NOT NULL,
    monthly_inspections INTEGER NOT NULL,
    corrective_actions INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id)
);

-- Create safety_incidents table
CREATE TABLE IF NOT EXISTS safety_incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    corrective_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create safety_training table
CREATE TABLE IF NOT EXISTS safety_training (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    program_name VARCHAR(255) NOT NULL,
    completed_count INTEGER NOT NULL,
    required_count INTEGER NOT NULL,
    deadline DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, program_name)
);

-- Create additional tables for financial and other metrics
CREATE TABLE IF NOT EXISTS project_monthly_spend (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    budget DECIMAL(15, 2),
    actual DECIMAL(15, 2),
    forecast DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, month)
);

CREATE TABLE IF NOT EXISTS project_cash_flow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    inflow DECIMAL(15, 2),
    outflow DECIMAL(15, 2),
    cumulative DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, month)
);

CREATE TABLE IF NOT EXISTS project_cost_breakdown (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2),
    percentage NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, category)
);

CREATE TABLE IF NOT EXISTS project_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    vendor VARCHAR(255),
    amount DECIMAL(15, 2),
    category VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample projects
INSERT INTO projects (id, name, owner_id, status) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Downtown Office Building', '123e4567-e89b-12d3-a456-426614174000', 'active'),
    ('123e4567-e89b-12d3-a456-426614174001', 'Residential Complex Phase 1', '123e4567-e89b-12d3-a456-426614174000', 'active'),
    ('123e4567-e89b-12d3-a456-426614174002', 'Highway Bridge Renovation', '123e4567-e89b-12d3-a456-426614174000', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert financial metrics
INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 75000000, 51375000, 73800000, 2800000, 1200000, 16.8, 8500000, 14.2, 450, 95000000, 12000000),
    ('123e4567-e89b-12d3-a456-426614174001', 45000000, 21915000, 44200000, 800000, 1200000, 14.2, 5200000, 12.8, 320, 58000000, 7800000),
    ('123e4567-e89b-12d3-a456-426614174002', 25000000, 21375000, 24600000, 400000, 600000, 18.5, 3100000, 16.4, 280, 32000000, 4200000)
ON CONFLICT (project_id) DO UPDATE SET
    total_budget = EXCLUDED.total_budget,
    spent_to_date = EXCLUDED.spent_to_date,
    forecasted_cost = EXCLUDED.forecasted_cost,
    contingency_used = EXCLUDED.contingency_used,
    contingency_remaining = EXCLUDED.contingency_remaining,
    roi = EXCLUDED.roi,
    npv = EXCLUDED.npv,
    irr = EXCLUDED.irr,
    cost_per_sqft = EXCLUDED.cost_per_sqft,
    market_value = EXCLUDED.market_value,
    leasing_projections = EXCLUDED.leasing_projections;

-- Insert construction metrics
INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 68.5, -5, 150, 12, 8, 12, 94.2, 98.5, 15, 8),
    ('123e4567-e89b-12d3-a456-426614174001', 45.2, 8, 120, 8, 5, 10, 91.8, 97.2, 12, 5),
    ('123e4567-e89b-12d3-a456-426614174002', 82.1, -12, 95, 6, 9, 10, 96.5, 99.1, 8, 3)
ON CONFLICT (project_id) DO UPDATE SET
    overall_progress = EXCLUDED.overall_progress,
    days_ahead_behind = EXCLUDED.days_ahead_behind,
    total_workforce = EXCLUDED.total_workforce,
    active_subcontractors = EXCLUDED.active_subcontractors,
    completed_milestones = EXCLUDED.completed_milestones,
    total_milestones = EXCLUDED.total_milestones,
    quality_score = EXCLUDED.quality_score,
    safety_score = EXCLUDED.safety_score,
    open_rfis = EXCLUDED.open_rfis,
    pending_submittals = EXCLUDED.pending_submittals;

-- Insert executive metrics
INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 95000000, 25, 2.3, 94.5, 87.8),
    ('123e4567-e89b-12d3-a456-426614174001', 58000000, 18, 3.1, 91.2, 82.4),
    ('123e4567-e89b-12d3-a456-426614174002', 32000000, 12, 1.8, 96.7, 89.3)
ON CONFLICT (project_id) DO UPDATE SET
    portfolio_value = EXCLUDED.portfolio_value,
    stakeholders = EXCLUDED.stakeholders,
    risk_score = EXCLUDED.risk_score,
    strategic_alignment = EXCLUDED.strategic_alignment,
    market_position = EXCLUDED.market_position;

-- Insert design metrics
INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 95.5, 185, 195, 3, 22, 8),
    ('123e4567-e89b-12d3-a456-426614174001', 88.2, 145, 165, 2, 18, 5),
    ('123e4567-e89b-12d3-a456-426614174002', 100.0, 85, 85, 1, 12, 2)
ON CONFLICT (project_id) DO UPDATE SET
    design_progress = EXCLUDED.design_progress,
    approved_drawings = EXCLUDED.approved_drawings,
    total_drawings = EXCLUDED.total_drawings,
    revision_cycles = EXCLUDED.revision_cycles,
    stakeholder_approvals = EXCLUDED.stakeholder_approvals,
    design_changes = EXCLUDED.design_changes;

-- Insert legal metrics
INSERT INTO project_legal_metrics (project_id, contracts_active, contracts_pending, compliance_score, permit_status, legal_risks, documentation_complete) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 15, 3, 96.8, 'Approved', 2, 95),
    ('123e4567-e89b-12d3-a456-426614174001', 12, 5, 94.2, 'In Review', 3, 88),
    ('123e4567-e89b-12d3-a456-426614174002', 8, 1, 98.5, 'Approved', 1, 98)
ON CONFLICT (project_id) DO UPDATE SET
    contracts_active = EXCLUDED.contracts_active,
    contracts_pending = EXCLUDED.contracts_pending,
    compliance_score = EXCLUDED.compliance_score,
    permit_status = EXCLUDED.permit_status,
    legal_risks = EXCLUDED.legal_risks,
    documentation_complete = EXCLUDED.documentation_complete;

-- Insert planning metrics
INSERT INTO project_planning_metrics (project_id, master_plan_approval, zoning_compliance, community_engagement, regulatory_approvals, feasibility_complete) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 100.0, 100.0, 85.5, 92.3, 100.0),
    ('123e4567-e89b-12d3-a456-426614174001', 95.8, 98.2, 78.9, 88.7, 100.0),
    ('123e4567-e89b-12d3-a456-426614174002', 100.0, 100.0, 92.1, 96.8, 100.0)
ON CONFLICT (project_id) DO UPDATE SET
    master_plan_approval = EXCLUDED.master_plan_approval,
    zoning_compliance = EXCLUDED.zoning_compliance,
    community_engagement = EXCLUDED.community_engagement,
    regulatory_approvals = EXCLUDED.regulatory_approvals,
    feasibility_complete = EXCLUDED.feasibility_complete;

-- Insert preconstruction metrics
INSERT INTO project_preconstruction_metrics (project_id, design_development, bidding_progress, contractor_selection, permit_submissions, value_engineering) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 100.0, 100.0, 100.0, 95.8, 88.5),
    ('123e4567-e89b-12d3-a456-426614174001', 95.2, 88.7, 92.4, 85.3, 78.9),
    ('123e4567-e89b-12d3-a456-426614174002', 100.0, 100.0, 100.0, 100.0, 92.1)
ON CONFLICT (project_id) DO UPDATE SET
    design_development = EXCLUDED.design_development,
    bidding_progress = EXCLUDED.bidding_progress,
    contractor_selection = EXCLUDED.contractor_selection,
    permit_submissions = EXCLUDED.permit_submissions,
    value_engineering = EXCLUDED.value_engineering;

-- Insert sustainability metrics
INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'LEED Gold', 82, 94.5, 35.8, 68.9, ARRAY['LEED Gold', 'Energy Star']),
    ('123e4567-e89b-12d3-a456-426614174001', 'LEED Silver', 76, 89.2, 28.4, 62.5, ARRAY['LEED Silver']),
    ('123e4567-e89b-12d3-a456-426614174002', 'LEED Platinum', 88, 96.8, 45.2, 75.3, ARRAY['LEED Platinum', 'Green Building'])
ON CONFLICT (project_id) DO UPDATE SET
    leed_target = EXCLUDED.leed_target,
    current_score = EXCLUDED.current_score,
    energy_efficiency = EXCLUDED.energy_efficiency,
    carbon_reduction = EXCLUDED.carbon_reduction,
    sustainable_materials = EXCLUDED.sustainable_materials,
    certifications = EXCLUDED.certifications;

-- Insert facilities metrics
INSERT INTO project_facilities_metrics (project_id, operational_readiness, systems_commissioned, maintenance_planned, energy_performance, occupancy_readiness) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 75.8, 8, 85.2, 92.4, 68.9),
    ('123e4567-e89b-12d3-a456-426614174001', 45.3, 3, 62.7, 78.9, 42.1),
    ('123e4567-e89b-12d3-a456-426614174002', 88.7, 12, 95.8, 96.3, 85.4)
ON CONFLICT (project_id) DO UPDATE SET
    operational_readiness = EXCLUDED.operational_readiness,
    systems_commissioned = EXCLUDED.systems_commissioned,
    maintenance_planned = EXCLUDED.maintenance_planned,
    energy_performance = EXCLUDED.energy_performance,
    occupancy_readiness = EXCLUDED.occupancy_readiness;

-- Insert construction daily progress
INSERT INTO construction_daily_progress (project_id, date, planned_progress, actual_progress, workforce_count) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-21', 68.0, 68.5, 150),
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-22', 68.5, 69.1, 148),
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-23', 69.0, 69.3, 152),
    ('123e4567-e89b-12d3-a456-426614174001', '2024-06-21', 44.5, 45.2, 120),
    ('123e4567-e89b-12d3-a456-426614174001', '2024-06-22', 45.0, 45.8, 118),
    ('123e4567-e89b-12d3-a456-426614174002', '2024-06-21', 81.5, 82.1, 95),
    ('123e4567-e89b-12d3-a456-426614174002', '2024-06-22', 82.0, 82.8, 93)
ON CONFLICT (project_id, date) DO UPDATE SET
    planned_progress = EXCLUDED.planned_progress,
    actual_progress = EXCLUDED.actual_progress,
    workforce_count = EXCLUDED.workforce_count;

-- Insert construction trade progress
INSERT INTO construction_trade_progress (project_id, floor_level, structural_progress, mechanical_progress, electrical_progress, plumbing_progress, finishes_progress) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Ground Floor', 100.0, 95.5, 92.8, 88.7, 85.2),
    ('123e4567-e89b-12d3-a456-426614174000', 'Floor 2', 98.5, 88.2, 85.6, 82.3, 75.8),
    ('123e4567-e89b-12d3-a456-426614174000', 'Floor 3', 95.2, 78.9, 75.4, 72.1, 58.6),
    ('123e4567-e89b-12d3-a456-426614174001', 'Building A', 85.7, 72.4, 68.9, 65.3, 42.8),
    ('123e4567-e89b-12d3-a456-426614174001', 'Building B', 78.9, 65.2, 58.7, 55.4, 38.9),
    ('123e4567-e89b-12d3-a456-426614174002', 'Deck Level', 95.8, 92.3, 89.7, 88.2, 85.6)
ON CONFLICT (project_id, floor_level) DO UPDATE SET
    structural_progress = EXCLUDED.structural_progress,
    mechanical_progress = EXCLUDED.mechanical_progress,
    electrical_progress = EXCLUDED.electrical_progress,
    plumbing_progress = EXCLUDED.plumbing_progress,
    finishes_progress = EXCLUDED.finishes_progress;

-- Insert construction activities
INSERT INTO construction_activities (project_id, activity_name, trade, status, activity_date, crew_name, duration_hours, notes) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Concrete Pour - Floor 3', 'Concrete', 'completed', '2024-06-21', 'Alpha Concrete Crew', 8, 'Successfully completed 3rd floor concrete pour'),
    ('123e4567-e89b-12d3-a456-426614174000', 'HVAC Installation - Floor 2', 'Mechanical', 'in-progress', '2024-06-22', 'HVAC Team 1', 10, 'Installing ductwork and equipment'),
    ('123e4567-e89b-12d3-a456-426614174000', 'Electrical Rough-in - Floor 3', 'Electrical', 'scheduled', '2024-06-24', 'Electric Crew A', 12, 'Rough electrical work scheduled'),
    ('123e4567-e89b-12d3-a456-426614174001', 'Foundation Work - Building B', 'Concrete', 'in-progress', '2024-06-22', 'Foundation Team', 16, 'Foundation work progressing well'),
    ('123e4567-e89b-12d3-a456-426614174002', 'Bridge Deck Finishing', 'Concrete', 'completed', '2024-06-21', 'Bridge Crew', 12, 'Deck finishing completed successfully');

-- Insert construction quality metrics
INSERT INTO construction_quality_metrics (project_id, week_ending, quality_score, rework_items, inspection_pass_rate) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-21', 94.2, 3, 96.8),
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-14', 93.8, 4, 95.2),
    ('123e4567-e89b-12d3-a456-426614174001', '2024-06-21', 91.8, 5, 94.5),
    ('123e4567-e89b-12d3-a456-426614174002', '2024-06-21', 96.5, 1, 98.7)
ON CONFLICT (project_id, week_ending) DO UPDATE SET
    quality_score = EXCLUDED.quality_score,
    rework_items = EXCLUDED.rework_items,
    inspection_pass_rate = EXCLUDED.inspection_pass_rate;

-- Insert material deliveries
INSERT INTO material_deliveries (project_id, material_name, supplier, scheduled_date, status, quantity, cost) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Steel Beams', 'MetalWorks Inc', '2024-06-28', 'scheduled', '50 beams', 125000.00),
    ('123e4567-e89b-12d3-a456-426614174000', 'Concrete Mix', 'ConcreteMax', '2024-06-25', 'confirmed', '200 cubic yards', 45000.00),
    ('123e4567-e89b-12d3-a456-426614174001', 'Lumber Package', 'WoodSource LLC', '2024-06-26', 'in-transit', '5000 board feet', 35000.00),
    ('123e4567-e89b-12d3-a456-426614174002', 'Asphalt Mix', 'Highway Materials', '2024-06-24', 'delivered', '150 tons', 28000.00);

-- Insert safety metrics
INSERT INTO safety_metrics (project_id, recordable_days, total_incidents, near_misses, safety_training_hours, compliance_score, osha_rating, last_incident_date, active_safety_programs, monthly_inspections, corrective_actions) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 45, 2, 8, 1240, 98.5, 'Excellent', '2024-05-15', 6, 28, 3),
    ('123e4567-e89b-12d3-a456-426614174001', 62, 1, 5, 896, 97.2, 'Excellent', '2024-04-20', 5, 22, 2),
    ('123e4567-e89b-12d3-a456-426614174002', 180, 0, 3, 1680, 99.1, 'Outstanding', NULL, 8, 35, 1)
ON CONFLICT (project_id) DO UPDATE SET
    recordable_days = EXCLUDED.recordable_days,
    total_incidents = EXCLUDED.total_incidents,
    near_misses = EXCLUDED.near_misses,
    safety_training_hours = EXCLUDED.safety_training_hours,
    compliance_score = EXCLUDED.compliance_score,
    osha_rating = EXCLUDED.osha_rating,
    last_incident_date = EXCLUDED.last_incident_date,
    active_safety_programs = EXCLUDED.active_safety_programs,
    monthly_inspections = EXCLUDED.monthly_inspections,
    corrective_actions = EXCLUDED.corrective_actions;

-- Insert safety incidents
INSERT INTO safety_incidents (project_id, incident_type, description, incident_date, severity, status, corrective_action) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Near Miss', 'Worker nearly struck by falling tool', '2024-06-15', 'Low', 'Closed', 'Implemented tool tethering requirements'),
    ('123e4567-e89b-12d3-a456-426614174000', 'Minor Injury', 'Worker cut hand on metal edge', '2024-05-15', 'Low', 'Closed', 'Enhanced safety training and PPE requirements'),
    ('123e4567-e89b-12d3-a456-426614174001', 'Near Miss', 'Equipment almost hit worker', '2024-04-20', 'Medium', 'Closed', 'Improved communication protocols');

-- Insert safety training
INSERT INTO safety_training (project_id, program_name, completed_count, required_count, deadline) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'OSHA 30-Hour Construction', 142, 150, '2024-07-15'),
    ('123e4567-e89b-12d3-a456-426614174000', 'Fall Protection', 150, 150, '2024-06-30'),
    ('123e4567-e89b-12d3-a456-426614174001', 'OSHA 10-Hour Construction', 115, 120, '2024-07-01'),
    ('123e4567-e89b-12d3-a456-426614174002', 'Traffic Control', 95, 95, '2024-06-25')
ON CONFLICT (project_id, program_name) DO UPDATE SET
    completed_count = EXCLUDED.completed_count,
    required_count = EXCLUDED.required_count,
    deadline = EXCLUDED.deadline;

-- Insert monthly spend data
INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Jan 2024', 5000000, 4850000, 4950000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Feb 2024', 6000000, 5950000, 6100000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Mar 2024', 5500000, 5320000, 5400000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Apr 2024', 6500000, 6780000, 6600000),
    ('123e4567-e89b-12d3-a456-426614174000', 'May 2024', 7000000, 6890000, 7050000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Jun 2024', 7200000, 7100000, 7150000)
ON CONFLICT (project_id, month) DO UPDATE SET
    budget = EXCLUDED.budget,
    actual = EXCLUDED.actual,
    forecast = EXCLUDED.forecast;

-- Insert cash flow data
INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Jan 2024', 8000000, 4850000, 3150000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Feb 2024', 6000000, 5950000, 3200000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Mar 2024', 5500000, 5320000, 3380000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Apr 2024', 7000000, 6780000, 3600000),
    ('123e4567-e89b-12d3-a456-426614174000', 'May 2024', 7500000, 6890000, 4210000),
    ('123e4567-e89b-12d3-a456-426614174000', 'Jun 2024', 7200000, 7100000, 4310000)
ON CONFLICT (project_id, month) DO UPDATE SET
    inflow = EXCLUDED.inflow,
    outflow = EXCLUDED.outflow,
    cumulative = EXCLUDED.cumulative;

-- Insert cost breakdown
INSERT INTO project_cost_breakdown (project_id, category, amount, percentage) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', 'Construction', 45000000, 60.0),
    ('123e4567-e89b-12d3-a456-426614174000', 'Materials', 18000000, 24.0),
    ('123e4567-e89b-12d3-a456-426614174000', 'Labor', 9000000, 12.0),
    ('123e4567-e89b-12d3-a456-426614174000', 'Equipment', 3000000, 4.0)
ON CONFLICT (project_id, category) DO UPDATE SET
    amount = EXCLUDED.amount,
    percentage = EXCLUDED.percentage;

-- Insert recent transactions
INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES 
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-21', 'Steel beam delivery', 'MetalWorks Inc', 125000.00, 'Materials', 'Approved'),
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-20', 'Concrete pour - Floor 3', 'ConcreteMax', 45000.00, 'Construction', 'Paid'),
    ('123e4567-e89b-12d3-a456-426614174000', '2024-06-19', 'HVAC equipment', 'Climate Systems', 89000.00, 'MEP', 'Processing'),
    ('123e4567-e89b-12d3-a456-426614174001', '2024-06-18', 'Lumber package', 'WoodSource LLC', 35000.00, 'Materials', 'Approved');

-- Disable RLS on all tables for demo purposes (IMPORTANT: Only for development/demo)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_financial_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_construction_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_executive_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_design_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_legal_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_planning_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_preconstruction_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_sustainability_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_facilities_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE construction_daily_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE construction_trade_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE construction_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE construction_quality_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_deliveries DISABLE ROW LEVEL SECURITY;
ALTER TABLE safety_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE safety_incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE safety_training DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_monthly_spend DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_cash_flow DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_cost_breakdown DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_transactions DISABLE ROW LEVEL SECURITY;

-- Grant public access for demo purposes (IMPORTANT: Only for development/demo)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Comprehensive enterprise-grade seed data for Building Owner's Cockpit
-- This migration creates realistic data for all dashboards to simulate a live enterprise system

-- First, ensure we have the required tables
CREATE TABLE IF NOT EXISTS construction_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    completion_percentage NUMERIC,
    budget_utilized NUMERIC,
    schedule_variance INTEGER,
    quality_score NUMERIC,
    safety_incidents INTEGER,
    active_trades INTEGER,
    weather_delays INTEGER,
    material_delays INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS safety_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    days_without_incident INTEGER,
    total_incidents INTEGER,
    near_misses INTEGER,
    safety_training_hours INTEGER,
    ppe_compliance NUMERIC,
    safety_inspections INTEGER,
    violations INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sustainability_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    leed_score INTEGER,
    energy_efficiency NUMERIC,
    water_usage_reduction NUMERIC,
    waste_diverted NUMERIC,
    carbon_footprint NUMERIC,
    renewable_energy NUMERIC,
    green_materials NUMERIC,
    indoor_air_quality NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_budget NUMERIC,
    spent_to_date NUMERIC,
    committed_costs NUMERIC,
    projected_final_cost NUMERIC,
    cost_variance NUMERIC,
    cash_flow NUMERIC,
    contingency_used NUMERIC,
    roi_projection NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    planned_date DATE,
    actual_date DATE,
    status VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    risk_category VARCHAR(100),
    risk_description TEXT,
    probability VARCHAR(20),
    impact VARCHAR(20),
    mitigation_strategy TEXT,
    owner VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100),
    version VARCHAR(20),
    status VARCHAR(50),
    upload_date DATE,
    file_size INTEGER,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quality_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    inspection_type VARCHAR(100),
    inspection_date DATE,
    inspector_name VARCHAR(100),
    status VARCHAR(50),
    defects_found INTEGER,
    defects_resolved INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clear existing data and start fresh
DELETE FROM construction_metrics;
DELETE FROM safety_metrics;
DELETE FROM sustainability_metrics;
DELETE FROM financial_metrics;
DELETE FROM project_milestones;
DELETE FROM project_risks;
DELETE FROM project_documents;
DELETE FROM quality_control;

-- Insert comprehensive construction metrics
INSERT INTO construction_metrics (project_id, completion_percentage, budget_utilized, schedule_variance, quality_score, safety_incidents, active_trades, weather_delays, material_delays) VALUES
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 68.5, 72.3, -5, 94.2, 2, 12, 3, 1),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 45.2, 48.7, 8, 91.8, 1, 8, 2, 3),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 82.1, 85.4, -12, 96.5, 0, 6, 1, 0);

-- Insert safety metrics
INSERT INTO safety_metrics (project_id, days_without_incident, total_incidents, near_misses, safety_training_hours, ppe_compliance, safety_inspections, violations) VALUES
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 45, 2, 8, 1240, 98.5, 28, 1),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 62, 1, 5, 896, 97.2, 22, 0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 180, 0, 3, 1680, 99.1, 35, 0);

-- Insert sustainability metrics
INSERT INTO sustainability_metrics (project_id, leed_score, energy_efficiency, water_usage_reduction, waste_diverted, carbon_footprint, renewable_energy, green_materials, indoor_air_quality) VALUES
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 82, 94.5, 35.8, 78.2, 125.6, 42.3, 68.9, 91.4),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 76, 89.2, 28.4, 72.1, 98.3, 38.7, 62.5, 88.6),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 88, 96.8, 45.2, 85.4, 89.7, 52.1, 75.3, 93.2);

-- Insert financial metrics
INSERT INTO financial_metrics (project_id, total_budget, spent_to_date, committed_costs, projected_final_cost, cost_variance, cash_flow, contingency_used, roi_projection) VALUES
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 75000000, 51375000, 8250000, 73800000, -1200000, 2850000, 2800000, 16.8),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 45000000, 21915000, 5400000, 44200000, -800000, 1920000, 800000, 14.2),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 25000000, 21375000, 2100000, 24600000, -400000, 1650000, 400000, 18.5);

-- Insert project milestones
INSERT INTO project_milestones (project_id, milestone_name, planned_date, actual_date, status, description) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Foundation Complete', '2024-03-15', '2024-03-12', 'completed', 'Foundation and basement structure completed'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Structure Topped Out', '2024-06-30', '2024-06-28', 'completed', 'Main structural framework completed'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'MEP Rough-In', '2024-09-15', NULL, 'in-progress', 'Mechanical, electrical, and plumbing rough-in'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Exterior Envelope', '2024-10-30', NULL, 'pending', 'Curtain wall and exterior systems'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Interior Finishes', '2024-11-30', NULL, 'pending', 'Interior finishes and fixtures'),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Site Preparation', '2024-02-01', '2024-02-03', 'completed', 'Site clearing and preparation'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Foundation Pour', '2024-04-15', '2024-04-18', 'completed', 'Foundation systems completed'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Framing Complete', '2024-07-30', NULL, 'in-progress', 'Structural framing for all buildings'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Roofing Systems', '2024-09-15', NULL, 'pending', 'Roofing and waterproofing'),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Traffic Plan Implementation', '2024-01-15', '2024-01-12', 'completed', 'Traffic management plan activated'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Demolition Phase', '2024-02-28', '2024-02-25', 'completed', 'Removal of damaged bridge sections'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'New Structure Installation', '2024-05-30', '2024-05-22', 'completed', 'Installation of new bridge components'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Surface and Finishing', '2024-07-15', NULL, 'in-progress', 'Road surface and final finishing work');

-- Insert project risks
INSERT INTO project_risks (project_id, risk_category, risk_description, probability, impact, mitigation_strategy, owner, status) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Weather', 'Extended winter weather delays exterior work', 'Medium', 'Medium', 'Schedule buffer built in, covered work areas prepared', 'Project Manager', 'monitoring'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Supply Chain', 'Curtain wall system delivery delays', 'Low', 'High', 'Alternative suppliers identified, early procurement', 'Procurement Manager', 'mitigated'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Regulatory', 'Fire department permit approval delays', 'Medium', 'Medium', 'Regular coordination meetings, design review acceleration', 'Design Manager', 'active'),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Environmental', 'Environmental impact review delays', 'High', 'Medium', 'Environmental consultant engaged, parallel processing', 'Environmental Coordinator', 'active'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Labor', 'Skilled labor shortage for specialty trades', 'Medium', 'High', 'Multiple contractor relationships, early crew booking', 'Construction Manager', 'monitoring'),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Traffic', 'Traffic management complications', 'Low', 'High', 'Comprehensive traffic plan, DOT coordination', 'Traffic Manager', 'mitigated'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Weather', 'Weather delays for outdoor work', 'Medium', 'Low', 'Flexible scheduling, weather monitoring', 'Project Manager', 'monitoring');

-- Insert project documents
INSERT INTO project_documents (project_id, document_name, document_type, version, status, upload_date, file_size, uploaded_by) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Architectural Plans - Tower', 'Drawing', 'Rev-08', 'approved', '2024-06-15', 15680000, 'M. Chen'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Structural Calculations', 'Engineering', 'Rev-03', 'approved', '2024-06-10', 8920000, 'L. Rodriguez'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'MEP Coordination Model', 'BIM', 'Rev-12', 'in-review', '2024-06-20', 45780000, 'MEP Team'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Fire Safety Plan', 'Compliance', 'Rev-02', 'pending', '2024-06-18', 2340000, 'Fire Consultant'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Construction Progress Photos', 'Photo', 'Week-25', 'current', '2024-06-21', 125600000, 'Site Team'),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Site Plan - Updated', 'Drawing', 'Rev-05', 'approved', '2024-05-28', 12450000, 'Site Architect'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Geotechnical Report', 'Engineering', 'Final', 'approved', '2024-04-15', 6780000, 'Geo Engineer'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Environmental Assessment', 'Compliance', 'Rev-01', 'in-review', '2024-06-01', 18900000, 'Environmental Team'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Utility Coordination', 'Coordination', 'Rev-03', 'approved', '2024-05-20', 4560000, 'Utility Coordinator'),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Bridge Inspection Report', 'Engineering', 'Final', 'approved', '2024-01-10', 25600000, 'Bridge Inspector'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Traffic Management Plan', 'Plan', 'Rev-02', 'approved', '2024-01-05', 8900000, 'Traffic Engineer'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Material Specifications', 'Specification', 'Rev-01', 'approved', '2024-02-15', 3400000, 'Materials Engineer'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Construction Photos - Phase 3', 'Photo', 'Current', 'current', '2024-06-20', 89700000, 'Documentation Team');

-- Insert quality control data
INSERT INTO quality_control (project_id, inspection_type, inspection_date, inspector_name, status, defects_found, defects_resolved, notes) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Concrete Pour', '2024-06-15', 'Quality Inspector A', 'passed', 2, 2, 'Minor surface imperfections corrected'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Steel Welding', '2024-06-18', 'Certified Welding Inspector', 'passed', 1, 1, 'One weld required rework, now compliant'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'MEP Rough-In', '2024-06-20', 'MEP Inspector', 'conditional', 3, 1, 'Two electrical issues pending correction'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Fire Safety Systems', '2024-06-12', 'Fire Marshal', 'passed', 0, 0, 'All systems meet code requirements'),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Foundation', '2024-04-20', 'Structural Inspector', 'passed', 1, 1, 'Minor dimensional variance corrected'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Framing', '2024-06-10', 'Building Inspector', 'passed', 4, 3, 'One framing issue pending repair'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Insulation', '2024-06-15', 'Energy Inspector', 'passed', 2, 2, 'Insulation gaps sealed'),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Structural Steel', '2024-05-25', 'DOT Inspector', 'passed', 0, 0, 'All connections meet specifications'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Concrete Deck', '2024-06-01', 'Materials Inspector', 'passed', 1, 1, 'Surface finish corrected'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Safety Barriers', '2024-06-10', 'Safety Inspector', 'passed', 0, 0, 'All safety systems properly installed');

-- Insert comprehensive activity data for construction dashboards
INSERT INTO construction_activities (project_id, activity_name, trade, status, activity_date, crew_name, duration_hours, notes) VALUES
-- Downtown Office Building - Recent activities
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'MEP Coordination Meeting', 'Coordination', 'completed', '2024-06-21', 'MEP Teams', 4, 'Resolved conflicts in mechanical room'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Curtain Wall Installation - East Face', 'Glazing', 'in-progress', '2024-06-21', 'Glazing Crew A', 8, 'Installing floors 8-10'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Electrical Rough-In - Floor 12', 'Electrical', 'completed', '2024-06-20', 'Electric Crew B', 10, 'All conduit and boxes installed'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Concrete Pour - Roof Level', 'Concrete', 'completed', '2024-06-19', 'Concrete Crew 1', 12, 'Final structural concrete pour'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'HVAC Ductwork - Floors 6-8', 'HVAC', 'in-progress', '2024-06-18', 'HVAC Crew A', 8, 'Main supply ducts installation'),

-- Residential Complex Phase 1 - Recent activities  
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Framing - Building C', 'Framing', 'in-progress', '2024-06-21', 'Framing Crew 2', 8, 'Second floor framing 70% complete'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Plumbing Rough-In - Building A', 'Plumbing', 'completed', '2024-06-20', 'Plumbing Team 1', 6, 'All units rough plumbing complete'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Roofing - Building A', 'Roofing', 'in-progress', '2024-06-19', 'Roofing Crew', 8, 'TPO membrane installation'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Electrical Service - Building B', 'Electrical', 'completed', '2024-06-18', 'Electric Crew C', 10, 'Main electrical service connected'),

-- Highway Bridge Renovation - Recent activities
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Deck Finishing - Section 3', 'Concrete', 'completed', '2024-06-21', 'Finishing Crew', 8, 'Final surface preparation complete'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Barrier Installation', 'Safety', 'in-progress', '2024-06-20', 'Safety Crew', 6, 'Installing new safety barriers'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Expansion Joint Replacement', 'Structural', 'completed', '2024-06-19', 'Structural Team', 12, 'All expansion joints replaced'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Approach Slab Pour', 'Concrete', 'completed', '2024-06-18', 'Concrete Crew 2', 10, 'Approach slabs poured and curing');

-- Add comprehensive executive metrics for better dashboard visualization
INSERT INTO preconstruction_metrics (project_id, budget_approval, permit_progress, design_completion, contractor_selection, feasibility_score, timeline_status)
VALUES
-- Update existing records with more realistic data
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 100, 85, 95, 100, 94, 'On Track'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 100, 75, 80, 100, 88, 'Minor Delays'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 100, 100, 100, 100, 98, 'Ahead of Schedule')
ON CONFLICT (project_id) DO UPDATE SET
    budget_approval = EXCLUDED.budget_approval,
    permit_progress = EXCLUDED.permit_progress,
    design_completion = EXCLUDED.design_completion,
    contractor_selection = EXCLUDED.contractor_selection,
    feasibility_score = EXCLUDED.feasibility_score,
    timeline_status = EXCLUDED.timeline_status;

-- Update projects table with comprehensive data for better dashboard display
UPDATE projects SET 
    total_value = CASE 
        WHEN name = 'Downtown Office Building' THEN 75000000
        WHEN name = 'Residential Complex Phase 1' THEN 45000000
        WHEN name = 'Highway Bridge Renovation' THEN 25000000
        ELSE total_value
    END,
    risk_score = CASE 
        WHEN name = 'Downtown Office Building' THEN 22
        WHEN name = 'Residential Complex Phase 1' THEN 31
        WHEN name = 'Highway Bridge Renovation' THEN 12
        ELSE risk_score
    END,
    strategic_alignment = CASE 
        WHEN name = 'Downtown Office Building' THEN 94
        WHEN name = 'Residential Complex Phase 1' THEN 89
        WHEN name = 'Highway Bridge Renovation' THEN 96
        ELSE strategic_alignment
    END,
    market_position = CASE 
        WHEN name = 'Downtown Office Building' THEN 96
        WHEN name = 'Residential Complex Phase 1' THEN 88
        WHEN name = 'Highway Bridge Renovation' THEN 92
        ELSE market_position
    END;

-- Insert time-series data for charts (last 12 months)
INSERT INTO project_kpis (project_id, week, efficiency_score, quality_score, safety_score) VALUES
-- Downtown Office Building - 12 weeks of data
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W13', 85, 94, 98),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W14', 87, 96, 97),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W15', 89, 95, 99),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W16', 88, 97, 98),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W17', 91, 94, 99),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W18', 89, 96, 97),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W19', 92, 98, 98),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W20', 90, 95, 99),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W21', 94, 97, 98),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W22', 91, 96, 99),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W23', 93, 98, 97),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W24', 95, 97, 99),

-- Residential Complex Phase 1 - 12 weeks of data
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W13', 82, 91, 96),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W14', 84, 89, 97),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W15', 81, 92, 95),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W16', 86, 90, 98),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W17', 83, 93, 96),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W18', 88, 88, 97),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W19', 85, 94, 99),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W20', 89, 91, 98),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W21', 87, 95, 97),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W22', 91, 92, 99),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W23', 88, 96, 98),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W24', 92, 94, 99),

-- Highway Bridge Renovation - 12 weeks of data
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W13', 94, 97, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W14', 96, 98, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W15', 93, 96, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W16', 97, 99, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W17', 95, 97, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W18', 98, 98, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W19', 96, 99, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W20', 99, 97, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W21', 97, 98, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W22', 98, 99, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W23', 96, 98, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W24', 99, 99, 99);

-- Insert alerts and notifications for active dashboard items
INSERT INTO alerts (project_id, alert_type, severity, title, description, status, created_at) VALUES
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'schedule', 'medium', 'Fire Permit Approval Pending', 'Fire department permit approval is pending and may impact schedule', 'active', NOW() - INTERVAL '2 days'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'budget', 'low', 'Material Cost Savings', 'Negotiated better pricing on steel, saving $150K', 'resolved', NOW() - INTERVAL '5 days'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'regulatory', 'high', 'Environmental Review Delay', 'Environmental impact review is taking longer than expected', 'active', NOW() - INTERVAL '1 day'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'safety', 'low', 'Safety Training Completed', 'All crew members completed updated safety training', 'resolved', NOW() - INTERVAL '3 days'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'weather', 'medium', 'Weather Window Monitoring', 'Monitoring weather conditions for deck finishing work', 'active', NOW() - INTERVAL '1 day');

-- Final data consistency checks and updates
UPDATE projects SET updated_at = NOW() WHERE name IN ('Downtown Office Building', 'Residential Complex Phase 1', 'Highway Bridge Renovation');

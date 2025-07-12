-- Fixed Comprehensive Seed Script for Development
-- Uses matching IDs from sample data and only existing tables

-- Clear existing data
DO $$
BEGIN
    -- Disable RLS temporarily
    ALTER TABLE project_financial_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_executive_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_legal_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_design_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_sustainability_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_facilities_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_planning_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_preconstruction_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_daily_progress DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_material_deliveries DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_activities DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_insights DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_team DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_timeline DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cost_breakdown DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
    
    -- Clear data in reverse dependency order
    DELETE FROM project_financial_metrics;
    DELETE FROM project_construction_metrics;
    DELETE FROM project_executive_metrics;
    DELETE FROM project_legal_metrics;
    DELETE FROM project_design_metrics;
    DELETE FROM project_sustainability_metrics;
    DELETE FROM project_facilities_metrics;
    DELETE FROM project_planning_metrics;
    DELETE FROM project_preconstruction_metrics;
    DELETE FROM project_daily_progress;
    DELETE FROM project_material_deliveries;
    DELETE FROM project_construction_activities;
    DELETE FROM project_insights;
    DELETE FROM project_team;
    DELETE FROM project_timeline;
    DELETE FROM project_monthly_spend;
    DELETE FROM project_cash_flow;
    DELETE FROM project_cost_breakdown;
    DELETE FROM project_transactions;
    DELETE FROM projects;
END $$;

-- Insert projects with matching IDs from sample data
INSERT INTO projects (id, name, description, status, start_date, end_date) VALUES
('11111111-1111-1111-1111-111111111111', 'Downtown Office Building', 'A 12-story modern office building project in downtown area with sustainable design features.', 'active', '2024-01-15', '2024-12-31'),
('22222222-2222-2222-2222-222222222222', 'Residential Complex Phase 1', 'Construction of 50-unit residential complex with modern amenities and green spaces.', 'planning', '2024-03-01', '2025-02-28'),
('33333333-3333-3333-3333-333333333333', 'Highway Bridge Renovation', 'Major renovation and structural upgrades to the Main Street bridge infrastructure.', 'active', '2024-02-01', '2024-10-31');

-- Seed Financial Metrics (matching sample data)
INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
('11111111-1111-1111-1111-111111111111', 52000000, 35400000, 51200000, 1200000, 1400000, 0.168, 8500000, 0.221, 347.00, 68000000, 42),
('22222222-2222-2222-2222-222222222222', 28500000, 2850000, 28200000, 150000, 1275000, 0.142, 5200000, 0.185, 285.00, 35000000, 35),
('33333333-3333-3333-3333-333333333333', 12500000, 8750000, 12200000, 420000, 580000, 0.085, 2100000, 0.123, 156.00, 18000000, 0);

-- Seed Construction Metrics (matching sample data)
INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
('11111111-1111-1111-1111-111111111111', 68, 3, 145, 12, 8, 12, 94, 97, 23, 8),
('22222222-2222-2222-2222-222222222222', 15, 2, 25, 4, 2, 18, 0, 95, 8, 15),
('33333333-3333-3333-3333-333333333333', 82, 8, 85, 8, 6, 8, 96, 99, 5, 3);

-- Seed Executive Metrics
INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
('11111111-1111-1111-1111-111111111111', 68000000, 24, 0.25, 0.88, 0.92),
('22222222-2222-2222-2222-222222222222', 35000000, 18, 0.32, 0.85, 0.88),
('33333333-3333-3333-3333-333333333333', 18000000, 15, 0.18, 0.95, 0.85);

-- Seed Daily Progress
INSERT INTO project_daily_progress (project_id, progress_date, planned, actual, workforce) VALUES
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 6, 65.0, 67.0, 142),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 5, 65.5, 67.2, 145),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 4, 66.0, 67.8, 148),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 3, 66.5, 68.1, 144),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 2, 67.0, 68.5, 149),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 1, 67.5, 68.8, 145),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 68.0, 69.2, 152);

-- Seed Construction Activities (fixed column names)
INSERT INTO project_construction_activities (project_id, activity, trade, status, date, crew, duration, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'Foundation Pour - Section B3', 'Concrete', 'completed', CURRENT_DATE - 2, 'ABC Concrete Crew', '10 hours', 'Completed on schedule, quality inspection passed'),
('11111111-1111-1111-1111-111111111111', 'Steel Erection - Level 8', 'Structural', 'in-progress', CURRENT_DATE, 'Steel Works Inc', '8 hours', 'Currently installing beams on east side'),
('11111111-1111-1111-1111-111111111111', 'MEP Rough-in - Level 5', 'Mechanical', 'scheduled', CURRENT_DATE + 1, 'Metro Mechanical', '12 hours', 'Coordination meeting required before start');

-- Seed Material Deliveries (fixed column names)
INSERT INTO project_material_deliveries (project_id, material, supplier, delivery_date, status, quantity, cost) VALUES
('11111111-1111-1111-1111-111111111111', 'Structural Steel - Phase 3', 'Steel Supply Co', CURRENT_DATE + 2, 'confirmed', '85 tons', 425000),
('11111111-1111-1111-1111-111111111111', 'Concrete - High Strength', 'Ready Mix Inc', CURRENT_DATE + 1, 'in-transit', '120 cubic yards', 18000),
('11111111-1111-1111-1111-111111111111', 'Glass Curtain Wall Panels', 'Glass Tech Ltd', CURRENT_DATE + 5, 'scheduled', '2400 sq ft', 186000);

-- Seed Project Timeline
INSERT INTO project_timeline (project_id, phase, start_date, end_date, status, progress) VALUES
('11111111-1111-1111-1111-111111111111', 'Pre-Construction', '2024-01-15', '2024-03-30', 'completed', 100),
('11111111-1111-1111-1111-111111111111', 'Foundation', '2024-04-01', '2024-06-15', 'completed', 100),
('11111111-1111-1111-1111-111111111111', 'Structure', '2024-06-16', '2024-09-30', 'in-progress', 68),
('11111111-1111-1111-1111-111111111111', 'MEP & Interiors', '2024-10-01', '2024-12-15', 'upcoming', 0),
('11111111-1111-1111-1111-111111111111', 'Final Commissioning', '2024-12-16', '2024-12-31', 'upcoming', 0);

-- Seed Project Team
INSERT INTO project_team (project_id, project_manager, architect, contractor) VALUES
('11111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'Michael Chen', 'BuildTech Solutions'),
('22222222-2222-2222-2222-222222222222', 'David Kim', 'Elena Rodriguez', 'Residential Builders Inc'),
('33333333-3333-3333-3333-333333333333', 'Robert Chang', 'Infrastructure Design Group', 'Heavy Construction LLC');

-- Seed Project Insights (fixed column names)
INSERT INTO project_insights (project_id, type, title, description, impact, recommendation, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'risk', 'Weather Impact on Schedule', 'Upcoming weather forecast shows potential for delays', 'medium', 'Consider accelerating weather-sensitive activities', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111111', 'opportunity', 'Early Material Procurement', 'Steel prices expected to rise next quarter', 'high', 'Lock in current pricing for remaining steel orders', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111111', 'performance', 'Productivity Above Target', 'Current productivity 8% above baseline', 'positive', 'Maintain current crew composition and workflow', CURRENT_TIMESTAMP);

-- Seed Legal Metrics
INSERT INTO project_legal_metrics (project_id, contracts_active, contracts_pending, compliance_score, permit_status, legal_risks, documentation_complete) VALUES
('11111111-1111-1111-1111-111111111111', 15, 2, 96, 'All Approved', 2, 94),
('22222222-2222-2222-2222-222222222222', 8, 6, 88, 'In Review', 3, 78),
('33333333-3333-3333-3333-333333333333', 12, 0, 98, 'All Approved', 1, 98);

-- Seed Design Metrics
INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
('11111111-1111-1111-1111-111111111111', 95, 127, 134, 3, 18, 12),
('22222222-2222-2222-2222-222222222222', 75, 45, 68, 2, 12, 8),
('33333333-3333-3333-3333-333333333333', 100, 58, 58, 1, 15, 3);

-- Seed Sustainability Metrics
INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
('11111111-1111-1111-1111-111111111111', 'Gold', 68, 35, 28, 60, ARRAY['LEED Gold Target', 'ENERGY STAR Design', 'Green Building Certification']),
('22222222-2222-2222-2222-222222222222', 'Silver', 45, 25, 20, 45, ARRAY['LEED Silver Target', 'ENERGY STAR Design']),
('33333333-3333-3333-3333-333333333333', 'N/A', 0, 15, 12, 35, ARRAY['Environmental Compliance', 'Material Recycling']);

-- Seed Facilities Metrics
INSERT INTO project_facilities_metrics (project_id, operational_readiness, systems_commissioned, maintenance_planned, energy_performance, occupancy_readiness) VALUES
('11111111-1111-1111-1111-111111111111', 35, 12, 85, 88, 40),
('22222222-2222-2222-2222-222222222222', 15, 0, 60, 75, 20),
('33333333-3333-3333-3333-333333333333', 75, 8, 95, 82, 85);

-- Seed Planning Metrics
INSERT INTO project_planning_metrics (project_id, master_plan_approval, zoning_compliance, community_engagement, regulatory_approvals, feasibility_complete) VALUES
('11111111-1111-1111-1111-111111111111', 100, 100, 92, 98, 100),
('22222222-2222-2222-2222-222222222222', 95, 98, 88, 75, 90),
('33333333-3333-3333-3333-333333333333', 100, 100, 95, 100, 100);

-- Seed Preconstruction Metrics
INSERT INTO project_preconstruction_metrics (project_id, design_development, bidding_progress, contractor_selection, permit_submissions, value_engineering) VALUES
('11111111-1111-1111-1111-111111111111', 100, 100, 100, 100, 95),
('22222222-2222-2222-2222-222222222222', 75, 25, 40, 65, 70),
('33333333-3333-3333-3333-333333333333', 100, 100, 100, 100, 100);

-- Seed Monthly Spend Data
INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
('11111111-1111-1111-1111-111111111111', 'Jan', 2100000, 1950000, 2000000),
('11111111-1111-1111-1111-111111111111', 'Feb', 2100000, 2250000, 2200000),
('11111111-1111-1111-1111-111111111111', 'Mar', 2100000, 2050000, 2100000),
('11111111-1111-1111-1111-111111111111', 'Apr', 2100000, 2180000, 2150000),
('11111111-1111-1111-1111-111111111111', 'May', 2100000, 2020000, 2080000),
('11111111-1111-1111-1111-111111111111', 'Jun', 2100000, 2200000, 2180000);

-- Seed Cash Flow Data
INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
('11111111-1111-1111-1111-111111111111', 'Jan 2024', 0, 1200000, -1200000),
('11111111-1111-1111-1111-111111111111', 'Feb 2024', 0, 1450000, -2650000),
('11111111-1111-1111-1111-111111111111', 'Mar 2024', 0, 1680000, -4330000),
('11111111-1111-1111-1111-111111111111', 'Apr 2024', 0, 1520000, -5850000),
('11111111-1111-1111-1111-111111111111', 'May 2024', 0, 1750000, -7600000),
('11111111-1111-1111-1111-111111111111', 'Jun 2024', 2400000, 1800000, -7000000);

-- Seed Cost Breakdown
INSERT INTO project_cost_breakdown (project_id, category, amount, percentage) VALUES
('11111111-1111-1111-1111-111111111111', 'Construction', 18500000, 77.1),
('11111111-1111-1111-1111-111111111111', 'Architecture/Engineering', 2050000, 8.5),
('11111111-1111-1111-1111-111111111111', 'Site Work', 1200000, 5.0),
('11111111-1111-1111-1111-111111111111', 'Permits & Fees', 850000, 3.5),
('11111111-1111-1111-1111-111111111111', 'Other/Contingency', 1400000, 5.9);

-- Seed Recent Transactions
INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
('11111111-1111-1111-1111-111111111111', '2024-06-20', 'Steel Supplier Payment - Floors 7-9', 'Metropolitan Steel Supply', -89450, 'Materials', 'paid'),
('11111111-1111-1111-1111-111111111111', '2024-06-18', 'Monthly Progress Payment - GC', 'BuildTech Solutions', -1850000, 'Construction', 'paid'),
('11111111-1111-1111-1111-111111111111', '2024-06-15', 'Tenant Deposit - TechCorp', 'TechCorp Solutions', 137500, 'Pre-leasing', 'received');

-- Re-enable RLS
DO $$
BEGIN
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_financial_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_executive_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_legal_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_design_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_sustainability_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_facilities_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_planning_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_preconstruction_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_daily_progress ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_material_deliveries ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_activities ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_insights ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_timeline ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cost_breakdown ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
END $$;

-- Verify data was inserted
DO $$
DECLARE
    project_count INTEGER;
    construction_count INTEGER;
    financial_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO project_count FROM projects;
    SELECT COUNT(*) INTO construction_count FROM project_construction_metrics;
    SELECT COUNT(*) INTO financial_count FROM project_financial_metrics;
    
    RAISE NOTICE 'Seed completed successfully!';
    RAISE NOTICE 'Projects created: %', project_count;
    RAISE NOTICE 'Construction metrics created: %', construction_count;
    RAISE NOTICE 'Financial metrics created: %', financial_count;
END $$;
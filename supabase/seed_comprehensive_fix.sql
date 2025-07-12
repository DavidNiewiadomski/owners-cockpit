-- Comprehensive Seed Script for Development
-- This script creates projects and populates all necessary dashboard data

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
    ALTER TABLE project_construction_quality DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_activities DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_safety_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_safety_incidents DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_safety_training DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_insights DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_team DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_timeline DISABLE ROW LEVEL SECURITY;
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
    DELETE FROM project_construction_quality;
    DELETE FROM project_construction_activities;
    DELETE FROM project_safety_metrics;
    DELETE FROM project_safety_incidents;
    DELETE FROM project_safety_training;
    DELETE FROM project_insights;
    DELETE FROM project_team;
    DELETE FROM project_timeline;
    DELETE FROM projects;
END $$;

-- Insert projects
INSERT INTO projects (id, name, description, status, start_date, end_date) VALUES
('11111111-1111-1111-1111-111111111111', 'Downtown Mixed-Use Development', 'Modern mixed-use development with retail, office, and residential spaces in downtown core', 'active', '2024-01-15', '2025-12-30'),
('22222222-2222-2222-2222-222222222222', 'Green Valley Office Complex', 'Sustainable office complex with LEED Platinum certification target', 'active', '2024-03-01', '2026-02-28'),
('33333333-3333-3333-3333-333333333333', 'Riverside Residential Tower', 'Luxury residential tower with premium amenities and river views', 'planning', '2024-06-01', '2026-08-31');

-- Seed Financial Metrics
INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
('11111111-1111-1111-1111-111111111111', 125000000, 56250000, 127500000, 800000, 1200000, 0.156, 25000000, 0.182, 285.50, 165000000, 42),
('22222222-2222-2222-2222-222222222222', 78000000, 31200000, 76500000, 500000, 1000000, 0.142, 15000000, 0.165, 265.00, 98000000, 38),
('33333333-3333-3333-3333-333333333333', 89000000, 8900000, 88500000, 100000, 1400000, 0.135, 18000000, 0.155, 295.00, 115000000, 25);

-- Seed Construction Metrics
INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
('11111111-1111-1111-1111-111111111111', 45, -2, 156, 22, 12, 28, 92, 96, 8, 12),
('22222222-2222-2222-2222-222222222222', 40, 3, 98, 18, 10, 25, 94, 98, 5, 8),
('33333333-3333-3333-3333-333333333333', 10, 0, 45, 8, 2, 20, 95, 99, 2, 4);

-- Seed Executive Metrics
INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
('11111111-1111-1111-1111-111111111111', 165000000, 48, 0.72, 0.88, 0.85),
('22222222-2222-2222-2222-222222222222', 98000000, 36, 0.65, 0.92, 0.82),
('33333333-3333-3333-3333-333333333333', 115000000, 42, 0.68, 0.86, 0.78);

-- Seed Daily Progress
INSERT INTO project_daily_progress (project_id, progress_date, planned, actual, workforce) VALUES
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 6, 43.5, 43.2, 145),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 5, 43.8, 43.5, 148),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 4, 44.1, 43.9, 152),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 3, 44.4, 44.3, 156),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 2, 44.7, 44.6, 154),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 1, 45.0, 44.9, 156),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 45.3, 45.0, 156);

-- Seed Construction Activities
INSERT INTO project_construction_activities (project_id, activity_name, activity_trade, status, activity_date, crew_name, duration_hours, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'Foundation Pour - Section B3', 'Concrete', 'completed', CURRENT_DATE - 2, 'ABC Concrete Crew', 10, 'Completed on schedule, quality inspection passed'),
('11111111-1111-1111-1111-111111111111', 'Steel Erection - Level 8', 'Structural', 'in_progress', CURRENT_DATE, 'Steel Works Inc', 8, 'Currently installing beams on east side'),
('11111111-1111-1111-1111-111111111111', 'MEP Rough-in - Level 5', 'Mechanical', 'scheduled', CURRENT_DATE + 1, 'Metro Mechanical', 12, 'Coordination meeting required before start');

-- Seed Material Deliveries
INSERT INTO project_material_deliveries (project_id, material, supplier, scheduled_date, status, quantity, cost) VALUES
('11111111-1111-1111-1111-111111111111', 'Structural Steel - Phase 3', 'Steel Supply Co', CURRENT_DATE + 2, 'confirmed', '85 tons', 425000),
('11111111-1111-1111-1111-111111111111', 'Concrete - High Strength', 'Ready Mix Inc', CURRENT_DATE + 1, 'in_transit', '120 cubic yards', 18000),
('11111111-1111-1111-1111-111111111111', 'Glass Curtain Wall Panels', 'Glass Tech Ltd', CURRENT_DATE + 5, 'scheduled', '2400 sq ft', 186000);

-- Seed Safety Metrics
INSERT INTO project_safety_metrics (project_id, recordable_days, total_incidents, near_misses, safety_training_hours, compliance_score, osha_rating, last_incident_date, active_safety_programs, monthly_inspections, corrective_actions) VALUES
('11111111-1111-1111-1111-111111111111', 145, 2, 5, 320, 96, 'Excellent', CURRENT_DATE - 145, 8, 12, 5),
('22222222-2222-2222-2222-222222222222', 210, 0, 3, 280, 98, 'Outstanding', NULL, 7, 10, 3),
('33333333-3333-3333-3333-333333333333', 45, 0, 1, 120, 99, 'Excellent', NULL, 6, 8, 1);

-- Seed Project Timeline
INSERT INTO project_timeline (project_id, phase, start_date, end_date, status, progress) VALUES
('11111111-1111-1111-1111-111111111111', 'Design Development', '2024-01-15', '2024-03-15', 'completed', 100),
('11111111-1111-1111-1111-111111111111', 'Permits & Approvals', '2024-02-01', '2024-04-30', 'completed', 100),
('11111111-1111-1111-1111-111111111111', 'Foundation & Structure', '2024-05-01', '2024-10-31', 'in_progress', 85),
('11111111-1111-1111-1111-111111111111', 'MEP Installation', '2024-08-15', '2025-03-15', 'in_progress', 35),
('11111111-1111-1111-1111-111111111111', 'Interior Finishes', '2025-01-01', '2025-09-30', 'upcoming', 0);

-- Seed Project Team
INSERT INTO project_team (project_id, project_manager, architect, contractor, engineer) VALUES
('11111111-1111-1111-1111-111111111111', 'Sarah Mitchell', 'Foster + Partners', 'Turner Construction', 'ARUP Engineering'),
('22222222-2222-2222-2222-222222222222', 'Michael Chen', 'Gensler', 'Clark Construction', 'WSP Global'),
('33333333-3333-3333-3333-333333333333', 'Jennifer Adams', 'HOK Architects', 'Skanska USA', 'Thornton Tomasetti');

-- Seed Project Insights
INSERT INTO project_insights (project_id, insight_type, title, description, impact, recommendation, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'risk', 'Weather Impact on Schedule', 'Upcoming weather forecast shows potential for delays', 'medium', 'Consider accelerating weather-sensitive activities', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111111', 'opportunity', 'Early Material Procurement', 'Steel prices expected to rise next quarter', 'high', 'Lock in current pricing for remaining steel orders', CURRENT_TIMESTAMP),
('11111111-1111-1111-1111-111111111111', 'performance', 'Productivity Above Target', 'Current productivity 8% above baseline', 'positive', 'Maintain current crew composition and workflow', CURRENT_TIMESTAMP);

-- Seed Legal Metrics
INSERT INTO project_legal_metrics (project_id, contracts_active, contracts_pending, compliance_score, permit_status, legal_risks, documentation_complete) VALUES
('11111111-1111-1111-1111-111111111111', 24, 3, 94, 'All Current', 2, 89),
('22222222-2222-2222-2222-222222222222', 18, 2, 96, 'All Current', 1, 92),
('33333333-3333-3333-3333-333333333333', 12, 5, 92, '2 Pending', 3, 78);

-- Seed Design Metrics
INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
('11111111-1111-1111-1111-111111111111', 95, 285, 300, 3, 42, 18),
('22222222-2222-2222-2222-222222222222', 92, 176, 200, 2, 38, 12),
('33333333-3333-3333-3333-333333333333', 78, 120, 180, 2, 28, 8);

-- Seed Sustainability Metrics
INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
('11111111-1111-1111-1111-111111111111', 'LEED Gold', 82, 88, 42, 76, ARRAY['LEED Gold (pending)', 'Energy Star']),
('22222222-2222-2222-2222-222222222222', 'LEED Platinum', 91, 94, 55, 85, ARRAY['LEED Platinum (pending)', 'WELL Building Standard']),
('33333333-3333-3333-3333-333333333333', 'LEED Silver', 75, 82, 35, 68, ARRAY['LEED Silver (targeted)']);

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
    ALTER TABLE project_construction_quality ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_activities ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_safety_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_safety_incidents ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_safety_training ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_insights ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_timeline ENABLE ROW LEVEL SECURITY;
END $$;

-- Verify data was inserted
DO $$
DECLARE
    project_count INTEGER;
    metrics_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO project_count FROM projects;
    SELECT COUNT(*) INTO metrics_count FROM project_construction_metrics;
    
    RAISE NOTICE 'Seed completed successfully!';
    RAISE NOTICE 'Projects created: %', project_count;
    RAISE NOTICE 'Construction metrics created: %', metrics_count;
END $$;
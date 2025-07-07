-- Fixed comprehensive seed script for all dashboards with correct schemas
-- This ensures each project has different, realistic data across all dashboards

DO $$
DECLARE
    downtown_office_id UUID := 'aa2e669f-c1e4-4da6-a705-c2fb776d64ec';
    downtown_mixed_id UUID := 'b063f9d1-b7a5-4642-8b6a-513ea1b024bd';
    green_valley_id UUID := 'ffe84c21-4d38-4571-bf87-e7dd92f78066';
    riverside_tower_id UUID := 'a9133200-b56f-47cf-be42-a501637b49f5';
BEGIN
    -- Disable RLS for seeding
    ALTER TABLE project_executive_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_financial_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_design_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_sustainability_metrics DISABLE ROW LEVEL SECURITY;
    
    -- Clear existing data
    DELETE FROM project_executive_metrics;
    DELETE FROM project_financial_metrics;
    DELETE FROM project_construction_metrics;
    DELETE FROM project_design_metrics;
    DELETE FROM project_sustainability_metrics;
    
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
    
    -- Re-enable RLS
    ALTER TABLE project_executive_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_financial_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_design_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_sustainability_metrics ENABLE ROW LEVEL SECURITY;
    
END $$;

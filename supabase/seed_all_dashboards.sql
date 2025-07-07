-- Comprehensive seed script for all dashboards with unique data per project
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
    ALTER TABLE project_legal_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_sustainability_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_facilities_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_planning_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_preconstruction_metrics DISABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_sections DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend DISABLE ROW LEVEL SECURITY;
    
    -- Clear existing data
    DELETE FROM project_executive_metrics;
    DELETE FROM project_financial_metrics;
    DELETE FROM project_construction_metrics;
    DELETE FROM project_design_metrics;
    DELETE FROM project_legal_metrics;
    DELETE FROM project_sustainability_metrics;
    DELETE FROM project_facilities_metrics;
    DELETE FROM project_planning_metrics;
    DELETE FROM project_preconstruction_metrics;
    DELETE FROM division1_sections;
    DELETE FROM project_transactions;
    DELETE FROM project_cash_flow;
    DELETE FROM project_monthly_spend;
    
    -- ============ DOWNTOWN OFFICE BUILDING DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position, created_at) VALUES
    (downtown_office_id, 45000000, 48, 2.1, 94.5, 87.2, NOW());
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections, created_at) VALUES
    (downtown_office_id, 45000000, 32400000, 46800000, 750000, 2250000, 12.5, 8500000, 15.2, 425.00, 52000000, 3800000, NOW());
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals, created_at) VALUES
    (downtown_office_id, 72.0, 5, 48, 12, 68, 100, 87, 94, 12, 8, NOW());
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, drawings_approved, drawings_pending, design_changes, coordination_issues, bim_model_count, clash_detection_issues, submittal_status, design_reviews_completed, created_at) VALUES
    (downtown_office_id, 95.0, 156, 8, 23, 7, 6, 18, 'Current', 89, NOW());
    
    -- Legal Metrics
    INSERT INTO project_legal_metrics (project_id, contract_count, active_claims, pending_approvals, compliance_issues, insurance_claims, permit_status, regulatory_reviews, risk_level, created_at) VALUES
    (downtown_office_id, 24, 1, 3, 2, 0, 'Current', 18, 'Medium', NOW());
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_score, energy_efficiency, waste_diversion, water_usage_reduction, carbon_footprint, green_materials_percentage, sustainability_certifications, environmental_incidents, created_at) VALUES
    (downtown_office_id, 85, 92, 78, 35, 1250.5, 67, '["LEED Gold Target"]', 0, NOW());
    
    -- Facilities Metrics
    INSERT INTO project_facilities_metrics (project_id, hvac_efficiency, lighting_systems, security_integration, accessibility_compliance, maintenance_schedule, energy_consumption, space_utilization, equipment_status, created_at) VALUES
    (downtown_office_id, 94, 88, 91, 100, 'Current', 1850.2, 85, 'Operational', NOW());
    
    -- Planning Metrics
    INSERT INTO project_planning_metrics (project_id, schedule_adherence, critical_path_status, resource_allocation, milestone_completion, risk_mitigation, stakeholder_engagement, permit_progress, created_at) VALUES
    (downtown_office_id, 95.2, 'On Track', 87, 68, 92, 88, 94, NOW());
    
    -- Preconstruction Metrics
    INSERT INTO project_preconstruction_metrics (project_id, design_development, permit_acquisition, contractor_selection, budget_finalization, site_preparation, schedule_baseline, risk_assessment, created_at) VALUES
    (downtown_office_id, 100, 98, 100, 95, 100, 100, 94, NOW());
    
    -- ============ DOWNTOWN MIXED-USE DEVELOPMENT DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, total_budget, budget_spent, completion_percentage, days_remaining, change_orders, active_rfis, safety_score, quality_score, team_count, milestone_completion, cost_variance, schedule_variance, created_at) VALUES
    (downtown_mixed_id, 125000000, 68750000, 55.0, 245, 15, 28, 91, 89, 85, 52, 3.8, -1.2, NOW());
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, approved_budget, committed_costs, actual_costs, pending_invoices, paid_invoices, cost_variance_percentage, cash_flow_projection, forecast_at_completion, change_order_value, contingency_remaining, created_at) VALUES
    (downtown_mixed_id, 125000000, 98500000, 68750000, 2350000, 66400000, 3.8, 8500000, 129750000, 4750000, 6250000, NOW());
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, trades_active, safety_incidents, quality_issues, rfi_count, daily_workers, equipment_utilization, weather_delays, milestone_progress, productivity_index, created_at) VALUES
    (downtown_mixed_id, 55.0, 18, 4, 12, 28, 85, 82, 7, 52, 0.98, NOW());
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, drawings_approved, drawings_pending, design_changes, coordination_issues, bim_model_count, clash_detection_issues, submittal_status, design_reviews_completed, created_at) VALUES
    (downtown_mixed_id, 88.0, 245, 23, 67, 19, 12, 45, 'In Progress', 78, NOW());
    
    -- Legal Metrics
    INSERT INTO project_legal_metrics (project_id, contract_count, active_claims, pending_approvals, compliance_issues, insurance_claims, permit_status, regulatory_reviews, risk_level, created_at) VALUES
    (downtown_mixed_id, 42, 3, 8, 5, 1, 'Current', 28, 'High', NOW());
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_score, energy_efficiency, waste_diversion, water_usage_reduction, carbon_footprint, green_materials_percentage, sustainability_certifications, environmental_incidents, created_at) VALUES
    (downtown_mixed_id, 92, 95, 85, 42, 2850.3, 78, '["LEED Platinum Target", "BREEAM Excellent"]', 1, NOW());
    
    -- Facilities Metrics
    INSERT INTO project_facilities_metrics (project_id, hvac_efficiency, lighting_systems, security_integration, accessibility_compliance, maintenance_schedule, energy_consumption, space_utilization, equipment_status, created_at) VALUES
    (downtown_mixed_id, 89, 92, 88, 100, 'Current', 4250.8, 78, 'Installation Phase', NOW());
    
    -- Planning Metrics
    INSERT INTO project_planning_metrics (project_id, schedule_adherence, critical_path_status, resource_allocation, milestone_completion, risk_mitigation, stakeholder_engagement, permit_progress, created_at) VALUES
    (downtown_mixed_id, 87.5, 'At Risk', 92, 52, 85, 91, 89, NOW());
    
    -- Preconstruction Metrics
    INSERT INTO project_preconstruction_metrics (project_id, design_development, permit_acquisition, contractor_selection, budget_finalization, site_preparation, schedule_baseline, risk_assessment, created_at) VALUES
    (downtown_mixed_id, 100, 100, 100, 100, 100, 100, 98, NOW());
    
    -- ============ GREEN VALLEY OFFICE COMPLEX DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, total_budget, budget_spent, completion_percentage, days_remaining, change_orders, active_rfis, safety_score, quality_score, team_count, milestone_completion, cost_variance, schedule_variance, created_at) VALUES
    (green_valley_id, 78000000, 31200000, 40.0, 368, 6, 18, 96, 92, 62, 38, -1.5, 2.8, NOW());
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, approved_budget, committed_costs, actual_costs, pending_invoices, paid_invoices, cost_variance_percentage, cash_flow_projection, forecast_at_completion, change_order_value, contingency_remaining, created_at) VALUES
    (green_valley_id, 78000000, 52800000, 31200000, 1680000, 29520000, -1.5, 6200000, 76830000, 1830000, 3900000, NOW());
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, trades_active, safety_incidents, quality_issues, rfi_count, daily_workers, equipment_utilization, weather_delays, milestone_progress, productivity_index, created_at) VALUES
    (green_valley_id, 40.0, 14, 1, 8, 18, 62, 91, 2, 38, 1.08, NOW());
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, drawings_approved, drawings_pending, design_changes, coordination_issues, bim_model_count, clash_detection_issues, submittal_status, design_reviews_completed, created_at) VALUES
    (green_valley_id, 92.0, 198, 12, 34, 11, 8, 23, 'Current', 85, NOW());
    
    -- Legal Metrics
    INSERT INTO project_legal_metrics (project_id, contract_count, active_claims, pending_approvals, compliance_issues, insurance_claims, permit_status, regulatory_reviews, risk_level, created_at) VALUES
    (green_valley_id, 28, 0, 5, 1, 0, 'Current', 22, 'Low', NOW());
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_score, energy_efficiency, waste_diversion, water_usage_reduction, carbon_footprint, green_materials_percentage, sustainability_certifications, environmental_incidents, created_at) VALUES
    (green_valley_id, 96, 98, 92, 55, 890.2, 85, '["LEED Platinum", "ENERGY STAR"]', 0, NOW());
    
    -- Facilities Metrics
    INSERT INTO project_facilities_metrics (project_id, hvac_efficiency, lighting_systems, security_integration, accessibility_compliance, maintenance_schedule, energy_consumption, space_utilization, equipment_status, created_at) VALUES
    (green_valley_id, 97, 95, 93, 100, 'Planned', 2640.5, 82, 'Design Phase', NOW());
    
    -- Planning Metrics
    INSERT INTO project_planning_metrics (project_id, schedule_adherence, critical_path_status, resource_allocation, milestone_completion, risk_mitigation, stakeholder_engagement, permit_progress, created_at) VALUES
    (green_valley_id, 92.8, 'On Track', 89, 38, 94, 87, 96, NOW());
    
    -- Preconstruction Metrics
    INSERT INTO project_preconstruction_metrics (project_id, design_development, permit_acquisition, contractor_selection, budget_finalization, site_preparation, schedule_baseline, risk_assessment, created_at) VALUES
    (green_valley_id, 100, 100, 100, 100, 100, 100, 96, NOW());
    
    -- ============ RIVERSIDE RESIDENTIAL TOWER DATA ============
    
    -- Executive Metrics
    INSERT INTO project_executive_metrics (project_id, total_budget, budget_spent, completion_percentage, days_remaining, change_orders, active_rfis, safety_score, quality_score, team_count, milestone_completion, cost_variance, schedule_variance, created_at) VALUES
    (riverside_tower_id, 89000000, 12460000, 14.0, 520, 2, 8, 98, 94, 35, 15, 0.8, -3.5, NOW());
    
    -- Financial Metrics
    INSERT INTO project_financial_metrics (project_id, approved_budget, committed_costs, actual_costs, pending_invoices, paid_invoices, cost_variance_percentage, cash_flow_projection, forecast_at_completion, change_order_value, contingency_remaining, created_at) VALUES
    (riverside_tower_id, 89000000, 28900000, 12460000, 780000, 11680000, 0.8, 3500000, 89712000, 712000, 4450000, NOW());
    
    -- Construction Metrics
    INSERT INTO project_construction_metrics (project_id, overall_progress, trades_active, safety_incidents, quality_issues, rfi_count, daily_workers, equipment_utilization, weather_delays, milestone_progress, productivity_index, created_at) VALUES
    (riverside_tower_id, 14.0, 8, 0, 3, 8, 35, 85, 1, 15, 1.15, NOW());
    
    -- Design Metrics
    INSERT INTO project_design_metrics (project_id, design_progress, drawings_approved, drawings_pending, design_changes, coordination_issues, bim_model_count, clash_detection_issues, submittal_status, design_reviews_completed, created_at) VALUES
    (riverside_tower_id, 78.0, 124, 28, 18, 6, 4, 12, 'In Review', 65, NOW());
    
    -- Legal Metrics
    INSERT INTO project_legal_metrics (project_id, contract_count, active_claims, pending_approvals, compliance_issues, insurance_claims, permit_status, regulatory_reviews, risk_level, created_at) VALUES
    (riverside_tower_id, 18, 0, 12, 3, 0, 'Pending', 15, 'Medium', NOW());
    
    -- Sustainability Metrics
    INSERT INTO project_sustainability_metrics (project_id, leed_score, energy_efficiency, waste_diversion, water_usage_reduction, carbon_footprint, green_materials_percentage, sustainability_certifications, environmental_incidents, created_at) VALUES
    (riverside_tower_id, 78, 85, 68, 28, 1580.7, 58, '["LEED Silver Target"]', 0, NOW());
    
    -- Facilities Metrics
    INSERT INTO project_facilities_metrics (project_id, hvac_efficiency, lighting_systems, security_integration, accessibility_compliance, maintenance_schedule, energy_consumption, space_utilization, equipment_status, created_at) VALUES
    (riverside_tower_id, 82, 78, 85, 100, 'In Development', 3250.1, 68, 'Planning Phase', NOW());
    
    -- Planning Metrics
    INSERT INTO project_planning_metrics (project_id, schedule_adherence, critical_path_status, resource_allocation, milestone_completion, risk_mitigation, stakeholder_engagement, permit_progress, created_at) VALUES
    (riverside_tower_id, 88.2, 'Behind Schedule', 78, 15, 82, 85, 45, NOW());
    
    -- Preconstruction Metrics
    INSERT INTO project_preconstruction_metrics (project_id, design_development, permit_acquisition, contractor_selection, budget_finalization, site_preparation, schedule_baseline, risk_assessment, created_at) VALUES
    (riverside_tower_id, 78, 45, 85, 92, 65, 88, 89, NOW());
    
    -- Re-enable RLS
    ALTER TABLE project_executive_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_financial_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_construction_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_design_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_legal_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_sustainability_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_facilities_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_planning_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_preconstruction_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend ENABLE ROW LEVEL SECURITY;
    
END $$;

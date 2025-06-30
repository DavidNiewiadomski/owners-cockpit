-- Comprehensive seed data for Owners Cockpit with robust metrics for all projects
-- This script provides extensive data for Financial, Construction, Design, Legal, Sustainability,
-- Facilities, Planning, and Preconstruction dashboards for all 4 projects

-- Clear existing data
TRUNCATE TABLE project_financial_metrics, project_construction_metrics, project_executive_metrics,
project_legal_metrics, project_design_metrics, project_sustainability_metrics, 
project_facilities_metrics, project_planning_metrics, project_preconstruction_metrics,
project_monthly_spend, project_cash_flow, project_cost_breakdown, project_transactions,
project_daily_progress, project_kpi_trends, project_insights, project_timeline, project_team,
construction_daily_progress, construction_trade_progress, construction_activities,
construction_quality_metrics, material_deliveries, safety_metrics, safety_incidents,
safety_training CASCADE;

-- Project Financial Metrics for all projects
INSERT INTO project_financial_metrics (
    project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, 
    contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections
) VALUES 
-- Downtown Office Building (Active)
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 25000000, 12500000, 24800000, 500000, 1000000, 
 0.125, 5500000, 0.145, 285, 32000000, 72.5),
-- Downtown Office Complex (Active) 
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 45000000, 28200000, 46500000, 850000, 1650000, 
 0.138, 8200000, 0.152, 295, 58000000, 68.2),
-- Riverside Residential Complex (Planning)
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 18500000, 1200000, 18800000, 0, 1850000, 
 0.165, 4200000, 0.175, 265, 25000000, 15.5),
-- Tech Campus Expansion (Completed)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 7000000, 7200000, 7200000, 300000, 0, 
 0.195, 2100000, 0.205, 325, 10000000, 95.8);

-- Project Construction Metrics for all projects
INSERT INTO project_construction_metrics (
    project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors,
    completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 52.3, -3, 145, 12, 15, 28, 94.2, 96.8, 8, 5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 68.7, 5, 225, 18, 22, 32, 91.5, 94.2, 12, 8),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 8.5, 0, 25, 3, 2, 24, 98.5, 99.2, 2, 1),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 100, 2, 0, 0, 20, 20, 95.8, 97.5, 0, 0);

-- Project Executive Metrics for all projects
INSERT INTO project_executive_metrics (
    project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 32000000, 15, 3.2, 88.5, 76.2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 58000000, 22, 2.8, 92.1, 82.4),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 25000000, 12, 2.1, 94.2, 85.1),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 10000000, 8, 1.5, 96.8, 89.2);

-- Project Legal Metrics for all projects  
INSERT INTO project_legal_metrics (
    project_id, contracts_active, contracts_pending, compliance_score, permit_status,
    legal_risks, documentation_complete
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 24, 3, 92.5, 'Active', 2, 88.2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 35, 5, 89.8, 'Active', 3, 85.6),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 8, 12, 95.2, 'Pending Review', 1, 72.4),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 15, 0, 96.8, 'Complete', 0, 100.0);

-- Project Design Metrics for all projects
INSERT INTO project_design_metrics (
    project_id, design_progress, approved_drawings, total_drawings, revision_cycles,
    stakeholder_approvals, design_changes
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 85.2, 142, 167, 3, 89.5, 12),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 92.8, 198, 213, 4, 92.1, 18),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 45.6, 89, 195, 2, 68.2, 8),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 100.0, 125, 125, 2, 100.0, 5);

-- Project Sustainability Metrics for all projects
INSERT INTO project_sustainability_metrics (
    project_id, leed_target, current_score, energy_efficiency, carbon_reduction,
    sustainable_materials, certifications
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Gold', 78.5, 82.1, 45.2, 68.9, 
 ARRAY['ENERGY STAR', 'LEED Gold Certified']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Platinum', 85.2, 89.5, 52.8, 75.6,
 ARRAY['ENERGY STAR', 'LEED Platinum', 'WELL Building Standard']),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Silver', 62.8, 71.2, 38.5, 58.2,
 ARRAY['ENERGY STAR Designed']),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Gold', 88.9, 92.1, 58.6, 82.4,
 ARRAY['ENERGY STAR', 'LEED Gold Certified', 'BREEAM Excellent']);

-- Project Facilities Metrics for all projects
INSERT INTO project_facilities_metrics (
    project_id, operational_readiness, systems_commissioned, maintenance_planned,
    energy_performance, occupancy_readiness
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 68.5, 45.2, 72.8, 78.9, 62.1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 82.1, 68.9, 85.6, 82.4, 79.5),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 15.2, 8.5, 25.8, 45.2, 12.8),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 100.0, 100.0, 100.0, 95.8, 100.0);

-- Project Planning Metrics for all projects
INSERT INTO project_planning_metrics (
    project_id, master_plan_approval, zoning_compliance, community_engagement,
    regulatory_approvals, feasibility_complete
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 100.0, 100.0, 85.6, 92.5, 100.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 100.0, 100.0, 89.2, 95.8, 100.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 75.2, 82.5, 68.9, 72.1, 85.6),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 100.0, 100.0, 95.8, 100.0, 100.0);

-- Project Preconstruction Metrics for all projects
INSERT INTO project_preconstruction_metrics (
    project_id, design_development, bidding_progress, contractor_selection,
    permit_submissions, value_engineering
) VALUES 
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 100.0, 100.0, 100.0, 100.0, 95.2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 100.0, 100.0, 100.0, 100.0, 98.5),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 68.9, 45.2, 25.8, 72.5, 58.9),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 100.0, 100.0, 100.0, 100.0, 100.0);

-- Monthly Spend Data for all projects (12 months)
INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
-- Downtown Office Building monthly data
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'January', 1800000, 1750000, 1825000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'February', 2100000, 2250000, 2180000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'March', 2300000, 2180000, 2320000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'April', 2500000, 2680000, 2550000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'May', 2200000, 2150000, 2250000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'June', 1900000, 1940000, 1925000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'July', 2400000, 2380000, 2420000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'August', 2600000, 2550000, 2580000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'September', 2100000, 2200000, 2150000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'October', 1800000, 1850000, 1825000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'November', 1700000, 1680000, 1720000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'December', 1600000, 1650000, 1625000),
-- Downtown Office Complex monthly data
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'January', 3200000, 3150000, 3250000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'February', 3800000, 4100000, 3900000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'March', 4100000, 3950000, 4150000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'April', 4500000, 4750000, 4600000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'May', 3900000, 3820000, 3950000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'June', 3400000, 3480000, 3450000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'July', 4200000, 4180000, 4250000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'August', 4600000, 4520000, 4580000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'September', 3700000, 3850000, 3750000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'October', 3200000, 3300000, 3250000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'November', 3000000, 2980000, 3020000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'December', 2800000, 2900000, 2850000),
-- Riverside Residential Complex monthly data  
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'January', 800000, 650000, 750000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'February', 900000, 720000, 850000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'March', 1200000, 980000, 1150000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'April', 1500000, 1450000, 1480000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'May', 1800000, 1750000, 1780000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'June', 2100000, 2080000, 2120000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'July', 2300000, 2250000, 2280000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'August', 2200000, 2180000, 2220000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'September', 1900000, 1920000, 1950000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'October', 1600000, 1650000, 1625000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'November', 1400000, 1380000, 1420000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'December', 1200000, 1250000, 1225000),
-- Tech Campus Expansion monthly data (completed project - historical)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'January', 500000, 480000, 520000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'February', 600000, 620000, 590000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'March', 800000, 750000, 780000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'April', 900000, 950000, 920000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'May', 1100000, 1080000, 1120000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'June', 1200000, 1220000, 1180000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'July', 1000000, 980000, 1020000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'August', 800000, 820000, 790000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'September', 600000, 650000, 620000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'October', 400000, 420000, 390000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'November', 300000, 280000, 320000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'December', 200000, 220000, 190000);

-- Cash Flow Data for all projects (12 months)
INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
-- Downtown Office Building cash flow
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'January', 2000000, 1750000, 250000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'February', 1800000, 2250000, -200000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'March', 2500000, 2180000, 120000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'April', 2200000, 2680000, -360000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'May', 2800000, 2150000, 290000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'June', 2400000, 1940000, 750000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'July', 2100000, 2380000, 470000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'August', 2600000, 2550000, 520000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'September', 2300000, 2200000, 620000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'October', 2000000, 1850000, 770000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'November', 1900000, 1680000, 990000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'December', 1800000, 1650000, 1140000),
-- Downtown Office Complex cash flow  
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'January', 3500000, 3150000, 350000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'February', 3200000, 4100000, -550000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'March', 4800000, 3950000, 300000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'April', 4200000, 4750000, -250000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'May', 5000000, 3820000, 930000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'June', 4300000, 3480000, 1750000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'July', 3800000, 4180000, 1370000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'August', 4700000, 4520000, 1550000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'September', 4100000, 3850000, 1800000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'October', 3600000, 3300000, 2100000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'November', 3400000, 2980000, 2520000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'December', 3200000, 2900000, 2820000),
-- Riverside Residential Complex cash flow
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'January', 1200000, 650000, 550000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'February', 1100000, 720000, 930000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'March', 1000000, 980000, 950000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'April', 1300000, 1450000, 800000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'May', 1600000, 1750000, 650000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'June', 1900000, 2080000, 470000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'July', 2200000, 2250000, 420000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'August', 2100000, 2180000, 340000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'September', 1800000, 1920000, 220000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'October', 1500000, 1650000, 70000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'November', 1300000, 1380000, -10000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'December', 1100000, 1250000, -160000),
-- Tech Campus Expansion cash flow (completed)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'January', 800000, 480000, 320000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'February', 700000, 620000, 400000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'March', 900000, 750000, 550000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'April', 800000, 950000, 400000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'May', 1000000, 1080000, 320000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'June', 1100000, 1220000, 200000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'July', 950000, 980000, 170000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'August', 750000, 820000, 100000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'September', 600000, 650000, 50000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'October', 500000, 420000, 130000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'November', 400000, 280000, 250000),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'December', 300000, 220000, 330000);

-- Cost Breakdown for all projects
INSERT INTO project_cost_breakdown (project_id, category, amount, percentage) VALUES
-- Downtown Office Building cost breakdown
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Construction', 15000000, 60.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Architecture/Engineering', 2500000, 10.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Site Work', 2000000, 8.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Permits & Fees', 1250000, 5.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Materials', 2750000, 11.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Other/Contingency', 1500000, 6.0),
-- Downtown Office Complex cost breakdown
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Construction', 27000000, 60.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Architecture/Engineering', 4500000, 10.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Site Work', 3600000, 8.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Permits & Fees', 2250000, 5.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Materials', 4950000, 11.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Other/Contingency', 2700000, 6.0),
-- Riverside Residential Complex cost breakdown
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Construction', 11100000, 60.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Architecture/Engineering', 1850000, 10.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Work', 1480000, 8.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Permits & Fees', 925000, 5.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Materials', 2035000, 11.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Other/Contingency', 1110000, 6.0),
-- Tech Campus Expansion cost breakdown
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Construction', 4200000, 60.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Architecture/Engineering', 700000, 10.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Engineering', 560000, 8.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Permits & Fees', 350000, 5.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Materials', 770000, 11.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Other/Contingency', 420000, 6.0);

-- Sample Transactions for all projects (5 recent per project)
INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
-- Downtown Office Building transactions
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 'Structural Steel Installation', 'Ironworks Construction LLC', -485000, 'Construction', 'paid'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-10', 'Electrical Systems Phase 2', 'Metro Electric Solutions', -295000, 'Construction', 'pending'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-08', 'Architectural Review Payment', 'Smith & Associates Architecture', -125000, 'Architecture/Engineering', 'paid'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-05', 'Construction Loan Draw', 'First National Bank', 2500000, 'Financing', 'paid'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-01', 'HVAC Equipment Delivery', 'Climate Control Systems', -385000, 'Materials', 'paid'),
-- Downtown Office Complex transactions
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-14', 'Curtain Wall Installation', 'Glass Facade Specialists', -825000, 'Construction', 'paid'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-11', 'Fire Safety Systems', 'SafeGuard Fire Protection', -425000, 'Construction', 'pending'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-09', 'Engineering Consulting Fee', 'Structural Engineering Group', -185000, 'Architecture/Engineering', 'paid'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-06', 'Construction Loan Draw', 'Metro Development Bank', 4200000, 'Financing', 'paid'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-03', 'Elevator Installation', 'Vertical Transportation Inc', -650000, 'Construction', 'paid'),
-- Riverside Residential Complex transactions
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-13', 'Site Preparation Phase 1', 'EarthWorks Excavation', -245000, 'Site Work', 'paid'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-07', 'Architectural Plans Revision', 'Residential Design Studios', -85000, 'Architecture/Engineering', 'pending'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-04', 'Environmental Impact Study', 'Green Consulting Partners', -125000, 'Permits & Fees', 'paid'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-02', 'Construction Loan Setup', 'Community Development Bank', 1200000, 'Financing', 'paid'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-11-28', 'Zoning Application Fee', 'City Planning Department', -45000, 'Permits & Fees', 'paid'),
-- Tech Campus Expansion transactions (completed project)
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-15', 'Final Construction Payment', 'TechBuild Contractors', -350000, 'Construction', 'paid'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-10', 'Occupancy Permit Fee', 'City Building Department', -15000, 'Permits & Fees', 'paid'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-08', 'IT Infrastructure Installation', 'Network Solutions Pro', -185000, 'Construction', 'paid'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-05', 'Final Inspection Services', 'Quality Assurance Group', -25000, 'Architecture/Engineering', 'paid'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-01', 'Project Completion Bonus', 'TechBuild Contractors', -85000, 'Construction', 'paid');

-- Daily Progress Data for all projects (last 7 days)
INSERT INTO project_daily_progress (project_id, progress_date, planned, actual, workforce) VALUES
-- Downtown Office Building daily progress
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-09', 52.1, 52.3, 145),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-10', 52.3, 52.5, 148),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-11', 52.5, 52.8, 142),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-12', 52.8, 53.1, 155),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-13', 53.1, 53.2, 150),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-14', 53.3, 53.5, 145),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 53.5, 53.8, 148),
-- Downtown Office Complex daily progress
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-09', 68.2, 68.7, 225),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-10', 68.5, 69.1, 228),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-11', 68.8, 69.3, 222),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-12', 69.1, 69.6, 235),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-13', 69.4, 69.8, 230),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-14', 69.7, 70.2, 225),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-15', 70.0, 70.5, 228),
-- Riverside Residential Complex daily progress
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-09', 8.1, 8.5, 25),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-10', 8.3, 8.7, 28),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-11', 8.5, 8.9, 22),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-12', 8.7, 9.1, 35),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-13', 8.9, 9.3, 30),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-14', 9.1, 9.5, 25),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-15', 9.3, 9.7, 28),
-- Tech Campus Expansion daily progress (completed - final week)
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-09', 98.5, 99.1, 15),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-10', 99.0, 99.5, 12),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-11', 99.3, 99.8, 8),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-12', 99.6, 100.0, 5),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-13', 99.8, 100.0, 3),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-14', 100.0, 100.0, 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-15', 100.0, 100.0, 0);

-- KPI Trends Data for all projects (12 weeks)
INSERT INTO project_kpi_trends (project_id, week, efficiency, quality, safety) VALUES
-- Downtown Office Building KPI trends
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 1', 88.5, 92.1, 94.8),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 2', 89.2, 93.5, 95.2),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 3', 87.8, 91.8, 96.1),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 4', 90.1, 94.2, 96.8),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 5', 91.5, 93.8, 95.5),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 6', 89.7, 92.6, 97.2),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 7', 92.3, 94.8, 96.4),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 8', 90.8, 93.2, 98.1),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 9', 93.1, 95.1, 97.6),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 10', 91.4, 94.5, 96.9),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 11', 94.2, 96.2, 98.5),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Week 12', 92.7, 94.9, 97.8);

-- Project Insights for all projects
INSERT INTO project_insights (project_id, summary, key_points, recommendations, alerts) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 
 'Downtown Office Building project is progressing well with strong financial performance and construction milestones being met ahead of schedule.',
 ARRAY['Budget utilization at 50% with 52.3% completion', 'ROI projection at 12.5% exceeds market average', 'Safety score maintains 96.8%', 'Pre-leasing at 72.5% above target'],
 ARRAY['Accelerate pre-leasing efforts to maximize revenue', 'Monitor weather impact on exterior work', 'Consider value engineering opportunities'],
 ARRAY['Monitor contingency usage closely', 'Weather delays possible in Q1 2025']),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'Downtown Office Complex showing excellent progress with strong market positioning and financial performance.',
 ARRAY['Construction 68.7% complete, 5 days ahead of schedule', 'Strong ROI at 13.8%', 'Pre-leasing at 68.2%', 'Quality metrics consistently above 90%'],
 ARRAY['Focus on MEP coordination for remaining floors', 'Increase marketing efforts for leasing', 'Optimize subcontractor scheduling'],
 ARRAY['Manage increased workforce safety protocols', 'Monitor material delivery schedules']),
('b2c3d4e5-f6a7-8901-bcde-f12345678901',
 'Riverside Residential Complex in early planning phase with strong market fundamentals and sustainable design focus.',
 ARRAY['Planning phase 8.5% complete', 'LEED Silver target achievable', 'Strong market demand for residential units', 'Community engagement at 68.9%'],
 ARRAY['Expedite permit approvals', 'Finalize contractor selection', 'Enhance community outreach programs'],
 ARRAY['Monitor zoning approval timeline', 'Weather considerations for site work']),
('c3d4e5f6-a7b8-9012-cdef-123456789012',
 'Tech Campus Expansion successfully completed with outstanding financial returns and occupancy performance.',
 ARRAY['Project completed 2 days ahead of schedule', 'Final ROI achieved 19.5%', '95.8% pre-leasing achieved', 'LEED Gold certification obtained'],
 ARRAY['Document lessons learned', 'Maintain tenant relationships', 'Monitor building performance metrics'],
 ARRAY['No active alerts - project complete']);

-- Project Timeline for all projects
INSERT INTO project_timeline (project_id, phase, start_date, end_date, status, progress) VALUES
-- Downtown Office Building timeline
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Planning & Design', '2023-01-15', '2023-06-30', 'Completed', 100.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Permits & Approvals', '2023-05-01', '2023-09-15', 'Completed', 100.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Site Preparation', '2023-09-01', '2023-11-30', 'Completed', 100.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Foundation Work', '2023-11-15', '2024-02-28', 'Completed', 100.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Structural Frame', '2024-02-15', '2024-08-30', 'Completed', 100.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'MEP Systems', '2024-06-01', '2025-03-15', 'In Progress', 68.5),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Interior Finishes', '2024-10-01', '2025-05-30', 'In Progress', 25.2),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Final Inspections', '2025-05-15', '2025-06-30', 'Planned', 0.0),
-- Downtown Office Complex timeline
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Planning & Design', '2022-08-01', '2023-02-28', 'Completed', 100.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Permits & Approvals', '2022-12-01', '2023-05-15', 'Completed', 100.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Site Preparation', '2023-04-01', '2023-07-31', 'Completed', 100.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Foundation Work', '2023-07-15', '2023-12-15', 'Completed', 100.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Structural Frame', '2023-11-01', '2024-06-30', 'Completed', 100.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MEP Systems', '2024-04-01', '2025-02-28', 'In Progress', 82.4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Interior Finishes', '2024-08-01', '2025-04-30', 'In Progress', 45.8),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Final Inspections', '2025-04-15', '2025-05-31', 'Planned', 0.0),
-- Riverside Residential Complex timeline
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Planning & Design', '2024-10-01', '2025-04-30', 'In Progress', 45.2),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Permits & Approvals', '2024-12-01', '2025-06-15', 'In Progress', 25.8),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Preparation', '2025-05-01', '2025-08-31', 'Planned', 0.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Foundation Work', '2025-08-15', '2025-12-15', 'Planned', 0.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Building Construction', '2025-11-01', '2026-08-30', 'Planned', 0.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Final Inspections', '2026-08-15', '2026-09-30', 'Planned', 0.0),
-- Tech Campus Expansion timeline (completed)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Planning & Design', '2023-06-01', '2023-09-30', 'Completed', 100.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Permits & Approvals', '2023-08-15', '2023-11-30', 'Completed', 100.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Site Preparation', '2023-11-01', '2023-12-15', 'Completed', 100.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Construction', '2023-12-01', '2024-09-30', 'Completed', 100.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Final Inspections', '2024-09-15', '2024-10-15', 'Completed', 100.0);

-- Project Team for all projects
INSERT INTO project_team (project_id, project_manager, architect, contractor, owner) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Sarah Johnson', 'Smith & Associates Architecture', 'Metro Construction Group', 'Downtown Development LLC'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Michael Chen', 'Urban Design Partners', 'Premier Building Contractors', 'Metropolitan Properties'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Jennifer Rodriguez', 'Residential Design Studios', 'Riverside Builders Inc', 'Community Housing Partners'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'David Thompson', 'Tech Architecture Group', 'TechBuild Contractors', 'Innovation Properties LLC');

-- Construction Specific Data for active projects

-- Construction Daily Progress
INSERT INTO construction_daily_progress (project_id, date, planned_progress, actual_progress, workforce_count, weather_conditions, notes) VALUES
-- Downtown Office Building construction progress
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 53.5, 53.8, 148, 'Clear', 'MEP rough-in progressing well on floors 8-10'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-14', 53.3, 53.5, 145, 'Partly Cloudy', 'Electrical conduit installation completed on floor 9'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-13', 53.1, 53.2, 150, 'Clear', 'HVAC equipment hoisting to upper floors'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-12', 52.8, 53.1, 155, 'Rain', 'Interior work focused due to weather'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-11', 52.5, 52.8, 142, 'Overcast', 'Plumbing rough-in on floors 7-8'),
-- Downtown Office Complex construction progress
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-15', 70.0, 70.5, 228, 'Clear', 'Curtain wall installation on floors 12-14'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-14', 69.7, 70.2, 225, 'Partly Cloudy', 'Fire protection systems testing on lower floors'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-13', 69.4, 69.8, 230, 'Clear', 'Elevator installation progressing on schedule'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-12', 69.1, 69.6, 235, 'Rain', 'Interior finishes on floors 8-10'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-11', 68.8, 69.3, 222, 'Overcast', 'MEP coordination meeting held');

-- Construction Trade Progress
INSERT INTO construction_trade_progress (project_id, trade, floor_level, progress_percentage, start_date, estimated_completion, notes) VALUES
-- Downtown Office Building trade progress
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Electrical', 'Floor 10', 75.5, '2024-11-01', '2025-01-15', 'Conduit and wiring in progress'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Plumbing', 'Floor 9', 82.3, '2024-10-15', '2024-12-30', 'Rough-in nearing completion'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'HVAC', 'Floor 8', 68.9, '2024-11-15', '2025-02-28', 'Ductwork installation underway'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Fire Protection', 'Floor 7', 91.2, '2024-09-01', '2024-12-20', 'Sprinkler system testing'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Drywall', 'Floor 6', 45.8, '2024-12-01', '2025-03-15', 'Metal framing in progress'),
-- Downtown Office Complex trade progress
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Electrical', 'Floor 15', 85.2, '2024-08-01', '2025-01-30', 'Final connections on upper floors'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Plumbing', 'Floor 14', 92.1, '2024-07-15', '2024-12-31', 'Fixtures installation beginning'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'HVAC', 'Floor 13', 78.6, '2024-09-01', '2025-02-15', 'VAV boxes and controls'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Curtain Wall', 'Floor 12', 65.4, '2024-10-01', '2025-03-30', 'Glass installation in progress'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Elevators', 'All Floors', 72.8, '2024-06-01', '2025-04-15', 'Car installation and testing');

-- Construction Activities
INSERT INTO construction_activities (project_id, activity_date, activity_type, description, trade, impact_level, status) VALUES
-- Downtown Office Building activities
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 'Installation', 'MEP rough-in coordination meeting', 'Multiple Trades', 'Medium', 'Completed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-14', 'Quality Control', 'Electrical rough-in inspection floor 9', 'Electrical', 'Low', 'Passed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-13', 'Delivery', 'HVAC equipment crane lift to floors 8-10', 'HVAC', 'High', 'Completed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-12', 'Safety', 'Monthly safety training session', 'All Trades', 'Medium', 'Completed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-11', 'Installation', 'Plumbing rough-in floors 7-8', 'Plumbing', 'Medium', 'In Progress'),
-- Downtown Office Complex activities
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-15', 'Installation', 'Curtain wall glazing floors 12-14', 'Curtain Wall', 'High', 'In Progress'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-14', 'Testing', 'Fire protection system commissioning', 'Fire Protection', 'High', 'Completed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-13', 'Installation', 'Elevator car installation tower 2', 'Elevators', 'High', 'In Progress'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-12', 'Quality Control', 'MEP coordination review floors 8-10', 'Multiple Trades', 'Medium', 'Completed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-11', 'Installation', 'Interior finishes floors 8-10', 'Interior', 'Medium', 'In Progress');

-- Construction Quality Metrics
INSERT INTO construction_quality_metrics (project_id, week_ending, defect_count, rework_hours, inspection_pass_rate, quality_score, notes) VALUES
-- Downtown Office Building quality metrics
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 3, 24, 96.2, 94.2, 'Minor electrical routing corrections'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-08', 2, 16, 97.5, 95.8, 'Plumbing alignment adjustments'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-01', 4, 32, 94.8, 93.1, 'HVAC ductwork modifications'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-11-24', 1, 8, 98.2, 96.5, 'Excellent week for quality'),
-- Downtown Office Complex quality metrics
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-15', 5, 40, 93.8, 91.5, 'Curtain wall tolerances reviewed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-08', 3, 24, 95.5, 93.2, 'Elevator alignment corrections'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-01', 6, 48, 92.1, 90.8, 'MEP coordination challenges'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-11-24', 2, 16, 96.8, 94.5, 'Fire protection systems passed');

-- Material Deliveries
INSERT INTO material_deliveries (project_id, delivery_date, material_type, supplier, quantity, unit, status, notes) VALUES
-- Downtown Office Building deliveries
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-16', 'Electrical conduit', 'Metro Electric Supply', 500, 'linear feet', 'Scheduled', 'For floors 11-12'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-18', 'HVAC ductwork', 'Climate Control Systems', 25, 'sections', 'Scheduled', 'Custom fabricated sections'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-20', 'Plumbing fixtures', 'ProPlumb Wholesale', 45, 'units', 'Scheduled', 'Restroom fixtures floor 6-10'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 'Drywall sheets', 'BuildMart Supply', 200, 'sheets', 'Delivered', 'Standard 5/8 inch sheets'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-14', 'Steel beams', 'Ironworks Construction LLC', 12, 'beams', 'Delivered', 'Structural steel for floor 10'),
-- Downtown Office Complex deliveries
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-17', 'Curtain wall panels', 'Glass Facade Specialists', 30, 'panels', 'Scheduled', 'For floors 13-15'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-19', 'Elevator components', 'Vertical Transportation Inc', 1, 'car', 'Scheduled', 'Car 4 for Tower 2'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-22', 'Fire protection sprinklers', 'SafeGuard Fire Protection', 150, 'heads', 'Scheduled', 'For floors 12-14'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-15', 'Lighting fixtures', 'Illumination Solutions', 85, 'fixtures', 'Delivered', 'LED office lighting'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-14', 'Flooring materials', 'Premium Flooring Co', 2500, 'sq ft', 'Delivered', 'Luxury vinyl plank');

-- Safety Metrics
INSERT INTO safety_metrics (project_id, days_without_incident, total_incidents_ytd, near_miss_reports, safety_training_hours, ppe_compliance_rate, safety_score) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 45, 2, 8, 156, 98.5, 96.8),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 32, 3, 12, 289, 97.2, 94.2),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 128, 0, 2, 45, 99.5, 99.2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 85, 1, 5, 198, 98.8, 97.5);

-- Safety Incidents
INSERT INTO safety_incidents (project_id, incident_date, incident_type, severity, description, corrective_action, status) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-10-28', 'Minor Injury', 'Low', 'Worker cut finger on metal edge', 'Added edge protection, reviewed safe handling procedures', 'Closed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-08-15', 'Near Miss', 'Medium', 'Material almost fell from crane', 'Enhanced rigging inspection protocols', 'Closed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-11-12', 'Minor Injury', 'Low', 'Slip on wet surface', 'Improved drainage and warning signage', 'Closed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-09-22', 'Equipment', 'Medium', 'Scaffold component failure', 'All scaffolding re-inspected and certified', 'Closed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-07-08', 'Near Miss', 'Low', 'Electrical near miss during rough-in', 'LOTO procedures reinforced', 'Closed'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-06-18', 'Minor Injury', 'Low', 'Bruised hand from falling tool', 'Tool tethering requirements implemented', 'Closed');

-- Safety Training
INSERT INTO safety_training (project_id, worker_name, training_type, completion_date, expiration_date, trainer, status) VALUES
-- Downtown Office Building safety training
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'John Smith', 'OSHA 10-Hour', '2024-11-15', '2025-11-15', 'Safety Solutions Inc', 'Current'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Maria Garcia', 'Fall Protection', '2024-12-01', '2025-12-01', 'Safety Solutions Inc', 'Current'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Robert Johnson', 'Crane Safety', '2024-10-20', '2025-10-20', 'Crane Training Center', 'Current'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Lisa Chen', 'Electrical Safety', '2024-09-15', '2025-09-15', 'Electrical Safety Institute', 'Current'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'David Miller', 'Confined Space', '2024-08-10', '2025-08-10', 'Safety Solutions Inc', 'Expiring Soon'),
-- Downtown Office Complex safety training
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sarah Wilson', 'OSHA 30-Hour', '2024-12-05', '2026-12-05', 'Safety Solutions Inc', 'Current'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Michael Brown', 'Scaffold Safety', '2024-11-20', '2025-11-20', 'Scaffold Training Center', 'Current'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Jennifer Davis', 'First Aid/CPR', '2024-10-10', '2025-10-10', 'Red Cross Training', 'Current'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kevin Martinez', 'Fire Safety', '2024-09-25', '2025-09-25', 'Fire Safety Institute', 'Current'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Amanda Taylor', 'Hazmat Handling', '2024-07-15', '2025-07-15', 'Environmental Safety Corp', 'Current');

COMMIT;

-- Summary Report
SELECT 
    p.name as project_name,
    p.status,
    pfm.total_budget / 1000000.0 as budget_millions,
    pfm.spent_to_date / 1000000.0 as spent_millions,
    pfm.roi * 100 as roi_percent,
    pcm.overall_progress as construction_progress,
    pcm.safety_score
FROM projects p
LEFT JOIN project_financial_metrics pfm ON p.id = pfm.project_id
LEFT JOIN project_construction_metrics pcm ON p.id = pcm.project_id
ORDER BY p.name;

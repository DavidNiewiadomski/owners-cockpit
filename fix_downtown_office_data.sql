-- Add missing metric data for Downtown Office Building (a4ca8398-53b0-4791-bef3-fa2d3ca18e79)

-- Add financial metrics
INSERT INTO project_financial_metrics (
  project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, 
  contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections
) VALUES (
  'a4ca8398-53b0-4791-bef3-fa2d3ca18e79',
  28500000, 14250000, 28200000, 350000, 1150000, 0.142, 6200000, 14.8, 295, 36000000, 72.5
);

-- Add construction metrics
INSERT INTO project_construction_metrics (
  project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors,
  completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals
) VALUES (
  'a4ca8398-53b0-4791-bef3-fa2d3ca18e79',
  68, -3, 42, 9, 11, 16, 94, 98, 3, 5
);

-- Add facilities metrics
INSERT INTO project_facilities_metrics (
  project_id, operational_readiness, systems_commissioned, maintenance_planned, 
  energy_performance, occupancy_readiness
) VALUES (
  'a4ca8398-53b0-4791-bef3-fa2d3ca18e79',
  78, 85, 92, 89, 82
);

-- Add legal metrics
INSERT INTO project_legal_metrics (
  project_id, contracts_active, contracts_pending, compliance_score, 
  permit_status, legal_risks, documentation_complete
) VALUES (
  'a4ca8398-53b0-4791-bef3-fa2d3ca18e79',
  12, 2, 96, 'approved', 1, 94
);

-- Add design metrics
INSERT INTO project_design_metrics (
  project_id, design_progress, approved_drawings, total_drawings, 
  revision_cycles, stakeholder_approvals, design_changes
) VALUES (
  'a4ca8398-53b0-4791-bef3-fa2d3ca18e79',
  89, 78, 89, 2, 92, 7
);

-- Add sustainability metrics
INSERT INTO project_sustainability_metrics (
  project_id, leed_target, current_score, energy_efficiency, 
  carbon_reduction, sustainable_materials, certifications
) VALUES (
  'a4ca8398-53b0-4791-bef3-fa2d3ca18e79',
  'Gold', 76, 88, 42, 67, ARRAY['ENERGY_STAR', 'LEED_GOLD_TARGET']
);

-- Add some monthly spend data
INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'January', 2100000, 2050000, 2080000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'February', 2200000, 2180000, 2190000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'March', 2300000, 2350000, 2325000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'April', 2400000, 2380000, 2390000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'May', 2500000, 2520000, 2510000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'June', 2600000, 2570000, 2585000);

-- Add some cash flow data
INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'January', 3000000, 2050000, 950000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'February', 2500000, 2180000, 1270000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'March', 2200000, 2350000, 1120000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'April', 2800000, 2380000, 1540000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'May', 2600000, 2520000, 1620000),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'June', 2400000, 2570000, 1450000);

-- Add some transactions
INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-08-15', 'Steel beam delivery', 'Metro Steel Supply', -125000, 'Materials', 'paid'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-08-14', 'Electrical rough-in', 'PowerTech Electric', -85000, 'Labor', 'paid'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-08-13', 'HVAC equipment', 'Climate Control Systems', -156000, 'Equipment', 'pending'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-08-12', 'Concrete pour', 'Premier Concrete', -92000, 'Materials', 'paid'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-08-11', 'Architect fee', 'Design Partners LLC', -45000, 'Professional Services', 'paid');

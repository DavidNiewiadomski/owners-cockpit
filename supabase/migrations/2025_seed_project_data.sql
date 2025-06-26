-- Data seeding script to populate all project metrics tables with comprehensive sample data

-- First, insert the sample projects if they don't exist
INSERT INTO projects (id, name, description, status, start_date, end_date, org_id, created_at, updated_at, owner_id) VALUES
('11111111-1111-1111-1111-111111111111', 'Downtown Office Building', 'A 12-story modern office building project in downtown area with sustainable design features.', 'active', '2024-01-15', '2024-12-31', '00000000-0000-0000-0000-000000000000', '2024-01-01T00:00:00Z', '2024-06-20T00:00:00Z', '12345678-1234-1234-1234-123456789012'),
('22222222-2222-2222-2222-222222222222', 'Residential Complex Phase 1', 'Construction of 50-unit residential complex with modern amenities and green spaces.', 'planning', '2024-03-01', '2025-02-28', '00000000-0000-0000-0000-000000000000', '2024-01-01T00:00:00Z', '2024-06-20T00:00:00Z', '12345678-1234-1234-1234-123456789012'),
('33333333-3333-3333-3333-333333333333', 'Highway Bridge Renovation', 'Major renovation and structural upgrades to the Main Street bridge infrastructure.', 'active', '2024-02-01', '2024-10-31', '00000000-0000-0000-0000-000000000000', '2024-01-01T00:00:00Z', '2024-06-20T00:00:00Z', '12345678-1234-1234-1234-123456789012')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  updated_at = EXCLUDED.updated_at;

-- Seed financial metrics for all projects
INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
('11111111-1111-1111-1111-111111111111', 52000000, 35400000, 51200000, 1200000, 1400000, 16.8, 8500000, 22.1, 347, 68000000, 28800000),
('22222222-2222-2222-2222-222222222222', 28500000, 2850000, 28200000, 150000, 1275000, 14.2, 5200000, 18.5, 285, 35000000, 18200000),
('33333333-3333-3333-3333-333333333333', 12500000, 8750000, 12200000, 420000, 580000, 8.5, 2100000, 12.3, 156, 18000000, 0)
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

-- Seed construction metrics for all projects
INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
('11111111-1111-1111-1111-111111111111', 68, 3, 145, 12, 8, 12, 94, 97, 23, 8),
('22222222-2222-2222-2222-222222222222', 15, 2, 25, 4, 2, 18, 0, 95, 8, 15),
('33333333-3333-3333-3333-333333333333', 82, 8, 85, 8, 6, 8, 96, 99, 5, 3)
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

-- Seed executive metrics for all projects
INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
('11111111-1111-1111-1111-111111111111', 68000000, 24, 25, 88, 92),
('22222222-2222-2222-2222-222222222222', 35000000, 18, 32, 85, 88),
('33333333-3333-3333-3333-333333333333', 18000000, 15, 18, 95, 85)
ON CONFLICT (project_id) DO UPDATE SET
  portfolio_value = EXCLUDED.portfolio_value,
  stakeholders = EXCLUDED.stakeholders,
  risk_score = EXCLUDED.risk_score,
  strategic_alignment = EXCLUDED.strategic_alignment,
  market_position = EXCLUDED.market_position;

-- Seed legal metrics for all projects
INSERT INTO project_legal_metrics (project_id, contracts_active, contracts_pending, compliance_score, permit_status, legal_risks, documentation_complete) VALUES
('11111111-1111-1111-1111-111111111111', 15, 2, 96, 'All Approved', 2, 94),
('22222222-2222-2222-2222-222222222222', 8, 6, 88, 'In Review', 3, 78),
('33333333-3333-3333-3333-333333333333', 12, 0, 98, 'All Approved', 1, 98)
ON CONFLICT (project_id) DO UPDATE SET
  contracts_active = EXCLUDED.contracts_active,
  contracts_pending = EXCLUDED.contracts_pending,
  compliance_score = EXCLUDED.compliance_score,
  permit_status = EXCLUDED.permit_status,
  legal_risks = EXCLUDED.legal_risks,
  documentation_complete = EXCLUDED.documentation_complete;

-- Seed design metrics for all projects
INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
('11111111-1111-1111-1111-111111111111', 95, 127, 134, 3, 18, 12),
('22222222-2222-2222-2222-222222222222', 75, 45, 68, 2, 12, 8),
('33333333-3333-3333-3333-333333333333', 100, 58, 58, 1, 15, 3)
ON CONFLICT (project_id) DO UPDATE SET
  design_progress = EXCLUDED.design_progress,
  approved_drawings = EXCLUDED.approved_drawings,
  total_drawings = EXCLUDED.total_drawings,
  revision_cycles = EXCLUDED.revision_cycles,
  stakeholder_approvals = EXCLUDED.stakeholder_approvals,
  design_changes = EXCLUDED.design_changes;

-- Seed sustainability metrics for all projects
INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
('11111111-1111-1111-1111-111111111111', 'Gold', 68, 35, 28, 60, ARRAY['LEED Gold Target', 'ENERGY STAR Design', 'Green Building Certification']),
('22222222-2222-2222-2222-222222222222', 'Silver', 45, 25, 20, 45, ARRAY['LEED Silver Target', 'ENERGY STAR Design']),
('33333333-3333-3333-3333-333333333333', 'N/A', 0, 15, 12, 35, ARRAY['Environmental Compliance', 'Material Recycling'])
ON CONFLICT (project_id) DO UPDATE SET
  leed_target = EXCLUDED.leed_target,
  current_score = EXCLUDED.current_score,
  energy_efficiency = EXCLUDED.energy_efficiency,
  carbon_reduction = EXCLUDED.carbon_reduction,
  sustainable_materials = EXCLUDED.sustainable_materials,
  certifications = EXCLUDED.certifications;

-- Seed facilities metrics for all projects
INSERT INTO project_facilities_metrics (project_id, operational_readiness, systems_commissioned, maintenance_planned, energy_performance, occupancy_readiness) VALUES
('11111111-1111-1111-1111-111111111111', 35, 12, 85, 88, 40),
('22222222-2222-2222-2222-222222222222', 15, 0, 60, 75, 20),
('33333333-3333-3333-3333-333333333333', 75, 8, 95, 82, 85)
ON CONFLICT (project_id) DO UPDATE SET
  operational_readiness = EXCLUDED.operational_readiness,
  systems_commissioned = EXCLUDED.systems_commissioned,
  maintenance_planned = EXCLUDED.maintenance_planned,
  energy_performance = EXCLUDED.energy_performance,
  occupancy_readiness = EXCLUDED.occupancy_readiness;

-- Seed planning metrics for all projects
INSERT INTO project_planning_metrics (project_id, master_plan_approval, zoning_compliance, community_engagement, regulatory_approvals, feasibility_complete) VALUES
('11111111-1111-1111-1111-111111111111', 100, 100, 92, 98, 100),
('22222222-2222-2222-2222-222222222222', 95, 98, 88, 75, 90),
('33333333-3333-3333-3333-333333333333', 100, 100, 95, 100, 100)
ON CONFLICT (project_id) DO UPDATE SET
  master_plan_approval = EXCLUDED.master_plan_approval,
  zoning_compliance = EXCLUDED.zoning_compliance,
  community_engagement = EXCLUDED.community_engagement,
  regulatory_approvals = EXCLUDED.regulatory_approvals,
  feasibility_complete = EXCLUDED.feasibility_complete;

-- Seed preconstruction metrics for all projects
INSERT INTO project_preconstruction_metrics (project_id, design_development, bidding_progress, contractor_selection, permit_submissions, value_engineering) VALUES
('11111111-1111-1111-1111-111111111111', 100, 100, 100, 100, 95),
('22222222-2222-2222-2222-222222222222', 75, 25, 40, 65, 70),
('33333333-3333-3333-3333-333333333333', 100, 100, 100, 100, 100)
ON CONFLICT (project_id) DO UPDATE SET
  design_development = EXCLUDED.design_development,
  bidding_progress = EXCLUDED.bidding_progress,
  contractor_selection = EXCLUDED.contractor_selection,
  permit_submissions = EXCLUDED.permit_submissions,
  value_engineering = EXCLUDED.value_engineering;

-- Seed monthly spend data for all projects
INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
-- Downtown Office Building
('11111111-1111-1111-1111-111111111111', 'Jan', 2100000, 1950000, 2000000),
('11111111-1111-1111-1111-111111111111', 'Feb', 2100000, 2250000, 2200000),
('11111111-1111-1111-1111-111111111111', 'Mar', 2100000, 2050000, 2100000),
('11111111-1111-1111-1111-111111111111', 'Apr', 2100000, 2180000, 2150000),
('11111111-1111-1111-1111-111111111111', 'May', 2100000, 2020000, 2080000),
('11111111-1111-1111-1111-111111111111', 'Jun', 2100000, 2200000, 2180000),
-- Residential Complex
('22222222-2222-2222-2222-222222222222', 'Mar', 500000, 475000, 480000),
('22222222-2222-2222-2222-222222222222', 'Apr', 600000, 625000, 610000),
('22222222-2222-2222-2222-222222222222', 'May', 550000, 540000, 545000),
('22222222-2222-2222-2222-222222222222', 'Jun', 750000, 780000, 765000),
('22222222-2222-2222-2222-222222222222', 'Jul', 850000, 0, 850000),
('22222222-2222-2222-2222-222222222222', 'Aug', 900000, 0, 900000),
-- Highway Bridge
('33333333-3333-3333-3333-333333333333', 'Feb', 800000, 750000, 775000),
('33333333-3333-3333-3333-333333333333', 'Mar', 1200000, 1250000, 1225000),
('33333333-3333-3333-3333-333333333333', 'Apr', 1400000, 1380000, 1390000),
('33333333-3333-3333-3333-333333333333', 'May', 1600000, 1620000, 1610000),
('33333333-3333-3333-3333-333333333333', 'Jun', 1800000, 1850000, 1825000),
('33333333-3333-3333-3333-333333333333', 'Jul', 2000000, 0, 2000000)
ON CONFLICT (project_id, month) DO UPDATE SET
  budget = EXCLUDED.budget,
  actual = EXCLUDED.actual,
  forecast = EXCLUDED.forecast;

-- Seed cash flow data for all projects
INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
-- Downtown Office Building
('11111111-1111-1111-1111-111111111111', 'Jan 2024', 0, 1200000, -1200000),
('11111111-1111-1111-1111-111111111111', 'Feb 2024', 0, 1450000, -2650000),
('11111111-1111-1111-1111-111111111111', 'Mar 2024', 0, 1680000, -4330000),
('11111111-1111-1111-1111-111111111111', 'Apr 2024', 0, 1520000, -5850000),
('11111111-1111-1111-1111-111111111111', 'May 2024', 0, 1750000, -7600000),
('11111111-1111-1111-1111-111111111111', 'Jun 2024', 2400000, 1800000, -7000000),
-- Residential Complex
('22222222-2222-2222-2222-222222222222', 'Mar 2024', 0, 475000, -475000),
('22222222-2222-2222-2222-222222222222', 'Apr 2024', 0, 625000, -1100000),
('22222222-2222-2222-2222-222222222222', 'May 2024', 0, 540000, -1640000),
('22222222-2222-2222-2222-222222222222', 'Jun 2024', 0, 780000, -2420000),
('22222222-2222-2222-2222-222222222222', 'Jul 2024', 850000, 850000, -2420000),
('22222222-2222-2222-2222-222222222222', 'Aug 2024', 1200000, 900000, -2120000),
-- Highway Bridge
('33333333-3333-3333-3333-333333333333', 'Feb 2024', 12500000, 750000, 11750000),
('33333333-3333-3333-3333-333333333333', 'Mar 2024', 0, 1250000, 10500000),
('33333333-3333-3333-3333-333333333333', 'Apr 2024', 0, 1380000, 9120000),
('33333333-3333-3333-3333-333333333333', 'May 2024', 0, 1620000, 7500000),
('33333333-3333-3333-3333-333333333333', 'Jun 2024', 0, 1850000, 5650000),
('33333333-3333-3333-3333-333333333333', 'Jul 2024', 0, 2000000, 3650000)
ON CONFLICT (project_id, month) DO UPDATE SET
  inflow = EXCLUDED.inflow,
  outflow = EXCLUDED.outflow,
  cumulative = EXCLUDED.cumulative;

-- Seed cost breakdown data for all projects
INSERT INTO project_cost_breakdown (project_id, category, amount, percentage) VALUES
-- Downtown Office Building
('11111111-1111-1111-1111-111111111111', 'Construction', 18500000, 77.1),
('11111111-1111-1111-1111-111111111111', 'Architecture/Engineering', 2050000, 8.5),
('11111111-1111-1111-1111-111111111111', 'Site Work', 1200000, 5.0),
('11111111-1111-1111-1111-111111111111', 'Permits & Fees', 850000, 3.5),
('11111111-1111-1111-1111-111111111111', 'Other/Contingency', 1400000, 5.9),
-- Residential Complex
('22222222-2222-2222-2222-222222222222', 'Construction', 22000000, 78.5),
('22222222-2222-2222-2222-222222222222', 'Architecture/Engineering', 2280000, 8.0),
('22222222-2222-2222-2222-222222222222', 'Site Work', 1425000, 5.0),
('22222222-2222-2222-2222-222222222222', 'Permits & Fees', 855000, 3.0),
('22222222-2222-2222-2222-222222222222', 'Other/Contingency', 1540000, 5.5),
-- Highway Bridge
('33333333-3333-3333-3333-333333333333', 'Structural Work', 8500000, 68.0),
('33333333-3333-3333-3333-333333333333', 'Engineering', 1875000, 15.0),
('33333333-3333-3333-3333-333333333333', 'Traffic Management', 1250000, 10.0),
('33333333-3333-3333-3333-333333333333', 'Materials', 625000, 5.0),
('33333333-3333-3333-3333-333333333333', 'Other/Contingency', 250000, 2.0)
ON CONFLICT (project_id, category) DO UPDATE SET
  amount = EXCLUDED.amount,
  percentage = EXCLUDED.percentage;

-- Seed transaction data for all projects
INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
-- Downtown Office Building
('11111111-1111-1111-1111-111111111111', '2024-06-20', 'Steel Supplier Payment - Floors 7-9', 'Metropolitan Steel Supply', -89450, 'Materials', 'paid'),
('11111111-1111-1111-1111-111111111111', '2024-06-18', 'Monthly Progress Payment - GC', 'BuildTech Solutions', -1850000, 'Construction', 'paid'),
('11111111-1111-1111-1111-111111111111', '2024-06-15', 'Tenant Deposit - TechCorp', 'TechCorp Solutions', 137500, 'Pre-leasing', 'received'),
-- Residential Complex
('22222222-2222-2222-2222-222222222222', '2024-06-18', 'Architectural Design Services Payment', 'Elena Rodriguez Architecture', -125000, 'Design', 'paid'),
('22222222-2222-2222-2222-222222222222', '2024-06-10', 'Site Survey and Soil Testing', 'GeoTech Engineering', -45000, 'Site Work', 'paid'),
('22222222-2222-2222-2222-222222222222', '2024-06-05', 'Pre-development Deposit', 'City Planning Department', -25000, 'Permits', 'paid'),
-- Highway Bridge
('33333333-3333-3333-3333-333333333333', '2024-06-19', 'Steel Reinforcement Materials', 'Industrial Steel Corp', -340000, 'Materials', 'paid'),
('33333333-3333-3333-3333-333333333333', '2024-06-15', 'Monthly Progress Payment', 'Heavy Construction LLC', -1550000, 'Construction', 'paid'),
('33333333-3333-3333-3333-333333333333', '2024-06-10', 'Traffic Control Services', 'Metro Traffic Solutions', -85000, 'Traffic Management', 'paid')
ON CONFLICT (project_id, transaction_date, description) DO UPDATE SET
  vendor = EXCLUDED.vendor,
  amount = EXCLUDED.amount,
  category = EXCLUDED.category,
  status = EXCLUDED.status;

-- Seed daily progress data for all projects
INSERT INTO project_daily_progress (project_id, progress_date, planned, actual, workforce) VALUES
-- Downtown Office Building
('11111111-1111-1111-1111-111111111111', '2024-06-15', 65, 67, 142),
('11111111-1111-1111-1111-111111111111', '2024-06-16', 65.5, 67.2, 145),
('11111111-1111-1111-1111-111111111111', '2024-06-17', 66, 67.8, 148),
('11111111-1111-1111-1111-111111111111', '2024-06-18', 66.5, 68.1, 144),
('11111111-1111-1111-1111-111111111111', '2024-06-19', 67, 68.5, 149),
('11111111-1111-1111-1111-111111111111', '2024-06-20', 67.5, 68.8, 145),
('11111111-1111-1111-1111-111111111111', '2024-06-21', 68, 69.2, 152),
-- Residential Complex
('22222222-2222-2222-2222-222222222222', '2024-06-15', 14, 14.5, 22),
('22222222-2222-2222-2222-222222222222', '2024-06-16', 14.2, 14.8, 25),
('22222222-2222-2222-2222-222222222222', '2024-06-17', 14.4, 15.1, 28),
('22222222-2222-2222-2222-222222222222', '2024-06-18', 14.6, 15.3, 24),
('22222222-2222-2222-2222-222222222222', '2024-06-19', 14.8, 15.5, 29),
('22222222-2222-2222-2222-222222222222', '2024-06-20', 15, 15.8, 25),
('22222222-2222-2222-2222-222222222222', '2024-06-21', 15.2, 16, 30),
-- Highway Bridge
('33333333-3333-3333-3333-333333333333', '2024-06-15', 80, 82, 82),
('33333333-3333-3333-3333-333333333333', '2024-06-16', 80.5, 82.3, 85),
('33333333-3333-3333-3333-333333333333', '2024-06-17', 81, 82.6, 88),
('33333333-3333-3333-3333-333333333333', '2024-06-18', 81.5, 82.8, 84),
('33333333-3333-3333-3333-333333333333', '2024-06-19', 82, 83.1, 89),
('33333333-3333-3333-3333-333333333333', '2024-06-20', 82.5, 83.4, 85),
('33333333-3333-3333-3333-333333333333', '2024-06-21', 83, 83.7, 92)
ON CONFLICT (project_id, progress_date) DO UPDATE SET
  planned = EXCLUDED.planned,
  actual = EXCLUDED.actual,
  workforce = EXCLUDED.workforce;

-- Seed KPI trends data for all projects
INSERT INTO project_kpi_trends (project_id, week, efficiency, quality, safety) VALUES
-- Downtown Office Building
('11111111-1111-1111-1111-111111111111', 'W1', 78, 92, 98),
('11111111-1111-1111-1111-111111111111', 'W2', 82, 89, 97),
('11111111-1111-1111-1111-111111111111', 'W3', 85, 94, 99),
('11111111-1111-1111-1111-111111111111', 'W4', 88, 96, 98),
-- Residential Complex
('22222222-2222-2222-2222-222222222222', 'W1', 72, 0, 95),
('22222222-2222-2222-2222-222222222222', 'W2', 76, 0, 94),
('22222222-2222-2222-2222-222222222222', 'W3', 78, 0, 96),
('22222222-2222-2222-2222-222222222222', 'W4', 81, 0, 95),
-- Highway Bridge
('33333333-3333-3333-3333-333333333333', 'W1', 88, 94, 99),
('33333333-3333-3333-3333-333333333333', 'W2', 91, 96, 98),
('33333333-3333-3333-3333-333333333333', 'W3', 93, 97, 100),
('33333333-3333-3333-3333-333333333333', 'W4', 95, 98, 99)
ON CONFLICT (project_id, week) DO UPDATE SET
  efficiency = EXCLUDED.efficiency,
  quality = EXCLUDED.quality,
  safety = EXCLUDED.safety;

-- Seed project insights data for all projects
INSERT INTO project_insights (project_id, summary, key_points, recommendations, alerts) VALUES
('11111111-1111-1111-1111-111111111111', 
 'Project is progressing well with structural work 68% complete. On track for year-end completion.',
 ARRAY['Structural steel installation ahead of schedule', 'Weather delays minimal this quarter', 'Subcontractor performance exceeding expectations', 'Budget variance within acceptable range'],
 ARRAY['Accelerate MEP coordination meetings', 'Finalize interior tenant requirements', 'Review winter weather contingencies', 'Update stakeholder communications'],
 ARRAY['Material delivery scheduled for next week', 'City inspection required for structural completion']),
('22222222-2222-2222-2222-222222222222',
 'Design phase progressing well with 75% completion. Preparing for permit submissions next quarter.',
 ARRAY['Architectural drawings 80% complete', 'Community engagement sessions completed', 'Environmental impact assessment approved', 'Pre-leasing interest exceeding projections'],
 ARRAY['Expedite final design reviews', 'Prepare permit submission packages', 'Finalize contractor pre-qualification', 'Update construction phasing plan'],
 ARRAY['Design review meeting scheduled for next week', 'Permit application deadline approaching']),
('33333333-3333-3333-3333-333333333333',
 'Structural repairs ahead of schedule at 82% completion. Preparing for deck replacement phase.',
 ARRAY['Structural steel reinforcement completed', 'Traffic management plan working effectively', 'Weather has been favorable for outdoor work', 'Material quality exceeding specifications'],
 ARRAY['Prepare for deck replacement phase mobilization', 'Coordinate with traffic control authorities', 'Update public communications on progress', 'Review contingencies for autumn weather'],
 ARRAY['Deck materials delivery scheduled for August 1st', 'Traffic impact assessment due next week'])
ON CONFLICT (project_id) DO UPDATE SET
  summary = EXCLUDED.summary,
  key_points = EXCLUDED.key_points,
  recommendations = EXCLUDED.recommendations,
  alerts = EXCLUDED.alerts;

-- Seed project timeline data for all projects
INSERT INTO project_timeline (project_id, phase, start_date, end_date, status, progress) VALUES
-- Downtown Office Building
('11111111-1111-1111-1111-111111111111', 'Pre-Construction', '2024-01-15', '2024-03-30', 'completed', 100),
('11111111-1111-1111-1111-111111111111', 'Foundation', '2024-04-01', '2024-06-15', 'completed', 100),
('11111111-1111-1111-1111-111111111111', 'Structure', '2024-06-16', '2024-09-30', 'active', 68),
('11111111-1111-1111-1111-111111111111', 'MEP & Interiors', '2024-10-01', '2024-12-15', 'upcoming', 0),
('11111111-1111-1111-1111-111111111111', 'Final Commissioning', '2024-12-16', '2024-12-31', 'upcoming', 0),
-- Residential Complex
('22222222-2222-2222-2222-222222222222', 'Planning & Design', '2024-03-01', '2024-06-30', 'active', 75),
('22222222-2222-2222-2222-222222222222', 'Permit & Approvals', '2024-07-01', '2024-09-15', 'upcoming', 0),
('22222222-2222-2222-2222-222222222222', 'Site Preparation', '2024-09-16', '2024-11-30', 'upcoming', 0),
('22222222-2222-2222-2222-222222222222', 'Construction', '2024-12-01', '2025-01-31', 'upcoming', 0),
('22222222-2222-2222-2222-222222222222', 'Final Inspections', '2025-02-01', '2025-02-28', 'upcoming', 0),
-- Highway Bridge
('33333333-3333-3333-3333-333333333333', 'Inspection & Assessment', '2024-02-01', '2024-03-15', 'completed', 100),
('33333333-3333-3333-3333-333333333333', 'Structural Repairs', '2024-03-16', '2024-07-31', 'active', 82),
('33333333-3333-3333-3333-333333333333', 'Deck Replacement', '2024-08-01', '2024-09-30', 'upcoming', 0),
('33333333-3333-3333-3333-333333333333', 'Final Testing', '2024-10-01', '2024-10-31', 'upcoming', 0)
ON CONFLICT (project_id, phase) DO UPDATE SET
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status,
  progress = EXCLUDED.progress;

-- Seed project team data for all projects
INSERT INTO project_team (project_id, project_manager, architect, contractor, owner) VALUES
('11111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'Michael Chen', 'BuildTech Solutions', 'Metro Development Corp'),
('22222222-2222-2222-2222-222222222222', 'David Kim', 'Elena Rodriguez', 'Residential Builders Inc', 'Urban Living Development'),
('33333333-3333-3333-3333-333333333333', 'Robert Chang', 'Infrastructure Design Group', 'Heavy Construction LLC', 'State Transportation Dept')
ON CONFLICT (project_id) DO UPDATE SET
  project_manager = EXCLUDED.project_manager,
  architect = EXCLUDED.architect,
  contractor = EXCLUDED.contractor,
  owner = EXCLUDED.owner;

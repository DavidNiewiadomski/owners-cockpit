-- Comprehensive seed script for all major dashboard data
-- First clear existing data
DELETE FROM project_kpi_trends WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_monthly_spend WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_cash_flow WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_cost_breakdown WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_transactions WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_daily_progress WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_insights WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_timeline WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_team WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_executive_metrics WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_design_metrics WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_legal_metrics WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_sustainability_metrics WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_facilities_metrics WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_planning_metrics WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_preconstruction_metrics WHERE project_id IN (SELECT id FROM projects);
DELETE FROM project_construction_metrics;
DELETE FROM project_financial_metrics;
DELETE FROM projects;

-- Insert projects
INSERT INTO projects (id, name, description, status, source, external_id, start_date, end_date, owner_id) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Downtown Office Complex',
  'Modern 15-story office building with retail ground floor',
  'active',
  'CRM_IMPORT',
  'DOC-2024-001',
  '2024-01-15',
  '2024-12-30',
  '12345678-1234-1234-1234-123456789012'
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Riverside Residential Complex',
  'Luxury residential development with 120 units',
  'planning',
  'MANUAL_ENTRY',
  'RRC-2024-002',
  '2024-03-01',
  '2025-08-15',
  '12345678-1234-1234-1234-123456789012'
),
(
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'Tech Campus Expansion',
  'Corporate campus expansion with innovation labs',
  'completed',
  'API_SYNC',
  'TCE-2023-003',
  '2023-06-01',
  '2024-02-28',
  '12345678-1234-1234-1234-123456789012'
);

-- Insert financial metrics
INSERT INTO project_financial_metrics (
  id, project_id, total_budget, spent_to_date, forecasted_cost, 
  contingency_used, contingency_remaining, roi, npv, irr, 
  cost_per_sqft, market_value, leasing_projections
) VALUES
(
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  45000000.00,
  28000000.00,
  47500000.00,
  1200000.00,
  800000.00,
  0.145,
  52000000.00,
  0.165,
  285.50,
  65000000.00,
  48000000.00
),
(
  'f2b3c4d5-e6f7-8901-bcde-f12345678901',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  32000000.00,
  5200000.00,
  33500000.00,
  450000.00,
  1550000.00,
  0.128,
  38000000.00,
  0.142,
  315.75,
  42000000.00,
  36000000.00
),
(
  'f3c4d5e6-f7a8-9012-cdef-123456789012',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  18500000.00,
  18500000.00,
  18200000.00,
  0.00,
  300000.00,
  0.186,
  22000000.00,
  0.198,
  245.30,
  28000000.00,
  24000000.00
);

-- Insert construction metrics
INSERT INTO project_construction_metrics (
  id, project_id, overall_progress, days_ahead_behind, total_workforce,
  active_subcontractors, completed_milestones, total_milestones,
  quality_score, safety_score, open_rfis, pending_submittals
) VALUES
(
  'c1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  0.62,
  -3,
  145,
  12,
  18,
  28,
  0.92,
  0.96,
  8,
  4
),
(
  'c2b3c4d5-e6f7-8901-bcde-f12345678901',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  0.15,
  2,
  85,
  8,
  3,
  24,
  0.88,
  0.94,
  12,
  7
),
(
  'c3c4d5e6-f7a8-9012-cdef-123456789012',
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  1.00,
  5,
  0,
  0,
  22,
  22,
  0.94,
  0.98,
  0,
  0
);

-- Insert monthly spend data
INSERT INTO project_monthly_spend (id, project_id, month, budget, actual, forecast) VALUES
-- Downtown Office Complex
('ms1-01', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'January', 3200000, 3150000, 3180000),
('ms1-02', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'February', 3500000, 3620000, 3580000),
('ms1-03', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'March', 4100000, 4080000, 4120000),
('ms1-04', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'April', 4200000, 4350000, 4280000),
('ms1-05', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'May', 3800000, 3750000, 3820000),
('ms1-06', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'June', 4500000, 4480000, 4520000),
-- Riverside Residential Complex
('ms2-01', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'January', 1200000, 1180000, 1220000),
('ms2-02', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'February', 1500000, 1520000, 1480000),
('ms2-03', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'March', 1800000, 1750000, 1820000);

-- Insert cost breakdown data
INSERT INTO project_cost_breakdown (id, project_id, category, amount, percentage) VALUES
-- Downtown Office Complex
('cb1-1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Construction', 25000000, 55.6),
('cb1-2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Architecture/Engineering', 6750000, 15.0),
('cb1-3', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Site Work', 4500000, 10.0),
('cb1-4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Permits & Fees', 2250000, 5.0),
('cb1-5', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Materials', 4950000, 11.0),
('cb1-6', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Other/Contingency', 1550000, 3.4),
-- Riverside Residential Complex
('cb2-1', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Construction', 18000000, 56.3),
('cb2-2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Architecture/Engineering', 4800000, 15.0),
('cb2-3', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Work', 3200000, 10.0),
('cb2-4', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Materials', 4800000, 15.0),
('cb2-5', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Other/Contingency', 1200000, 3.7);

-- Insert transactions data
INSERT INTO project_transactions (id, project_id, transaction_date, description, vendor, amount, category, status) VALUES
-- Downtown Office Complex transactions
('tx1-1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-01-15', 'Foundation concrete pour', 'ABC Construction Co', -850000, 'Construction', 'paid'),
('tx1-2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-01-22', 'Structural steel delivery', 'SteelWorks Inc', -1200000, 'Materials', 'paid'),
('tx1-3', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-02-05', 'Architectural design services', 'Design Partners LLC', -450000, 'Architecture/Engineering', 'paid'),
('tx1-4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-02-18', 'HVAC system installation', 'Climate Solutions', -680000, 'Construction', 'pending'),
('tx1-5', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-03-01', 'Electrical rough-in', 'PowerTech Electric', -420000, 'Construction', 'paid'),
-- Riverside Residential Complex transactions
('tx2-1', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-01-10', 'Site preparation', 'EarthMovers Pro', -320000, 'Site Work', 'paid'),
('tx2-2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-02-01', 'Planning permits', 'City Planning Dept', -85000, 'Permits & Fees', 'paid'),
('tx2-3', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-02-15', 'Architectural plans', 'Residential Designs Inc', -275000, 'Architecture/Engineering', 'paid');

-- Insert cash flow data
INSERT INTO project_cash_flow (id, project_id, month, inflow, outflow, cumulative) VALUES
-- Downtown Office Complex
('cf1-1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'January', 8000000, 3150000, 4850000),
('cf1-2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'February', 2000000, 3620000, 3230000),
('cf1-3', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'March', 1500000, 4080000, 650000),
('cf1-4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'April', 3000000, 4350000, -700000),
-- Riverside Residential Complex
('cf2-1', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'January', 5000000, 1180000, 3820000),
('cf2-2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'February', 1000000, 1520000, 3300000),
('cf2-3', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'March', 2000000, 1750000, 3550000);

-- Insert executive metrics
INSERT INTO project_executive_metrics (id, project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
('ex1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 65000000, 45, 0.25, 0.88, 0.82),
('ex2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 42000000, 32, 0.35, 0.75, 0.78),
('ex3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 28000000, 28, 0.15, 0.92, 0.85);

-- Insert design metrics
INSERT INTO project_design_metrics (id, project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
('dm1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0.85, 142, 168, 3, 8, 12),
('dm2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.65, 89, 136, 2, 5, 8),
('dm3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 1.00, 96, 96, 4, 12, 18);

-- Insert legal metrics
INSERT INTO project_legal_metrics (id, project_id, contracts_active, contracts_pending, compliance_score, permit_status, legal_risks, documentation_complete) VALUES
('lm1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 15, 3, 0.92, 'approved', 2, 0.88),
('lm2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 8, 5, 0.85, 'pending', 4, 0.75),
('lm3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 12, 0, 0.96, 'approved', 1, 0.98);

-- Insert sustainability metrics  
INSERT INTO project_sustainability_metrics (id, project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
('sm1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gold', 78, 0.82, 0.35, 0.68, '["LEED", "Energy Star"]'),
('sm2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Silver', 65, 0.75, 0.28, 0.72, '["LEED", "WaterSense"]'),
('sm3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Platinum', 92, 0.91, 0.45, 0.85, '["LEED", "Energy Star", "WaterSense"]');

-- Insert facilities metrics
INSERT INTO project_facilities_metrics (id, project_id, operational_readiness, systems_commissioned, maintenance_planned, energy_performance, occupancy_readiness) VALUES
('fm1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0.45, 0.38, 0.82, 0.75, 0.42),
('fm2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.15, 0.08, 0.65, 0.68, 0.12),
('fm3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 0.98, 0.96, 0.98, 0.92, 0.95);

-- Insert planning metrics
INSERT INTO project_planning_metrics (id, project_id, master_plan_approval, zoning_compliance, community_engagement, regulatory_approvals, feasibility_complete) VALUES
('pm1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1.00, 1.00, 0.85, 0.92, 1.00),
('pm2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.85, 0.92, 0.78, 0.65, 0.88),
('pm3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 1.00, 1.00, 0.95, 1.00, 1.00);

-- Insert preconstruction metrics
INSERT INTO project_preconstruction_metrics (id, project_id, design_development, bidding_progress, contractor_selection, permit_submissions, value_engineering) VALUES
('pcm1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0.95, 1.00, 1.00, 1.00, 0.88),
('pcm2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.75, 0.65, 0.82, 0.45, 0.68),
('pcm3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 1.00, 1.00, 1.00, 1.00, 1.00);

-- Insert project team data
INSERT INTO project_team (id, project_id, project_manager, architect, contractor, owner) VALUES
('pt1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sarah Johnson', 'Michael Chen', 'BuildCorp LLC', 'Downtown Properties Inc'),
('pt2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'David Rodriguez', 'Emma Thompson', 'Riverside Builders', 'Luxury Residential Group'),
('pt3', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Lisa Wang', 'James Mitchell', 'TechConstruct Pro', 'Innovation Campus Corp');

-- Insert timeline data
INSERT INTO project_timeline (id, project_id, phase, start_date, end_date, status, progress) VALUES
-- Downtown Office Complex timeline
('tl1-1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Planning & Design', '2024-01-15', '2024-03-15', 'completed', 1.00),
('tl1-2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Site Preparation', '2024-03-16', '2024-04-30', 'completed', 1.00),
('tl1-3', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Foundation', '2024-05-01', '2024-06-30', 'in_progress', 0.85),
('tl1-4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Structure', '2024-07-01', '2024-09-30', 'not_started', 0.00),
('tl1-5', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MEP Systems', '2024-08-15', '2024-11-15', 'not_started', 0.00),
('tl1-6', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Finishes', '2024-10-01', '2024-12-15', 'not_started', 0.00),
-- Riverside Residential timeline
('tl2-1', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Planning & Permits', '2024-03-01', '2024-06-30', 'in_progress', 0.65),
('tl2-2', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Development', '2024-07-01', '2024-10-31', 'not_started', 0.00),
('tl2-3', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Construction Phase 1', '2024-11-01', '2025-03-31', 'not_started', 0.00);

COMMIT;

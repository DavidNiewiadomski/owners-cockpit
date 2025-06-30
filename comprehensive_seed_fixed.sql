-- Fixed comprehensive seed script - let postgres generate UUIDs automatically

-- Insert monthly spend data (omit id, let it auto-generate)
INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
-- Downtown Office Complex
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'January', 3200000, 3150000, 3180000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'February', 3500000, 3620000, 3580000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'March', 4100000, 4080000, 4120000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'April', 4200000, 4350000, 4280000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'May', 3800000, 3750000, 3820000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'June', 4500000, 4480000, 4520000),
-- Riverside Residential Complex
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'January', 1200000, 1180000, 1220000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'February', 1500000, 1520000, 1480000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'March', 1800000, 1750000, 1820000);

-- Insert cost breakdown data
INSERT INTO project_cost_breakdown (project_id, category, amount, percentage) VALUES
-- Downtown Office Complex
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Construction', 25000000, 55.6),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Architecture/Engineering', 6750000, 15.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Site Work', 4500000, 10.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Permits & Fees', 2250000, 5.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Materials', 4950000, 11.0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Other/Contingency', 1550000, 3.4),
-- Riverside Residential Complex
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Construction', 18000000, 56.3),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Architecture/Engineering', 4800000, 15.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Work', 3200000, 10.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Materials', 4800000, 15.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Other/Contingency', 1200000, 3.7);

-- Insert transactions data
INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
-- Downtown Office Complex transactions
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-01-15', 'Foundation concrete pour', 'ABC Construction Co', -850000, 'Construction', 'paid'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-01-22', 'Structural steel delivery', 'SteelWorks Inc', -1200000, 'Materials', 'paid'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-02-05', 'Architectural design services', 'Design Partners LLC', -450000, 'Architecture/Engineering', 'paid'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-02-18', 'HVAC system installation', 'Climate Solutions', -680000, 'Construction', 'pending'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-03-01', 'Electrical rough-in', 'PowerTech Electric', -420000, 'Construction', 'paid'),
-- Riverside Residential Complex transactions
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-01-10', 'Site preparation', 'EarthMovers Pro', -320000, 'Site Work', 'paid'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-02-01', 'Planning permits', 'City Planning Dept', -85000, 'Permits & Fees', 'paid'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-02-15', 'Architectural plans', 'Residential Designs Inc', -275000, 'Architecture/Engineering', 'paid');

-- Insert cash flow data
INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
-- Downtown Office Complex
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'January', 8000000, 3150000, 4850000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'February', 2000000, 3620000, 3230000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'March', 1500000, 4080000, 650000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'April', 3000000, 4350000, -700000),
-- Riverside Residential Complex
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'January', 5000000, 1180000, 3820000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'February', 1000000, 1520000, 3300000),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'March', 2000000, 1750000, 3550000);

-- Insert executive metrics
INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 65000000, 45, 0.25, 0.88, 0.82),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 42000000, 32, 0.35, 0.75, 0.78),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 28000000, 28, 0.15, 0.92, 0.85);

-- Insert design metrics
INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0.85, 142, 168, 3, 8, 12),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.65, 89, 136, 2, 5, 8),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 1.00, 96, 96, 4, 12, 18);

-- Insert legal metrics
INSERT INTO project_legal_metrics (project_id, contracts_active, contracts_pending, compliance_score, permit_status, legal_risks, documentation_complete) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 15, 3, 0.92, 'approved', 2, 0.88),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 8, 5, 0.85, 'pending', 4, 0.75),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 12, 0, 0.96, 'approved', 1, 0.98);

-- Insert sustainability metrics  
INSERT INTO project_sustainability_metrics (project_id, leed_target, current_score, energy_efficiency, carbon_reduction, sustainable_materials, certifications) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gold', 78, 0.82, 0.35, 0.68, '["LEED", "Energy Star"]'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Silver', 65, 0.75, 0.28, 0.72, '["LEED", "WaterSense"]'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Platinum', 92, 0.91, 0.45, 0.85, '["LEED", "Energy Star", "WaterSense"]');

-- Insert facilities metrics
INSERT INTO project_facilities_metrics (project_id, operational_readiness, systems_commissioned, maintenance_planned, energy_performance, occupancy_readiness) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0.45, 0.38, 0.82, 0.75, 0.42),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.15, 0.08, 0.65, 0.68, 0.12),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 0.98, 0.96, 0.98, 0.92, 0.95);

-- Insert planning metrics
INSERT INTO project_planning_metrics (project_id, master_plan_approval, zoning_compliance, community_engagement, regulatory_approvals, feasibility_complete) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1.00, 1.00, 0.85, 0.92, 1.00),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.85, 0.92, 0.78, 0.65, 0.88),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 1.00, 1.00, 0.95, 1.00, 1.00);

-- Insert preconstruction metrics
INSERT INTO project_preconstruction_metrics (project_id, design_development, bidding_progress, contractor_selection, permit_submissions, value_engineering) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0.95, 1.00, 1.00, 1.00, 0.88),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 0.75, 0.65, 0.82, 0.45, 0.68),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 1.00, 1.00, 1.00, 1.00, 1.00);

-- Insert project team data
INSERT INTO project_team (project_id, project_manager, architect, contractor, owner) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sarah Johnson', 'Michael Chen', 'BuildCorp LLC', 'Downtown Properties Inc'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'David Rodriguez', 'Emma Thompson', 'Riverside Builders', 'Luxury Residential Group'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Lisa Wang', 'James Mitchell', 'TechConstruct Pro', 'Innovation Campus Corp');

-- Insert timeline data
INSERT INTO project_timeline (project_id, phase, start_date, end_date, status, progress) VALUES
-- Downtown Office Complex timeline
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Planning & Design', '2024-01-15', '2024-03-15', 'completed', 1.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Site Preparation', '2024-03-16', '2024-04-30', 'completed', 1.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Foundation', '2024-05-01', '2024-06-30', 'in_progress', 0.85),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Structure', '2024-07-01', '2024-09-30', 'not_started', 0.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MEP Systems', '2024-08-15', '2024-11-15', 'not_started', 0.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Finishes', '2024-10-01', '2024-12-15', 'not_started', 0.00),
-- Riverside Residential timeline
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Planning & Permits', '2024-03-01', '2024-06-30', 'in_progress', 0.65),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Development', '2024-07-01', '2024-10-31', 'not_started', 0.00),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Construction Phase 1', '2024-11-01', '2025-03-31', 'not_started', 0.00);

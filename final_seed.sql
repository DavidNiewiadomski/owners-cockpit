-- Complete working seed script
-- Insert projects first (without owner_id since we disabled RLS)
INSERT INTO projects (id, name, description, status, source, external_id, start_date, end_date) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Downtown Office Complex',
  'Modern 15-story office building with retail ground floor',
  'active',
  'CRM_IMPORT',
  'DOC-2024-001',
  '2024-01-15',
  '2024-12-30'
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Riverside Residential Complex',
  'Luxury residential development with 120 units',
  'planning',
  'MANUAL_ENTRY',
  'RRC-2024-002',
  '2024-03-01',
  '2025-08-15'
),
(
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'Tech Campus Expansion',
  'Corporate campus expansion with innovation labs',
  'completed',
  'API_SYNC',
  'TCE-2023-003',
  '2023-06-01',
  '2024-02-28'
);

-- Insert financial metrics
INSERT INTO project_financial_metrics (
  project_id, total_budget, spent_to_date, forecasted_cost, 
  contingency_used, contingency_remaining, roi, npv, irr, 
  cost_per_sqft, market_value, leasing_projections
) VALUES
(
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
  project_id, overall_progress, days_ahead_behind, total_workforce,
  active_subcontractors, completed_milestones, total_milestones,
  quality_score, safety_score, open_rfis, pending_submittals
) VALUES
(
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

-- Fixed seed script with proper schema alignment
-- Clear existing data (in correct order due to foreign key dependencies)
DELETE FROM project_construction_metrics;
DELETE FROM project_financial_metrics;
DELETE FROM projects;

-- Insert projects (matching actual schema)
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

-- Insert financial metrics (matching actual schema)
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

-- Insert construction metrics (matching actual schema)
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

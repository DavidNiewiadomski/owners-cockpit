-- Basic seed data for Owners Cockpit Demo
-- This will provide minimal working data to connect the frontend to backend

-- First, let's clear any existing data and start fresh
TRUNCATE TABLE projects CASCADE;

-- Insert basic projects without owner_id constraint issues
INSERT INTO projects (id, name, description, status, start_date, end_date, total_value, risk_score, strategic_alignment, market_position, estimated_completion) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Downtown Office Building', 'Modern 25-story office complex in downtown core', 'active', '2024-01-15', '2025-12-31', 45000000, 2.3, 85, 92, '2025-12-31'),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 'Residential Complex Phase 1', 'Luxury residential towers with 200 units', 'active', '2024-03-01', '2026-06-30', 32000000, 1.8, 78, 88, '2026-06-30'),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 'Highway Bridge Renovation', 'Major infrastructure upgrade for regional bridge', 'active', '2023-09-01', '2025-08-15', 18500000, 3.1, 95, 85, '2025-08-15');

-- Project Financial Metrics
INSERT INTO project_financial_metrics (project_id, total_budget, spent_to_date, forecasted_cost, contingency_used, contingency_remaining, roi, npv, irr, cost_per_sqft, market_value, leasing_projections) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 45000000, 31500000, 44200000, 1200000, 1800000, 18.5, 8500000, 15.2, 425, 52000000, 48000000),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 32000000, 19200000, 31800000, 800000, 1400000, 22.1, 6800000, 17.8, 385, 38500000, 35200000),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 18500000, 15800000, 18300000, 900000, 300000, 12.3, 2200000, 11.8, 0, 20500000, 0);

-- Project Construction Metrics
INSERT INTO project_construction_metrics (project_id, overall_progress, days_ahead_behind, total_workforce, active_subcontractors, completed_milestones, total_milestones, quality_score, safety_score, open_rfis, pending_submittals) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 70.5, -3, 145, 12, 18, 25, 94.2, 96.8, 8, 12),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 60.2, 5, 98, 8, 14, 22, 91.5, 98.1, 5, 7),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 85.3, 12, 67, 6, 21, 24, 96.7, 99.2, 2, 3);

-- Executive Metrics
INSERT INTO project_executive_metrics (project_id, portfolio_value, stakeholders, risk_score, strategic_alignment, market_position) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 52000000, 25, 2.3, 85, 92),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 38500000, 18, 1.8, 78, 88),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 20500000, 12, 3.1, 95, 85);

-- Monthly Spend Data
INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', '2024-06', 3200000, 3350000, 3400000),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', '2024-07', 3400000, 3250000, 3300000),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', '2024-06', 2100000, 1950000, 2000000),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', '2024-07', 2300000, 2150000, 2200000),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', '2024-06', 1200000, 1280000, 1250000),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', '2024-07', 800000, 750000, 780000);

-- Alerts
INSERT INTO alerts (project_id, alert_type, severity, title, description, resolved) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'budget', 'medium', 'Budget Variance Alert', 'Project spending is 4.7% over budget for current period', false),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'schedule', 'low', 'Minor Schedule Delay', 'Elevator installation delayed by 3 days due to permit issues', false),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 'quality', 'high', 'Quality Control Issue', 'Concrete pour on Floor 8 failed quality inspection', false),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 'safety', 'low', 'Safety Training Due', '15 workers need to complete updated safety certification', true);

-- Budget Items
INSERT INTO budget_items (project_id, category, description, budgeted_amount, actual_amount) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Materials', 'Steel, concrete, and finishing materials', 18000000, 18500000),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Labor', 'Construction workforce and contractors', 15000000, 14200000),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Equipment', 'Heavy machinery and tools', 8000000, 7800000),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 'Materials', 'Residential construction materials', 12000000, 11800000),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 'Labor', 'Construction and finishing crews', 14000000, 13500000),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 'Materials', 'Bridge renovation materials', 8500000, 8700000),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 'Labor', 'Specialized bridge construction', 7000000, 6800000);

-- Tasks
INSERT INTO tasks (project_id, name, description, status, priority, assigned_to, due_date) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Complete Floor 15 Steel Installation', 'Install remaining steel beams on floor 15', 'in_progress', 1, 'Mike Johnson', '2024-07-15'),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'HVAC Rough-in Floors 10-12', 'Complete HVAC rough-in work', 'not_started', 2, 'Sarah Chen', '2024-07-22'),
    ('b2c3d4e5-f6g7-8901-2345-678901bcdefg', 'Unit Finishing - Tower A', 'Complete finishing work for units 101-120', 'in_progress', 1, 'Carlos Rodriguez', '2024-07-18'),
    ('c3d4e5f6-g7h8-9012-3456-789012cdefgh', 'Bridge Deck Inspection', 'Final inspection of bridge deck repairs', 'completed', 1, 'Lisa Park', '2024-07-10');

COMMIT;

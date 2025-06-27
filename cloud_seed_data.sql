-- Simple seed data for cloud Supabase demo
-- Run this in your Supabase SQL editor

-- Insert demo projects
INSERT INTO projects (id, name, description, status, start_date, end_date, total_value, risk_score, strategic_alignment, market_position) VALUES
('11111111-1111-1111-1111-111111111111', 'Downtown Office Building', 'A 12-story modern office building project in downtown area with sustainable design features.', 'active', '2024-01-15', '2024-12-31', 75000000, 25, 92, 94),
('22222222-2222-2222-2222-222222222222', 'Residential Complex Phase 1', 'Construction of 50-unit residential complex with modern amenities and green spaces.', 'planning', '2024-03-01', '2025-02-28', 45000000, 35, 88, 87),
('33333333-3333-3333-3333-333333333333', 'Highway Bridge Renovation', 'Major renovation and structural upgrades to the Main Street bridge infrastructure.', 'active', '2024-02-01', '2024-10-31', 25000000, 15, 95, 91)
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
description = EXCLUDED.description,
status = EXCLUDED.status,
total_value = EXCLUDED.total_value,
risk_score = EXCLUDED.risk_score,
strategic_alignment = EXCLUDED.strategic_alignment,
market_position = EXCLUDED.market_position;

-- Insert budget breakdown data
INSERT INTO budget_breakdown (id, project_id, category, allocated_amount, spent_amount) VALUES
('fb711b4d-ba55-450c-aaed-adc1f1840a41', '11111111-1111-1111-1111-111111111111', 'Site Work', 8500000, 8200000),
('62eacf8d-5efa-46b9-aa90-23aebd8542e1', '11111111-1111-1111-1111-111111111111', 'Structure', 25000000, 24800000),
('d1ffa827-9979-45ea-9705-93c6af220553', '11111111-1111-1111-1111-111111111111', 'MEP Systems', 15000000, 14200000),
('26bac92d-3257-48f6-b623-ac1b319638b8', '11111111-1111-1111-1111-111111111111', 'Finishes', 12000000, 9800000),
('536ada12-1b0a-4c15-be1b-8a7a3c8bf53d', '11111111-1111-1111-1111-111111111111', 'Equipment', 8000000, 6500000),
('e46cdce8-9a7a-4461-9e88-3698f80f81cc', '11111111-1111-1111-1111-111111111111', 'Soft Costs', 4500000, 4200000),
('8e809a24-0cc8-4abf-88ad-5dd45bbe4491', '11111111-1111-1111-1111-111111111111', 'Contingency', 6000000, 2800000)
ON CONFLICT (id) DO UPDATE SET
allocated_amount = EXCLUDED.allocated_amount,
spent_amount = EXCLUDED.spent_amount;

-- Insert action items
INSERT INTO action_items (id, project_id, title, description, status, priority, due_date) VALUES
('4f871813-3eb7-4294-8ad1-e8b6ecc0472b', '11111111-1111-1111-1111-111111111111', 'Review architectural drawings', 'Complete review of updated architectural plans and provide feedback', 'Open', 'High', '2025-06-17'),
('18ba0ff4-71bc-4547-b991-c34c24e28083', '11111111-1111-1111-1111-111111111111', 'Update material specifications', 'Revise material specs based on latest supplier information', 'In Progress', 'Medium', '2025-06-18'),
('38ee2e08-8678-4ddb-bfae-e6abc6730730', '11111111-1111-1111-1111-111111111111', 'Schedule safety inspection', 'Coordinate with safety team for quarterly inspection', 'Done', 'Critical', '2025-06-19')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description,
status = EXCLUDED.status,
priority = EXCLUDED.priority;

-- Insert project insights
INSERT INTO project_insights (id, project_id, summary, key_points, recommendations, alerts) VALUES
('b4e9ca7f-460c-49bf-bf2b-a6b53f90e998', '11111111-1111-1111-1111-111111111111', 'Project performing excellently with strong metrics across all areas. Design phase nearing completion with robust contractor engagement.', '["Strong ROI performance at 16.8%","Stakeholder alignment high at 92%","Risk levels manageable at 25%","Permit approval rate at 50%"]', '["Finalize contractor selection to maintain schedule advantage","Expedite remaining permit applications","Lock in material pricing for inflation protection"]', '["Quarterly stakeholder review due next week","Fire department permit pending approval"]')
ON CONFLICT (id) DO UPDATE SET
summary = EXCLUDED.summary,
key_points = EXCLUDED.key_points,
recommendations = EXCLUDED.recommendations,
alerts = EXCLUDED.alerts;

-- Insert project KPIs
INSERT INTO project_kpis (id, project_id, week, efficiency_score, quality_score, safety_score) VALUES
('b1bdfb37-4a91-4712-b691-3794237af818', '11111111-1111-1111-1111-111111111111', 'W1', 78, 92, 98),
('29eb7371-e542-4d77-b018-352076679013', '11111111-1111-1111-1111-111111111111', 'W2', 82, 89, 97),
('d42e9439-7c80-4112-8a3c-2f13ffc9e67c', '11111111-1111-1111-1111-111111111111', 'W3', 85, 94, 99),
('a172584e-279f-49b8-8934-98036f70cea3', '11111111-1111-1111-1111-111111111111', 'W4', 88, 96, 98)
ON CONFLICT (id) DO UPDATE SET
efficiency_score = EXCLUDED.efficiency_score,
quality_score = EXCLUDED.quality_score,
safety_score = EXCLUDED.safety_score;

-- Final Comprehensive Seed Data for Owners Cockpit
-- This script completes the seeding with vendor submissions and additional data

-- Insert vendor submissions with proper UUIDs
INSERT INTO submissions (id, bid_id, vendor_id, vendor_name, vendor_contact_email, vendor_contact_phone, status, submitted_at, base_price, total_price, created_at, updated_at)
VALUES
  -- Downtown Office Tower - Site Work (Awarded)
  ('aaaa1111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'shortlisted', '2024-02-08', 41500000, 42800000, NOW(), NOW()),
  ('aaaa1111-1111-1111-1111-222222222222', 'b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'submitted', '2024-02-07', 42100000, 43500000, NOW(), NOW()),
  ('aaaa1111-1111-1111-1111-333333333333', 'b1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Suffolk Construction', 'estimating@suffolk.com', '+1-617-445-3500', 'submitted', '2024-02-09', 40800000, 42100000, NOW(), NOW()),
  
  -- Downtown Office Tower - Structure (Evaluation)
  ('aaaa1111-2222-2222-2222-111111111111', 'b1111111-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'under_review', '2024-03-20', 84000000, 86700000, NOW(), NOW()),
  ('aaaa1111-2222-2222-2222-222222222222', 'b1111111-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Clark Construction', 'estimating@clarkconstruction.com', '+1-301-272-8100', 'under_review', '2024-03-19', 82500000, 85100000, NOW(), NOW()),
  ('aaaa1111-2222-2222-2222-333333333333', 'b1111111-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'DPR Construction', 'preconstruction@dpr.com', '+1-650-474-1450', 'under_review', '2024-03-21', 83700000, 86400000, NOW(), NOW()),
  ('aaaa1111-2222-2222-2222-444444444444', 'b1111111-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Hensel Phelps', 'estimating@henselphelps.com', '+1-970-737-5100', 'under_review', '2024-03-18', 85200000, 87900000, NOW(), NOW()),
  ('aaaa1111-2222-2222-2222-555555555555', 'b1111111-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'Mortenson Construction', 'estimating@mortenson.com', '+1-763-522-2100', 'under_review', '2024-03-20', 81900000, 84500000, NOW(), NOW()),
  
  -- Medical Center - Site & Utilities (Awarded)
  ('aaaa2222-1111-1111-1111-111111111111', 'b2222222-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'shortlisted', '2024-02-24', 65800000, 67900000, NOW(), NOW()),
  ('aaaa2222-1111-1111-1111-222222222222', 'b2222222-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Suffolk Construction', 'estimating@suffolk.com', '+1-617-445-3500', 'submitted', '2024-02-23', 66500000, 68600000, NOW(), NOW()),
  ('aaaa2222-1111-1111-1111-333333333333', 'b2222222-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 'McCarthy Building', 'bids@mccarthy.com', '+1-314-968-3300', 'submitted', '2024-02-25', 67200000, 69300000, NOW(), NOW()),
  
  -- Medical Center - MEP Systems (Evaluation)
  ('aaaa2222-2222-2222-2222-111111111111', 'b2222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'Advanced MEP Solutions', 'estimating@advancedmep.com', '+1-408-555-0187', 'under_review', '2024-04-20', 132000000, 136300000, NOW(), NOW()),
  ('aaaa2222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Elite Electrical Systems', 'bids@eliteelectrical.com', '+1-713-555-0234', 'under_review', '2024-04-19', 133500000, 137800000, NOW(), NOW()),
  ('aaaa2222-2222-2222-2222-333333333333', 'b2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Southland Industries', 'estimating@southlandind.com', '+1-714-901-5800', 'under_review', '2024-04-21', 131200000, 135400000, NOW(), NOW()),
  
  -- Waterfront - Foundation & Structure (Awarded)
  ('aaaa4444-1111-1111-1111-111111111111', 'b4444444-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Premier Concrete Company', 'bids@premierconcrete.com', '+1-303-555-0234', 'shortlisted', '2024-03-29', 80500000, 83100000, NOW(), NOW()),
  ('aaaa4444-1111-1111-1111-222222222222', 'b4444444-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'submitted', '2024-03-28', 81200000, 83800000, NOW(), NOW()),
  ('aaaa4444-1111-1111-1111-333333333333', 'b4444444-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Clark Construction', 'estimating@clarkconstruction.com', '+1-301-272-8100', 'submitted', '2024-03-30', 82700000, 85300000, NOW(), NOW()),
  
  -- Airport Terminal - Airside Package (Awarded)
  ('aaaa5555-1111-1111-1111-111111111111', 'b5555555-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'shortlisted', '2024-02-12', 249000000, 257000000, NOW(), NOW()),
  ('aaaa5555-1111-1111-1111-222222222222', 'b5555555-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'submitted', '2024-02-11', 252000000, 260100000, NOW(), NOW()),
  ('aaaa5555-1111-1111-1111-333333333333', 'b5555555-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Clark Construction', 'estimating@clarkconstruction.com', '+1-301-272-8100', 'submitted', '2024-02-13', 255000000, 263200000, NOW(), NOW()),
  ('aaaa5555-1111-1111-1111-444444444444', 'b5555555-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'Hensel Phelps', 'estimating@henselphelps.com', '+1-970-737-5100', 'submitted', '2024-02-10', 258000000, 266300000, NOW(), NOW())
ON CONFLICT (bid_id, vendor_id) DO NOTHING;

-- Insert tasks with correct column names
INSERT INTO tasks (id, project_id, name, description, status, priority, due_date, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  task.name,
  task.description,
  task.status::task_status,
  task.priority,
  CURRENT_DATE + (task.due_days || ' days')::interval as due_date,
  NOW() as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('Complete schematic design review', 'Review and approve final schematic design package', 'completed', 3, -30),
    ('Submit permit applications', 'Submit building permit applications to city', 'completed', 3, -15),
    ('Finalize GMP contract', 'Negotiate and execute guaranteed maximum price contract', 'in_progress', 3, 7),
    ('Complete foundation inspection', 'Third-party inspection of foundation work', 'not_started', 2, 14),
    ('Review MEP coordination drawings', 'Review mechanical, electrical, plumbing coordination', 'not_started', 2, 21),
    ('Approve material submittals', 'Review and approve critical material submittals', 'in_progress', 3, 10),
    ('Conduct safety training', 'Monthly safety training for all site personnel', 'not_started', 2, 5),
    ('Review change order requests', 'Review and approve pending change order requests', 'in_progress', 3, 3)
) AS task(name, description, status, priority, due_days)
WHERE p.status = 'active'
LIMIT 50;

-- Insert budget items with correct structure
INSERT INTO budget_items (id, project_id, category, description, budget_amount, committed_amount, spent_amount, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  budget.category,
  budget.description,
  (p.total_value * budget.pct_of_total)::numeric(15,2) as budget_amount,
  (p.total_value * budget.pct_of_total * budget.committed_pct)::numeric(15,2) as committed_amount,
  (p.total_value * budget.pct_of_total * budget.spent_pct)::numeric(15,2) as spent_amount,
  NOW() as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('Site Work', 'Site preparation, utilities, landscaping', 0.08, 0.75, 0.45),
    ('Foundations', 'Deep foundations and grade beams', 0.06, 0.90, 0.60),
    ('Structure', 'Structural steel and concrete', 0.18, 0.85, 0.40),
    ('Envelope', 'Exterior walls, windows, roofing', 0.15, 0.70, 0.25),
    ('Interiors', 'Interior finishes, partitions, ceilings', 0.12, 0.60, 0.15),
    ('MEP Systems', 'Mechanical, electrical, plumbing', 0.22, 0.75, 0.30),
    ('Equipment', 'Fixed equipment and specialties', 0.08, 0.50, 0.10),
    ('General Conditions', 'GC costs, supervision, temporary facilities', 0.07, 0.85, 0.50),
    ('Contingency', 'Owner and design contingency', 0.04, 0.00, 0.00)
) AS budget(category, description, pct_of_total, committed_pct, spent_pct)
WHERE p.status IN ('active', 'completed')
LIMIT 60;

-- Insert additional leveling data
INSERT INTO leveling (id, bid_id, submission_id, leveled_base_price, leveled_total_price, is_complete, leveled_by, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  s.bid_id,
  s.id as submission_id,
  s.base_price * (0.98 + random() * 0.04) as leveled_base_price,
  s.total_price * (0.98 + random() * 0.04) as leveled_total_price,
  random() > 0.3 as is_complete,
  '11111111-1111-1111-1111-111111111111' as leveled_by,
  NOW() as created_at,
  NOW() as updated_at
FROM submissions s
WHERE s.status = 'under_review'
ON CONFLICT (bid_id, submission_id) DO NOTHING;

-- Insert additional scorecards
INSERT INTO scorecards (id, bid_id, submission_id, evaluator_id, evaluation_phase, technical_total, commercial_total, composite_score, is_complete, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  s.bid_id,
  s.id as submission_id,
  '11111111-1111-1111-1111-111111111111' as evaluator_id,
  'combined' as evaluation_phase,
  75 + floor(random() * 20)::numeric as technical_total,
  70 + floor(random() * 25)::numeric as commercial_total,
  72.5 + random() * 22.5 as composite_score,
  true as is_complete,
  NOW() as created_at,
  NOW() as updated_at
FROM submissions s
WHERE s.status IN ('under_review', 'shortlisted')
ON CONFLICT (bid_id, submission_id, evaluator_id, evaluation_phase) DO NOTHING;

-- Insert awards for awarded RFPs
INSERT INTO awards (id, bid_id, winning_submission_id, award_amount, award_justification, status, recommended_by, awarded_at, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  b.id as bid_id,
  s.id as winning_submission_id,
  s.total_price as award_amount,
  'Selected based on best value combination of technical capability, past performance, and competitive pricing. Vendor demonstrated superior understanding of project requirements and proposed innovative solutions.' as award_justification,
  'awarded' as status,
  '11111111-1111-1111-1111-111111111111' as recommended_by,
  b.submission_deadline + interval '21 days' as awarded_at,
  NOW() as created_at,
  NOW() as updated_at
FROM bids b
JOIN submissions s ON s.bid_id = b.id AND s.status = 'shortlisted'
WHERE b.status = 'awarded'
ON CONFLICT (bid_id) DO NOTHING;

-- Insert alerts with correct structure
INSERT INTO alerts (id, project_id, alert_type, severity, title, description, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  alert.alert_type,
  alert.severity,
  alert.title,
  alert.description,
  NOW() - (random() * interval '30 days') as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('budget', 'high', 'Budget Variance Alert', 'MEP systems package is tracking 8% over budget due to scope additions'),
    ('schedule', 'medium', 'Schedule Delay Risk', 'Long-lead equipment delivery may impact critical path by 2 weeks'),
    ('safety', 'high', 'Safety Incident', 'Near-miss incident reported at Tower 2 - corrective actions implemented'),
    ('quality', 'low', 'Quality Issue', 'Concrete test results below specification - retesting scheduled'),
    ('procurement', 'medium', 'Bid Alert', 'Only 2 bidders responded to steel fabrication RFP - consider extending deadline'),
    ('weather', 'medium', 'Weather Impact', 'Severe weather forecast may impact concrete pours next week'),
    ('regulatory', 'high', 'Permit Issue', 'City requesting additional documentation for mechanical permit'),
    ('supply_chain', 'medium', 'Material Delay', 'Steel delivery delayed by 10 days due to mill production issues')
) AS alert(alert_type, severity, title, description)
WHERE p.status = 'active'
LIMIT 30;

-- Insert reports with correct structure
INSERT INTO reports (id, project_id, report_type, name, description, status, url, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  report.report_type,
  report.name,
  report.description,
  'completed' as status,
  'https://storage.ownerscockpit.com/reports/' || p.id || '/' || report.report_type || '_' || to_char(NOW() - (random() * interval '30 days'), 'YYYYMMDD') || '.pdf' as url,
  NOW() - (random() * interval '30 days') as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('monthly', 'Monthly Progress Report - ' || to_char(NOW() - interval '1 month', 'Month YYYY'), 'Comprehensive monthly progress report including schedule, budget, and key metrics'),
    ('safety', 'Weekly Safety Summary', 'Weekly safety summary including incidents, observations, and training'),
    ('financial', 'Cost Report', 'Detailed cost report with commitments, expenditures, and forecasts'),
    ('schedule', 'Schedule Analysis', 'Critical path analysis and milestone tracking report'),
    ('procurement', 'Procurement Status', 'Active RFPs, recent awards, and upcoming bid packages'),
    ('quality', 'Quality Assurance Report', 'Quality control test results and non-conformance tracking'),
    ('risk', 'Risk Register Update', 'Updated risk register with mitigation strategies')
) AS report(report_type, name, description)
WHERE p.status IN ('active', 'completed')
LIMIT 40;

-- Create some integration logs
INSERT INTO integration_logs (id, integration_type, status, request_data, response_data, error_message, created_at)
SELECT 
  gen_random_uuid() as id,
  log.integration_type,
  log.status,
  log.request_data::jsonb,
  log.response_data::jsonb,
  log.error_message,
  NOW() - (random() * interval '7 days') as created_at
FROM (
  VALUES 
    ('procore_sync', 'success', '{"action": "sync_projects", "count": 8}', '{"synced": 8, "errors": 0}', NULL),
    ('plangrid_sync', 'success', '{"action": "sync_drawings", "project_id": "11111111-1111-1111-1111-111111111111"}', '{"drawings_synced": 142}', NULL),
    ('procore_sync', 'error', '{"action": "sync_rfis", "project_id": "22222222-2222-2222-2222-222222222222"}', NULL, 'API rate limit exceeded'),
    ('email_send', 'success', '{"to": "pm@company.com", "subject": "Award Notification"}', '{"message_id": "msg_123456"}', NULL),
    ('docusign_send', 'success', '{"envelope_id": "env_789", "recipients": 2}', '{"status": "sent"}', NULL)
) AS log(integration_type, status, request_data, response_data, error_message)
LIMIT 20;

-- Summary output
DO $$
DECLARE
  project_count INTEGER;
  bid_count INTEGER;
  submission_count INTEGER;
  award_count INTEGER;
  task_count INTEGER;
  budget_count INTEGER;
  alert_count INTEGER;
  report_count INTEGER;
  scorecard_count INTEGER;
  leveling_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO project_count FROM projects;
  SELECT COUNT(*) INTO bid_count FROM bids;
  SELECT COUNT(*) INTO submission_count FROM submissions;
  SELECT COUNT(*) INTO award_count FROM awards;
  SELECT COUNT(*) INTO task_count FROM tasks;
  SELECT COUNT(*) INTO budget_count FROM budget_items;
  SELECT COUNT(*) INTO alert_count FROM alerts;
  SELECT COUNT(*) INTO report_count FROM reports;
  SELECT COUNT(*) INTO scorecard_count FROM scorecards;
  SELECT COUNT(*) INTO leveling_count FROM leveling;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Complete Database Seeding Finished!';
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'Projects: %', project_count;
  RAISE NOTICE 'RFPs/Bids: %', bid_count;
  RAISE NOTICE 'Vendor Submissions: %', submission_count;
  RAISE NOTICE 'Awards: %', award_count;
  RAISE NOTICE 'Scorecards: %', scorecard_count;
  RAISE NOTICE 'Leveling Records: %', leveling_count;
  RAISE NOTICE 'Tasks: %', task_count;
  RAISE NOTICE 'Budget Items: %', budget_count;
  RAISE NOTICE 'Alerts: %', alert_count;
  RAISE NOTICE 'Reports: %', report_count;
  RAISE NOTICE '';
  RAISE NOTICE '🏗️  The Owners Cockpit backend is now fully populated with:';
  RAISE NOTICE '';
  RAISE NOTICE '📊 PROJECT DATA:';
  RAISE NOTICE '   - 8 major construction projects ($2.5B total value)';
  RAISE NOTICE '   - Projects in various stages (planning, active, completed)';
  RAISE NOTICE '   - Realistic timelines and budgets';
  RAISE NOTICE '';
  RAISE NOTICE '🏢 PROCUREMENT DATA:';
  RAISE NOTICE '   - 10 active RFPs across multiple projects';
  RAISE NOTICE '   - 20+ vendor submissions from major contractors';
  RAISE NOTICE '   - Complete bid evaluation and scoring data';
  RAISE NOTICE '   - Contract awards with justifications';
  RAISE NOTICE '';
  RAISE NOTICE '📋 OPERATIONAL DATA:';
  RAISE NOTICE '   - Active tasks and milestones';
  RAISE NOTICE '   - Detailed budget breakdowns by category';
  RAISE NOTICE '   - Real-time alerts and notifications';
  RAISE NOTICE '   - Comprehensive reporting suite';
  RAISE NOTICE '';
  RAISE NOTICE '✨ The system now represents a fully operational construction';
  RAISE NOTICE '   management platform with realistic, interconnected data!';
END $$;

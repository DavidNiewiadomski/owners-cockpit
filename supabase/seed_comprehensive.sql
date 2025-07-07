-- Comprehensive Seed Data for Owners Cockpit
-- This script populates the database with realistic project and procurement data

-- Clear existing test data (preserving system records)
DELETE FROM awards WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM scorecards WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM leveling WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM submissions WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM bids WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM alerts WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM reports WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM budget_items WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM tasks WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM projects WHERE id != '00000000-0000-0000-0000-000000000000';

-- Create test user if not exists
INSERT INTO auth.users (id, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test@ownerscockpit.com',
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test User", "role": "project_manager"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert comprehensive project data
INSERT INTO projects (id, name, description, status, total_value, start_date, end_date, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Downtown Office Tower', 'A 45-story mixed-use commercial office building with retail space on floors 1-3, parking garage, and rooftop amenities', 'active', 285000000, '2024-01-15', '2025-12-31', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Regional Medical Center', 'New 300-bed patient tower with advanced surgical suites, emergency department expansion, and medical office building', 'active', 450000000, '2024-02-01', '2026-06-30', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Tech Campus Phase 2', 'Three interconnected office buildings with underground parking, fitness center, and employee dining facilities', 'planning', 325000000, '2024-06-01', '2026-09-30', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Waterfront Residential', 'Luxury high-rise residential towers (2x 40-story) with amenities deck, marina access, and retail podium', 'active', 275000000, '2024-03-01', '2025-09-30', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Airport Terminal C', 'New international terminal with 30 gates, customs facility, baggage handling system, and APM connection', 'active', 850000000, '2024-01-01', '2027-03-31', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'University Science Center', 'State-of-the-art research facility with clean rooms, laboratories, lecture halls, and collaboration spaces', 'active', 180000000, '2024-04-15', '2026-02-28', NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Sports Arena Renovation', 'Complete renovation of 20,000-seat arena including new seating, concourses, luxury suites, and technology upgrades', 'planning', 220000000, '2024-07-01', '2026-03-31', NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Data Center Campus', 'Two 100,000 SF data centers with redundant power, cooling systems, and secure access facilities', 'active', 380000000, '2024-02-15', '2025-08-31', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  total_value = EXCLUDED.total_value;

-- Insert project tasks
INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  task.title,
  task.description,
  task.status,
  task.priority,
  CURRENT_DATE + (task.due_days || ' days')::interval as due_date,
  NOW() as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('Complete schematic design review', 'Review and approve final schematic design package', 'completed', 'high', -30),
    ('Submit permit applications', 'Submit building permit applications to city', 'completed', 'high', -15),
    ('Finalize GMP contract', 'Negotiate and execute guaranteed maximum price contract', 'in_progress', 'high', 7),
    ('Complete foundation inspection', 'Third-party inspection of foundation work', 'pending', 'medium', 14),
    ('Review MEP coordination drawings', 'Review mechanical, electrical, plumbing coordination', 'pending', 'medium', 21),
    ('Approve material submittals', 'Review and approve critical material submittals', 'in_progress', 'high', 10)
) AS task(title, description, status, priority, due_days)
WHERE p.status = 'active'
LIMIT 40;

-- Insert budget items
INSERT INTO budget_items (id, project_id, category, description, budgeted, committed, spent, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  budget.category,
  budget.description,
  budget.budgeted,
  budget.budgeted * budget.committed_pct as committed,
  budget.budgeted * budget.spent_pct as spent,
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
) AS budget(category, description, pct_of_total, committed_pct, spent_pct),
LATERAL (
  SELECT p.total_value * budget.pct_of_total as budgeted
) budget_calc
WHERE p.status IN ('active', 'completed')
LIMIT 60;

-- Insert RFP/Bid data with proper user reference
INSERT INTO bids (id, title, description, rfp_number, bid_type, estimated_value, currency, status, published_at, submission_deadline, evaluation_start, created_by, created_at, updated_at)
VALUES
  -- Downtown Office Tower RFPs
  ('b1111111-1111-1111-1111-111111111111', 'Downtown Office Tower - Site Work', 'Site preparation and foundation work package including excavation, shoring, dewatering, and concrete foundations', 'RFP-DOT-2024-001', 'lump_sum', 42750000, 'USD', 'awarded', '2024-01-20', '2024-02-10', '2024-02-13', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('b1111111-2222-2222-2222-222222222222', 'Downtown Office Tower - Structure', 'Structural steel and concrete package including all structural components above grade', 'RFP-DOT-2024-002', 'lump_sum', 85500000, 'USD', 'evaluation', '2024-03-01', '2024-03-22', '2024-03-25', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('b1111111-3333-3333-3333-333333333333', 'Downtown Office Tower - Envelope', 'Building envelope including curtain wall, roofing, and waterproofing systems', 'RFP-DOT-2024-003', 'lump_sum', 57000000, 'USD', 'open', '2024-06-15', '2024-07-06', '2024-07-09', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  
  -- Medical Center RFPs
  ('b2222222-1111-1111-1111-111111111111', 'Medical Center - Site & Utilities', 'Complete site work and utility infrastructure package', 'RFP-RMC-2024-001', 'lump_sum', 67500000, 'USD', 'awarded', '2024-02-05', '2024-02-26', '2024-03-01', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('b2222222-2222-2222-2222-222222222222', 'Medical Center - MEP Systems', 'Complete mechanical, electrical, and plumbing systems for patient tower', 'RFP-RMC-2024-002', 'lump_sum', 135000000, 'USD', 'evaluation', '2024-04-01', '2024-04-22', '2024-04-25', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  
  -- Tech Campus RFPs
  ('b3333333-1111-1111-1111-111111111111', 'Tech Campus - Design-Build Package', 'Complete design-build services for all three buildings', 'RFP-TCP-2024-001', 'design_build', 325000000, 'USD', 'draft', '2024-07-01', '2024-08-15', NULL, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  
  -- Waterfront Residential RFPs
  ('b4444444-1111-1111-1111-111111111111', 'Waterfront - Foundation & Structure', 'Deep foundations and concrete superstructure for both towers', 'RFP-WRC-2024-001', 'lump_sum', 82500000, 'USD', 'awarded', '2024-03-10', '2024-03-31', '2024-04-03', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('b4444444-2222-2222-2222-222222222222', 'Waterfront - Interior Finishes', 'High-end interior finishes for residential units and common areas', 'RFP-WRC-2024-002', 'lump_sum', 68750000, 'USD', 'evaluation', '2024-05-01', '2024-05-22', '2024-05-25', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  
  -- Airport Terminal RFPs
  ('b5555555-1111-1111-1111-111111111111', 'Airport Terminal - Airside Package', 'Airside construction including apron, taxiways, and jet bridges', 'RFP-ATC-2024-001', 'lump_sum', 255000000, 'USD', 'awarded', '2024-01-10', '2024-02-14', '2024-02-17', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('b5555555-2222-2222-2222-222222222222', 'Airport Terminal - Landside Package', 'Terminal building construction and landside facilities', 'RFP-ATC-2024-002', 'lump_sum', 340000000, 'USD', 'evaluation', '2024-03-15', '2024-04-19', '2024-04-22', '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- Insert vendor submissions for awarded and evaluation RFPs
INSERT INTO submissions (id, bid_id, vendor_id, vendor_name, vendor_contact_email, vendor_contact_phone, status, submitted_at, base_price, total_price, created_at, updated_at)
VALUES
  -- Downtown Office Tower - Site Work (Awarded)
  ('aaaa1111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'vvvv1111-1111-1111-1111-111111111111', 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'shortlisted', '2024-02-08', 41500000, 42800000, NOW(), NOW()),
  ('aaaa1111-1111-1111-1111-222222222222', 'b1111111-1111-1111-1111-111111111111', 'vvvv2222-2222-2222-2222-222222222222', 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'submitted', '2024-02-07', 42100000, 43500000, NOW(), NOW()),
  ('aaaa1111-1111-1111-1111-333333333333', 'b1111111-1111-1111-1111-111111111111', 'vvvv3333-3333-3333-3333-333333333333', 'Suffolk Construction', 'estimating@suffolk.com', '+1-617-445-3500', 'submitted', '2024-02-09', 40800000, 42100000, NOW(), NOW()),
  
  -- Downtown Office Tower - Structure (Evaluation)
  ('aaaa1111-2222-2222-2222-111111111111', 'b1111111-2222-2222-2222-222222222222', 'vvvv1111-1111-1111-1111-111111111111', 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'under_review', '2024-03-20', 84000000, 86700000, NOW(), NOW()),
  ('aaaa1111-2222-2222-2222-222222222222', 'b1111111-2222-2222-2222-222222222222', 'vvvv4444-4444-4444-4444-444444444444', 'Clark Construction', 'estimating@clarkconstruction.com', '+1-301-272-8100', 'under_review', '2024-03-19', 82500000, 85100000, NOW(), NOW()),
  ('aaaa1111-2222-2222-2222-333333333333', 'b1111111-2222-2222-2222-222222222222', 'vvvv5555-5555-5555-5555-555555555555', 'DPR Construction', 'preconstruction@dpr.com', '+1-650-474-1450', 'under_review', '2024-03-21', 83700000, 86400000, NOW(), NOW()),
  
  -- Medical Center - Site & Utilities (Awarded)
  ('aaaa2222-1111-1111-1111-111111111111', 'b2222222-1111-1111-1111-111111111111', 'vvvv2222-2222-2222-2222-222222222222', 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'shortlisted', '2024-02-24', 65800000, 67900000, NOW(), NOW()),
  ('aaaa2222-1111-1111-1111-222222222222', 'b2222222-1111-1111-1111-111111111111', 'vvvv3333-3333-3333-3333-333333333333', 'Suffolk Construction', 'estimating@suffolk.com', '+1-617-445-3500', 'submitted', '2024-02-23', 66500000, 68600000, NOW(), NOW()),
  
  -- Airport Terminal - Airside Package (Awarded)
  ('aaaa5555-1111-1111-1111-111111111111', 'b5555555-1111-1111-1111-111111111111', 'vvvv1111-1111-1111-1111-111111111111', 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'shortlisted', '2024-02-12', 249000000, 257000000, NOW(), NOW()),
  ('aaaa5555-1111-1111-1111-222222222222', 'b5555555-1111-1111-1111-111111111111', 'vvvv2222-2222-2222-2222-222222222222', 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'submitted', '2024-02-11', 252000000, 260100000, NOW(), NOW());

-- Insert leveling data for evaluation bids
INSERT INTO leveling (id, bid_id, submission_id, leveled_base_price, leveled_total_price, is_complete, leveled_by, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  s.bid_id,
  s.id as submission_id,
  s.base_price * (0.98 + random() * 0.04) as leveled_base_price,
  s.total_price * (0.98 + random() * 0.04) as leveled_total_price,
  random() > 0.5 as is_complete,
  '11111111-1111-1111-1111-111111111111' as leveled_by,
  NOW() as created_at,
  NOW() as updated_at
FROM submissions s
WHERE s.status = 'under_review';

-- Insert scorecards for evaluated submissions
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
WHERE s.status IN ('under_review', 'shortlisted');

-- Insert awards for awarded RFPs
INSERT INTO awards (id, bid_id, winning_submission_id, award_amount, award_justification, status, recommended_by, awarded_at, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  b.id as bid_id,
  s.id as winning_submission_id,
  s.total_price as award_amount,
  'Selected based on best value combination of technical capability, past performance, and competitive pricing' as award_justification,
  'awarded' as status,
  '11111111-1111-1111-1111-111111111111' as recommended_by,
  b.submission_deadline + interval '21 days' as awarded_at,
  NOW() as created_at,
  NOW() as updated_at
FROM bids b
JOIN submissions s ON s.bid_id = b.id AND s.status = 'shortlisted'
WHERE b.status = 'awarded';

-- Insert alerts
INSERT INTO alerts (id, project_id, type, severity, title, description, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  alert.type,
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
    ('procurement', 'medium', 'Bid Alert', 'Only 2 bidders responded to steel fabrication RFP - consider extending deadline')
) AS alert(type, severity, title, description)
WHERE p.status = 'active'
LIMIT 20;

-- Insert reports
INSERT INTO reports (id, project_id, type, name, description, status, url, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  report.type,
  report.name,
  report.description,
  'completed' as status,
  'https://storage.ownerscockpit.com/reports/' || p.id || '/' || report.type || '_' || to_char(NOW() - (random() * interval '30 days'), 'YYYYMMDD') || '.pdf' as url,
  NOW() - (random() * interval '30 days') as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('monthly', 'Monthly Progress Report', 'Comprehensive monthly progress report including schedule, budget, and key metrics'),
    ('safety', 'Safety Summary Report', 'Weekly safety summary including incidents, observations, and training'),
    ('financial', 'Cost Report', 'Detailed cost report with commitments, expenditures, and forecasts'),
    ('schedule', 'Schedule Analysis', 'Critical path analysis and milestone tracking report'),
    ('procurement', 'Procurement Status', 'Active RFPs, recent awards, and upcoming bid packages')
) AS report(type, name, description)
WHERE p.status IN ('active', 'completed')
LIMIT 30;

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
BEGIN
  SELECT COUNT(*) INTO project_count FROM projects;
  SELECT COUNT(*) INTO bid_count FROM bids;
  SELECT COUNT(*) INTO submission_count FROM submissions;
  SELECT COUNT(*) INTO award_count FROM awards;
  SELECT COUNT(*) INTO task_count FROM tasks;
  SELECT COUNT(*) INTO budget_count FROM budget_items;
  SELECT COUNT(*) INTO alert_count FROM alerts;
  SELECT COUNT(*) INTO report_count FROM reports;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Database Seeding Complete!';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Projects: %', project_count;
  RAISE NOTICE 'RFPs/Bids: %', bid_count;
  RAISE NOTICE 'Vendor Submissions: %', submission_count;
  RAISE NOTICE 'Awards: %', award_count;
  RAISE NOTICE 'Tasks: %', task_count;
  RAISE NOTICE 'Budget Items: %', budget_count;
  RAISE NOTICE 'Alerts: %', alert_count;
  RAISE NOTICE 'Reports: %', report_count;
  RAISE NOTICE '';
  RAISE NOTICE 'The backend is now fully seeded with realistic and comprehensive data!';
  RAISE NOTICE 'This represents an active construction company with:';
  RAISE NOTICE '- Multiple large-scale projects in various stages';
  RAISE NOTICE '- Active procurement processes with real vendor data';
  RAISE NOTICE '- Detailed financial tracking and budgets';
  RAISE NOTICE '- Realistic alerts and reporting';
END $$;

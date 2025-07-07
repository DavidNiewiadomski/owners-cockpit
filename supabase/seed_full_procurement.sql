-- Comprehensive Procurement Data Seeding Script
-- This script populates all procurement modules with realistic data

-- Clear existing data (preserving system records)
DELETE FROM notifications WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM communication_logs WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM scorecard_metrics WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM performance_scorecards WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM compliance_items WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM lead_time_activities WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM lead_time_milestones WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM lead_time_packages WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM awards WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM bid_leveling_analysis WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM bid_line_items WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM submissions WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM bids WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM bafo_requests WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM scorecards WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM leveling_snapshot WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM leveling WHERE id != '00000000-0000-0000-0000-000000000000';

-- Ensure projects exist
INSERT INTO projects (id, name, description, status, total_value, start_date, end_date, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Downtown Office Tower', 'A 45-story mixed-use commercial office building with retail space', 'active', 285000000, '2024-01-15', '2025-12-31', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Regional Medical Center', 'New 300-bed patient tower with advanced surgical suites', 'active', 450000000, '2024-02-01', '2026-06-30', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Tech Campus Phase 2', 'Three interconnected office buildings with underground parking', 'planning', 325000000, '2024-06-01', '2026-09-30', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Waterfront Residential', 'Luxury high-rise residential towers with amenities', 'active', 275000000, '2024-03-01', '2025-09-30', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Airport Terminal C', 'New international terminal with 30 gates', 'active', 850000000, '2024-01-01', '2027-03-31', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  total_value = EXCLUDED.total_value;

-- Insert RFP/Bid data
INSERT INTO bids (id, title, description, rfp_number, bid_type, estimated_value, currency, status, published_at, submission_deadline, evaluation_start, created_at, updated_at)
VALUES
  -- Downtown Office Tower RFPs
  ('b1111111-1111-1111-1111-111111111111', 'Downtown Office Tower - Site Work', 'Site preparation and foundation work', 'RFP-DOT-2024-001', 'lump_sum', 42750000, 'USD', 'awarded', '2024-01-20', '2024-02-10', '2024-02-13', NOW(), NOW()),
  ('b1111111-2222-2222-2222-222222222222', 'Downtown Office Tower - Structure', 'Structural steel and concrete package', 'RFP-DOT-2024-002', 'lump_sum', 85500000, 'USD', 'evaluation', '2024-03-01', '2024-03-22', '2024-03-25', NOW(), NOW()),
  ('b1111111-3333-3333-3333-333333333333', 'Downtown Office Tower - Envelope', 'Curtain wall and exterior cladding', 'RFP-DOT-2024-003', 'lump_sum', 57000000, 'USD', 'open', '2024-06-15', '2024-07-06', '2024-07-09', NOW(), NOW()),
  
  -- Medical Center RFPs
  ('b2222222-1111-1111-1111-111111111111', 'Medical Center - Site & Utilities', 'Site work and utility infrastructure', 'RFP-RMC-2024-001', 'lump_sum', 67500000, 'USD', 'awarded', '2024-02-05', '2024-02-26', '2024-03-01', NOW(), NOW()),
  ('b2222222-2222-2222-2222-222222222222', 'Medical Center - MEP Systems', 'Complete mechanical, electrical, plumbing', 'RFP-RMC-2024-002', 'lump_sum', 135000000, 'USD', 'evaluation', '2024-04-01', '2024-04-22', '2024-04-25', NOW(), NOW()),
  
  -- Tech Campus RFPs
  ('b3333333-1111-1111-1111-111111111111', 'Tech Campus - Design-Build Package', 'Complete design-build services', 'RFP-TCP-2024-001', 'design_build', 325000000, 'USD', 'draft', '2024-07-01', '2024-08-15', NULL, NOW(), NOW()),
  
  -- Waterfront Residential RFPs
  ('b4444444-1111-1111-1111-111111111111', 'Waterfront - Foundation & Structure', 'Deep foundations and concrete structure', 'RFP-WRC-2024-001', 'lump_sum', 82500000, 'USD', 'awarded', '2024-03-10', '2024-03-31', '2024-04-03', NOW(), NOW()),
  ('b4444444-2222-2222-2222-222222222222', 'Waterfront - Interior Finishes', 'High-end interior finishes package', 'RFP-WRC-2024-002', 'lump_sum', 68750000, 'USD', 'evaluation', '2024-05-01', '2024-05-22', '2024-05-25', NOW(), NOW()),
  
  -- Airport Terminal RFPs
  ('b5555555-1111-1111-1111-111111111111', 'Airport Terminal - Airside Package', 'Airside construction and jet bridges', 'RFP-ATC-2024-001', 'lump_sum', 255000000, 'USD', 'awarded', '2024-01-10', '2024-02-14', '2024-02-17', NOW(), NOW()),
  ('b5555555-2222-2222-2222-222222222222', 'Airport Terminal - Landside Package', 'Terminal building and landside facilities', 'RFP-ATC-2024-002', 'lump_sum', 340000000, 'USD', 'evaluation', '2024-03-15', '2024-04-19', '2024-04-22', NOW(), NOW());

-- Insert vendor submissions for awarded and evaluation RFPs
INSERT INTO submissions (id, bid_id, vendor_id, vendor_name, vendor_contact_email, vendor_contact_phone, status, submitted_at, base_price, total_price, created_at, updated_at)
VALUES
  -- Downtown Office Tower - Site Work (Awarded)
  ('s1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', gen_random_uuid(), 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'shortlisted', '2024-02-08', 41500000, 42800000, NOW(), NOW()),
  ('s1111111-1111-1111-1111-222222222222', 'b1111111-1111-1111-1111-111111111111', gen_random_uuid(), 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'submitted', '2024-02-07', 42100000, 43500000, NOW(), NOW()),
  ('s1111111-1111-1111-1111-333333333333', 'b1111111-1111-1111-1111-111111111111', gen_random_uuid(), 'Suffolk Construction', 'estimating@suffolk.com', '+1-617-445-3500', 'submitted', '2024-02-09', 40800000, 42100000, NOW(), NOW()),
  ('s1111111-1111-1111-1111-444444444444', 'b1111111-1111-1111-1111-111111111111', gen_random_uuid(), 'McCarthy Building', 'bids@mccarthy.com', '+1-314-968-3300', 'submitted', '2024-02-06', 43200000, 44600000, NOW(), NOW()),
  
  -- Downtown Office Tower - Structure (Evaluation)
  ('s1111111-2222-2222-2222-111111111111', 'b1111111-2222-2222-2222-222222222222', gen_random_uuid(), 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'under_review', '2024-03-20', 84000000, 86700000, NOW(), NOW()),
  ('s1111111-2222-2222-2222-222222222222', 'b1111111-2222-2222-2222-222222222222', gen_random_uuid(), 'Clark Construction', 'estimating@clarkconstruction.com', '+1-301-272-8100', 'under_review', '2024-03-19', 82500000, 85100000, NOW(), NOW()),
  ('s1111111-2222-2222-2222-333333333333', 'b1111111-2222-2222-2222-222222222222', gen_random_uuid(), 'DPR Construction', 'preconstruction@dpr.com', '+1-650-474-1450', 'under_review', '2024-03-21', 83700000, 86400000, NOW(), NOW()),
  ('s1111111-2222-2222-2222-444444444444', 'b1111111-2222-2222-2222-222222222222', gen_random_uuid(), 'Hensel Phelps', 'estimating@henselphelps.com', '+1-970-737-5100', 'under_review', '2024-03-18', 85200000, 87900000, NOW(), NOW()),
  ('s1111111-2222-2222-2222-555555555555', 'b1111111-2222-2222-2222-222222222222', gen_random_uuid(), 'Mortenson Construction', 'estimating@mortenson.com', '+1-763-522-2100', 'under_review', '2024-03-20', 81900000, 84500000, NOW(), NOW()),
  
  -- Medical Center - Site & Utilities (Awarded)
  ('s2222222-1111-1111-1111-111111111111', 'b2222222-1111-1111-1111-111111111111', gen_random_uuid(), 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'shortlisted', '2024-02-24', 65800000, 67900000, NOW(), NOW()),
  ('s2222222-1111-1111-1111-222222222222', 'b2222222-1111-1111-1111-111111111111', gen_random_uuid(), 'Suffolk Construction', 'estimating@suffolk.com', '+1-617-445-3500', 'submitted', '2024-02-23', 66500000, 68600000, NOW(), NOW()),
  ('s2222222-1111-1111-1111-333333333333', 'b2222222-1111-1111-1111-111111111111', gen_random_uuid(), 'McCarthy Building', 'bids@mccarthy.com', '+1-314-968-3300', 'submitted', '2024-02-25', 67200000, 69300000, NOW(), NOW()),
  
  -- Medical Center - MEP Systems (Evaluation)
  ('s2222222-2222-2222-2222-111111111111', 'b2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Advanced MEP Solutions', 'estimating@advancedmep.com', '+1-408-555-0187', 'under_review', '2024-04-20', 132000000, 136300000, NOW(), NOW()),
  ('s2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Elite Electrical Systems', 'bids@eliteelectrical.com', '+1-713-555-0234', 'under_review', '2024-04-19', 133500000, 137800000, NOW(), NOW()),
  ('s2222222-2222-2222-2222-333333333333', 'b2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Southland Industries', 'estimating@southlandind.com', '+1-714-901-5800', 'under_review', '2024-04-21', 131200000, 135400000, NOW(), NOW()),
  
  -- Waterfront - Foundation & Structure (Awarded)
  ('s4444444-1111-1111-1111-111111111111', 'b4444444-1111-1111-1111-111111111111', gen_random_uuid(), 'Premier Concrete Company', 'bids@premierconcrete.com', '+1-303-555-0234', 'shortlisted', '2024-03-29', 80500000, 83100000, NOW(), NOW()),
  ('s4444444-1111-1111-1111-222222222222', 'b4444444-1111-1111-1111-111111111111', gen_random_uuid(), 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'submitted', '2024-03-28', 81200000, 83800000, NOW(), NOW()),
  ('s4444444-1111-1111-1111-333333333333', 'b4444444-1111-1111-1111-111111111111', gen_random_uuid(), 'Clark Construction', 'estimating@clarkconstruction.com', '+1-301-272-8100', 'submitted', '2024-03-30', 82700000, 85300000, NOW(), NOW()),
  
  -- Airport Terminal - Airside Package (Awarded)
  ('s5555555-1111-1111-1111-111111111111', 'b5555555-1111-1111-1111-111111111111', gen_random_uuid(), 'Turner Construction', 'estimating@turner.com', '+1-212-229-6000', 'shortlisted', '2024-02-12', 249000000, 257000000, NOW(), NOW()),
  ('s5555555-1111-1111-1111-222222222222', 'b5555555-1111-1111-1111-111111111111', gen_random_uuid(), 'Skanska USA', 'bids@skanska.com', '+1-917-438-4500', 'submitted', '2024-02-11', 252000000, 260100000, NOW(), NOW()),
  ('s5555555-1111-1111-1111-333333333333', 'b5555555-1111-1111-1111-111111111111', gen_random_uuid(), 'Clark Construction', 'estimating@clarkconstruction.com', '+1-301-272-8100', 'submitted', '2024-02-13', 255000000, 263200000, NOW(), NOW()),
  ('s5555555-1111-1111-1111-444444444444', 'b5555555-1111-1111-1111-111111111111', gen_random_uuid(), 'Hensel Phelps', 'estimating@henselphelps.com', '+1-970-737-5100', 'submitted', '2024-02-10', 258000000, 266300000, NOW(), NOW());

-- Insert bid line items for evaluation bids
INSERT INTO bid_line_items (id, submission_id, vendor_name, csi_code, description, qty, uom, unit_price, extended, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  s.id as submission_id,
  s.vendor_name,
  csi.code as csi_code,
  csi.description,
  CASE 
    WHEN csi.unit = 'SF' THEN 50000 + floor(random() * 100000)
    WHEN csi.unit = 'CY' THEN 1000 + floor(random() * 5000)
    WHEN csi.unit = 'TON' THEN 500 + floor(random() * 2000)
    ELSE 1000 + floor(random() * 9000)
  END as qty,
  csi.unit as uom,
  csi.base_price * (0.85 + random() * 0.3) as unit_price,
  0 as extended, -- Will be calculated
  NOW() as created_at,
  NOW() as updated_at
FROM submissions s
CROSS JOIN (
  VALUES 
    ('03300', 'Cast-in-Place Concrete', 185, 'CY'),
    ('05100', 'Structural Steel Framing', 3250, 'TON'),
    ('07500', 'Roofing and Waterproofing', 28, 'SF'),
    ('08400', 'Entrances and Curtain Walls', 185, 'SF'),
    ('09200', 'Gypsum Board Systems', 8.50, 'SF'),
    ('23100', 'HVAC Systems', 42, 'SF'),
    ('26100', 'Electrical Distribution', 35, 'SF')
) AS csi(code, description, base_price, unit)
WHERE s.status = 'under_review';

-- Update extended prices
UPDATE bid_line_items SET extended = ROUND(qty * unit_price);

-- Insert leveling snapshots for bids in evaluation
INSERT INTO leveling_snapshot (id, bid_id, snapshot_data, outliers_detected, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  b.id as bid_id,
  jsonb_build_object(
    'total_outliers', floor(random() * 5)::int,
    'outliers_by_group', jsonb_build_object(),
    'outlier_severity', jsonb_build_object('mild', floor(random() * 3)::int, 'moderate', floor(random() * 2)::int, 'severe', 0),
    'matrix_data', '[]'::jsonb
  ) as snapshot_data,
  floor(random() * 5)::int as outliers_detected,
  NOW() as created_at,
  NOW() as updated_at
FROM bids b
WHERE b.status = 'evaluation';

-- Insert awards for awarded RFPs
INSERT INTO awards (id, bid_id, winning_submission_id, award_amount, status, awarded_at, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  b.id as bid_id,
  s.id as winning_submission_id,
  s.total_price as award_amount,
  'awarded' as status,
  b.submission_deadline + interval '21 days' as awarded_at,
  NOW() as created_at,
  NOW() as updated_at
FROM bids b
JOIN submissions s ON s.bid_id = b.id AND s.status = 'shortlisted'
WHERE b.status = 'awarded';

-- Insert scorecards for evaluated submissions
INSERT INTO scorecards (id, bid_id, submission_id, evaluator_id, technical_total, commercial_total, composite_score, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  s.bid_id,
  s.id as submission_id,
  '00000000-0000-0000-0000-000000000001' as evaluator_id,
  75 + floor(random() * 20)::int as technical_total,
  70 + floor(random() * 25)::int as commercial_total,
  72.5 + random() * 22.5 as composite_score,
  NOW() as created_at,
  NOW() as updated_at
FROM submissions s
WHERE s.status IN ('under_review', 'shortlisted');

-- Insert communication logs
INSERT INTO communication_logs (id, project_id, type, subject, participants, summary, created_by, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  comm_type.type,
  comm_subject.subject,
  ARRAY['Project Manager', 'Vendor Representative', 'Architect'] as participants,
  'Discussed project progress and upcoming milestones. Action items were assigned and documented.' as summary,
  'Project Manager' as created_by,
  NOW() - (random() * interval '60 days') as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES ('email'), ('phone'), ('meeting'), ('site_visit')
) AS comm_type(type)
CROSS JOIN (
  VALUES 
    ('Schedule Update'),
    ('RFI Response'),
    ('Change Order Discussion'),
    ('Safety Review'),
    ('Progress Meeting')
) AS comm_subject(subject)
LIMIT 50;

-- Insert notifications
INSERT INTO notifications (id, project_id, user_id, type, title, message, priority, read, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  '00000000-0000-0000-0000-000000000001' as user_id,
  notif_type.type,
  notif_type.title,
  notif_type.title || ' for ' || p.name as message,
  notif_type.priority,
  random() > 0.3 as read,
  NOW() - (random() * interval '30 days') as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('rfp_published', 'New RFP Published', 'high'),
    ('bid_received', 'New Bid Submission', 'medium'),
    ('award_issued', 'Contract Awarded', 'high'),
    ('document_uploaded', 'New Document Available', 'low'),
    ('deadline_approaching', 'Deadline Approaching', 'high')
) AS notif_type(type, title, priority)
LIMIT 40;

-- Insert action items
INSERT INTO action_items (id, project_id, title, description, status, priority, assigned_to, due_date, created_at, updated_at)
SELECT 
  gen_random_uuid() as id,
  p.id as project_id,
  action.title,
  action.description,
  action.status,
  action.priority,
  'Project Manager' as assigned_to,
  CURRENT_DATE + (floor(random() * 30) || ' days')::interval as due_date,
  NOW() as created_at,
  NOW() as updated_at
FROM projects p
CROSS JOIN (
  VALUES 
    ('Review vendor submissions', 'Complete technical review of all vendor submissions', 'in_progress', 'high'),
    ('Update procurement schedule', 'Revise schedule based on latest bid results', 'pending', 'medium'),
    ('Prepare award recommendation', 'Draft award recommendation memo for approval', 'pending', 'high'),
    ('Schedule pre-bid meeting', 'Coordinate mandatory pre-bid meeting for upcoming RFP', 'completed', 'medium'),
    ('Finalize contract terms', 'Review and finalize contract terms with legal team', 'in_progress', 'high')
) AS action(title, description, status, priority)
LIMIT 25;

-- Update project statistics
UPDATE projects p
SET 
  updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM bids b WHERE b.title LIKE p.name || '%'
);

-- Summary output
DO $$
DECLARE
  project_count INTEGER;
  bid_count INTEGER;
  submission_count INTEGER;
  award_count INTEGER;
  notification_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO project_count FROM projects;
  SELECT COUNT(*) INTO bid_count FROM bids;
  SELECT COUNT(*) INTO submission_count FROM submissions;
  SELECT COUNT(*) INTO award_count FROM awards;
  SELECT COUNT(*) INTO notification_count FROM notifications;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Procurement Data Seeding Complete!';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Projects: %', project_count;
  RAISE NOTICE 'RFPs/Bids: %', bid_count;
  RAISE NOTICE 'Vendor Submissions: %', submission_count;
  RAISE NOTICE 'Awards: %', award_count;
  RAISE NOTICE 'Notifications: %', notification_count;
  RAISE NOTICE '';
  RAISE NOTICE 'The procurement system is now fully populated with realistic data!';
END $$;

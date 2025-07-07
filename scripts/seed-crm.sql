-- Simple CRM data seeder
-- Run with: psql -h localhost -p 54322 -U postgres -d postgres -f scripts/seed-crm.sql

-- Temporarily disable the activity logging trigger to avoid created_by issues
ALTER TABLE company DISABLE TRIGGER log_company_activity;

-- Insert sample companies
INSERT INTO company (name, trade_codes, type, status, risk_score, diversity_flags) VALUES
('Turner Construction Company', ARRAY['GC-001', 'CM-001', 'Design-Build'], 'gc', 'active', 8, '{"minority_owned": false, "woman_owned": false, "veteran_owned": false, "small_business": false}'),
('Metropolitan Steel Works', ARRAY['05-1000', '05-2000', 'Structural Steel'], 'sub', 'active', 22, '{"minority_owned": true, "woman_owned": false, "veteran_owned": false, "small_business": true}'),
('Advanced MEP Solutions', ARRAY['15-0000', '16-0000', 'HVAC', 'Electrical'], 'sub', 'active', 15, '{"minority_owned": false, "woman_owned": true, "veteran_owned": false, "small_business": false}'),
('Premier Concrete Company', ARRAY['03-3000', '03-4000', 'Ready-Mix', 'Placement'], 'sub', 'active', 12, '{"minority_owned": false, "woman_owned": false, "veteran_owned": true, "small_business": false}'),
('Glass Tech Systems', ARRAY['08-4000', '08-8000', 'Curtain Wall', 'Glazing'], 'sub', 'active', 18, '{"minority_owned": false, "woman_owned": true, "veteran_owned": false, "small_business": true}');

-- Re-enable the trigger
ALTER TABLE company ENABLE TRIGGER log_company_activity;

-- Get company IDs for relationships
WITH company_ids AS (
  SELECT id, name FROM company WHERE name IN (
    'Turner Construction Company',
    'Metropolitan Steel Works',
    'Advanced MEP Solutions',
    'Premier Concrete Company',
    'Glass Tech Systems'
  )
)
-- Insert contacts
INSERT INTO contact (company_id, name, title, email, phone)
SELECT 
  c.id,
  CASE c.name
    WHEN 'Turner Construction Company' THEN 'Sarah Johnson'
    WHEN 'Metropolitan Steel Works' THEN 'John Smith'
    WHEN 'Advanced MEP Solutions' THEN 'Lisa Wang'
    WHEN 'Premier Concrete Company' THEN 'Robert Martinez'
    WHEN 'Glass Tech Systems' THEN 'Jennifer Chen'
  END as name,
  CASE c.name
    WHEN 'Turner Construction Company' THEN 'VP Operations'
    WHEN 'Metropolitan Steel Works' THEN 'President'
    WHEN 'Advanced MEP Solutions' THEN 'CEO'
    WHEN 'Premier Concrete Company' THEN 'Operations Manager'
    WHEN 'Glass Tech Systems' THEN 'Business Development'
  END as title,
  CASE c.name
    WHEN 'Turner Construction Company' THEN 'sarah.johnson@turnerconstruction.com'
    WHEN 'Metropolitan Steel Works' THEN 'john.smith@metrosteel.com'
    WHEN 'Advanced MEP Solutions' THEN 'lisa.wang@advancedmep.com'
    WHEN 'Premier Concrete Company' THEN 'robert.martinez@premierconcrete.com'
    WHEN 'Glass Tech Systems' THEN 'jennifer.chen@glasstech.com'
  END as email,
  CASE c.name
    WHEN 'Turner Construction Company' THEN '(212) 555-0156'
    WHEN 'Metropolitan Steel Works' THEN '(312) 555-0123'
    WHEN 'Advanced MEP Solutions' THEN '(408) 555-0187'
    WHEN 'Premier Concrete Company' THEN '(303) 555-0245'
    WHEN 'Glass Tech Systems' THEN '(206) 555-0167'
  END as phone
FROM company_ids c;

-- Insert opportunities
WITH company_ids AS (
  SELECT id, name FROM company WHERE name IN (
    'Turner Construction Company',
    'Metropolitan Steel Works',
    'Advanced MEP Solutions',
    'Premier Concrete Company',
    'Glass Tech Systems'
  )
)
INSERT INTO opportunity (company_id, stage, est_value, owner_id, next_action_date)
SELECT 
  c.id,
  CASE c.name
    WHEN 'Turner Construction Company' THEN 'negotiation'::opportunity_stage
    WHEN 'Metropolitan Steel Works' THEN 'shortlisted'::opportunity_stage
    WHEN 'Advanced MEP Solutions' THEN 'invited'::opportunity_stage
    WHEN 'Premier Concrete Company' THEN 'prospect'::opportunity_stage
    WHEN 'Glass Tech Systems' THEN 'shortlisted'::opportunity_stage
  END as stage,
  CASE c.name
    WHEN 'Turner Construction Company' THEN 125000000
    WHEN 'Metropolitan Steel Works' THEN 3200000
    WHEN 'Advanced MEP Solutions' THEN 8500000
    WHEN 'Premier Concrete Company' THEN 4200000
    WHEN 'Glass Tech Systems' THEN 2800000
  END as est_value,
  '00000000-0000-0000-0000-000000000000'::uuid as owner_id,
  (CURRENT_DATE + INTERVAL '7 days')::date as next_action_date
FROM company_ids c;

-- Insert some interactions
WITH company_ids AS (
  SELECT id, name FROM company WHERE name IN (
    'Turner Construction Company',
    'Metropolitan Steel Works',
    'Advanced MEP Solutions',
    'Premier Concrete Company',
    'Glass Tech Systems'
  )
)
INSERT INTO interaction (company_id, user_id, type, date, notes)
SELECT 
  c.id,
  '00000000-0000-0000-0000-000000000000'::uuid as user_id,
  'email'::interaction_type,
  CURRENT_TIMESTAMP - INTERVAL '7 days',
  'Initial project discussion email sent'
FROM company_ids c
UNION ALL
SELECT 
  c.id,
  '00000000-0000-0000-0000-000000000000'::uuid as user_id,
  'meeting'::interaction_type,
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  'Productive meeting discussing project requirements'
FROM company_ids c;

-- Insert sample tasks
WITH opp_data AS (
  SELECT o.id as opp_id, o.company_id, c.name as company_name
  FROM opportunity o
  JOIN company c ON c.id = o.company_id
)
INSERT INTO crm_tasks (
  title, 
  description, 
  company_id, 
  opportunity_id, 
  assignee_id, 
  assignee_name, 
  priority, 
  status, 
  due_date, 
  created_by
)
SELECT
  'Follow up on ' || company_name,
  'Contact client regarding opportunity',
  company_id,
  opp_id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'System User',
  CASE (ROW_NUMBER() OVER ())::int % 2
    WHEN 0 THEN 'high'::task_priority
    ELSE 'medium'::task_priority
  END,
  'todo'::task_status,
  CURRENT_DATE + INTERVAL '7 days',
  '00000000-0000-0000-0000-000000000000'::uuid
FROM opp_data;

-- Show summary
SELECT 'Companies:' as entity, COUNT(*) as count FROM company
UNION ALL
SELECT 'Contacts:', COUNT(*) FROM contact
UNION ALL
SELECT 'Opportunities:', COUNT(*) FROM opportunity
UNION ALL
SELECT 'Interactions:', COUNT(*) FROM interaction
UNION ALL
SELECT 'Tasks:', COUNT(*) FROM crm_tasks;

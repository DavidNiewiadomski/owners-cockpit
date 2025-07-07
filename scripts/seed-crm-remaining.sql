-- Insert remaining CRM data (contacts, opportunities, tasks)

-- Insert contacts (if not already exists)
WITH company_ids AS (
  SELECT id, name FROM company WHERE name IN (
    'Turner Construction Company',
    'Metropolitan Steel Works',
    'Advanced MEP Solutions',
    'Premier Concrete Company',
    'Glass Tech Systems'
  )
)
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
FROM company_ids c
WHERE NOT EXISTS (
  SELECT 1 FROM contact WHERE company_id = c.id
);

-- Insert opportunities (if not already exists)
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
FROM company_ids c
WHERE NOT EXISTS (
  SELECT 1 FROM opportunity WHERE company_id = c.id
);

-- Update opportunities with additional fields
UPDATE opportunity o
SET 
  name = CASE c.name
    WHEN 'Turner Construction Company' THEN 'Downtown Medical Center - Phase 2'
    WHEN 'Metropolitan Steel Works' THEN 'Tech Campus Structural Steel Package'
    WHEN 'Advanced MEP Solutions' THEN 'Corporate HQ MEP Systems'
    WHEN 'Premier Concrete Company' THEN 'Airport Terminal Foundations'
    WHEN 'Glass Tech Systems' THEN 'Mixed-Use Tower Curtain Wall'
  END,
  description = CASE c.name
    WHEN 'Turner Construction Company' THEN 'Major healthcare facility expansion project'
    WHEN 'Metropolitan Steel Works' THEN 'Structural steel fabrication and erection'
    WHEN 'Advanced MEP Solutions' THEN 'Complete MEP package for 40-story HQ'
    WHEN 'Premier Concrete Company' THEN 'Concrete foundations for terminal expansion'
    WHEN 'Glass Tech Systems' THEN 'High-performance curtain wall system'
  END,
  project_type = CASE c.name
    WHEN 'Turner Construction Company' THEN 'Healthcare'
    WHEN 'Metropolitan Steel Works' THEN 'Commercial'
    WHEN 'Advanced MEP Solutions' THEN 'Commercial'
    WHEN 'Premier Concrete Company' THEN 'Infrastructure'
    WHEN 'Glass Tech Systems' THEN 'Commercial'
  END,
  probability = CASE c.name
    WHEN 'Turner Construction Company' THEN 85
    WHEN 'Metropolitan Steel Works' THEN 65
    WHEN 'Advanced MEP Solutions' THEN 75
    WHEN 'Premier Concrete Company' THEN 45
    WHEN 'Glass Tech Systems' THEN 55
  END
FROM company c
WHERE o.company_id = c.id
AND c.name IN (
  'Turner Construction Company',
  'Metropolitan Steel Works',
  'Advanced MEP Solutions',
  'Premier Concrete Company',
  'Glass Tech Systems'
);

-- Insert sample tasks
WITH opp_data AS (
  SELECT o.id as opp_id, o.company_id, c.name as company_name
  FROM opportunity o
  JOIN company c ON c.id = o.company_id
  WHERE c.name IN (
    'Turner Construction Company',
    'Metropolitan Steel Works',
    'Advanced MEP Solutions',
    'Premier Concrete Company',
    'Glass Tech Systems'
  )
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
FROM opp_data
WHERE NOT EXISTS (
  SELECT 1 FROM crm_tasks WHERE opportunity_id = opp_id
);

-- Insert some communications
WITH contact_data AS (
  SELECT 
    con.id as contact_id,
    con.company_id,
    o.id as opportunity_id
  FROM contact con
  JOIN opportunity o ON o.company_id = con.company_id
  JOIN company c ON c.id = con.company_id
  WHERE c.name IN (
    'Turner Construction Company',
    'Metropolitan Steel Works',
    'Advanced MEP Solutions',
    'Premier Concrete Company',
    'Glass Tech Systems'
  )
)
INSERT INTO crm_communications (
  type,
  subject,
  content,
  company_id,
  contact_id,
  opportunity_id,
  from_user_id,
  status,
  created_at
)
SELECT
  'email'::communication_type,
  'Project Proposal Follow-up',
  'Following up on our recent discussion about the project proposal.',
  company_id,
  contact_id,
  opportunity_id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'sent'::communication_status,
  CURRENT_TIMESTAMP - INTERVAL '2 days'
FROM contact_data;

-- Show final summary
SELECT 'Data Seeding Complete!' as status;
SELECT '=====================' as separator;
SELECT 'Companies:' as entity, COUNT(*) as count FROM company
UNION ALL
SELECT 'Contacts:', COUNT(*) FROM contact
UNION ALL
SELECT 'Opportunities:', COUNT(*) FROM opportunity
UNION ALL
SELECT 'Interactions:', COUNT(*) FROM interaction
UNION ALL
SELECT 'Tasks:', COUNT(*) FROM crm_tasks
UNION ALL
SELECT 'Communications:', COUNT(*) FROM crm_communications
UNION ALL
SELECT 'Activities:', COUNT(*) FROM crm_activities;

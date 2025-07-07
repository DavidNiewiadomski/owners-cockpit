-- Final seed script with triggers disabled

-- Disable all activity logging triggers temporarily
ALTER TABLE company DISABLE TRIGGER log_company_activity;
ALTER TABLE contact DISABLE TRIGGER log_contact_activity;
ALTER TABLE opportunity DISABLE TRIGGER log_opportunity_activity;

-- Insert remaining contacts
WITH company_ids AS (
  SELECT id, name FROM company WHERE name IN (
    'Turner Construction Company',
    'Metropolitan Steel Works',
    'Advanced MEP Solutions',
    'Premier Concrete Company',
    'Glass Tech Systems'
  )
  AND NOT EXISTS (
    SELECT 1 FROM contact WHERE company_id = company.id
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
FROM company_ids c;

-- Insert some communications (without duplicate data)
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
  AND NOT EXISTS (
    SELECT 1 FROM crm_communications 
    WHERE company_id = con.company_id 
    AND contact_id = con.id
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
  status
)
SELECT
  'email'::communication_type,
  'Project Proposal Follow-up',
  'Following up on our recent discussion about the project proposal.',
  company_id,
  contact_id,
  opportunity_id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'sent'::communication_status
FROM contact_data;

-- Re-enable triggers
ALTER TABLE company ENABLE TRIGGER log_company_activity;
ALTER TABLE contact ENABLE TRIGGER log_contact_activity;
ALTER TABLE opportunity ENABLE TRIGGER log_opportunity_activity;

-- Insert some sample documents
INSERT INTO crm_documents (
  name,
  type,
  company_id,
  uploaded_by,
  description,
  file_size,
  mime_type
)
SELECT
  'Company Profile - ' || c.name,
  'other'::document_type,
  c.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Company profile and capabilities document',
  1024000,
  'application/pdf'
FROM company c
WHERE c.name IN (
  'Turner Construction Company',
  'Metropolitan Steel Works',
  'Advanced MEP Solutions',
  'Premier Concrete Company',
  'Glass Tech Systems'
);

-- Show final summary
SELECT '================================' as separator;
SELECT 'CRM DATA SEEDING COMPLETE!' as status;
SELECT '================================' as separator;
SELECT '';
SELECT 'Entity' as entity, 'Count' as count
UNION ALL
SELECT '-------------------', '-------'
UNION ALL
SELECT 'Companies:', COUNT(*)::text FROM company
UNION ALL
SELECT 'Contacts:', COUNT(*)::text FROM contact
UNION ALL
SELECT 'Opportunities:', COUNT(*)::text FROM opportunity
UNION ALL
SELECT 'Interactions:', COUNT(*)::text FROM interaction
UNION ALL
SELECT 'Tasks:', COUNT(*)::text FROM crm_tasks
UNION ALL
SELECT 'Communications:', COUNT(*)::text FROM crm_communications
UNION ALL
SELECT 'Documents:', COUNT(*)::text FROM crm_documents
UNION ALL
SELECT 'Activities:', COUNT(*)::text FROM crm_activities;

-- Sample queries to verify data
SELECT '';
SELECT 'Sample Company with Contact:' as query;
SELECT c.name as company, con.name as contact, con.title, con.email
FROM company c
JOIN contact con ON con.company_id = c.id
LIMIT 3;

SELECT '';
SELECT 'Sample Opportunities:' as query;
SELECT c.name as company, o.name as opportunity, o.stage, o.est_value
FROM opportunity o
JOIN company c ON c.id = o.company_id
LIMIT 3;

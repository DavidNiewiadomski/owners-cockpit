
-- Update all integrations to connected status for demo
UPDATE public.project_integrations 
SET 
  status = 'connected',
  last_sync = '2025-06-24T01:30:00.000Z',
  sync_error = NULL,
  updated_at = '2025-06-24T01:30:00.000Z'
WHERE project_id = '11111111-1111-1111-1111-111111111111';

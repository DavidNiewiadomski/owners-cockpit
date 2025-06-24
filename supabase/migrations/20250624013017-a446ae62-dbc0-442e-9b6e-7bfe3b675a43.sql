
-- Update the provider constraint to include all integration providers needed for construction cockpit
ALTER TABLE public.project_integrations 
DROP CONSTRAINT IF EXISTS project_integrations_provider_check;

ALTER TABLE public.project_integrations 
ADD CONSTRAINT project_integrations_provider_check 
CHECK (provider IN ('procore', 'primavera', 'box', 'iot_sensors', 'smartsheet', 'green_badger', 'billy', 'clearstory', 'track3d'));

-- Insert sample integrations for the demo project to show all available services
INSERT INTO public.project_integrations (project_id, provider, status, last_sync, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'primavera', 'connected', '2025-06-23T20:30:00.000Z', '2025-06-22T01:07:36.767954+00:00', '2025-06-23T20:30:00.000Z'),
('11111111-1111-1111-1111-111111111111', 'box', 'error', '2025-06-23T15:00:00.000Z', '2025-06-20T01:07:36.767954+00:00', '2025-06-23T18:00:00.000Z'),
('11111111-1111-1111-1111-111111111111', 'iot_sensors', 'connected', '2025-06-24T00:15:00.000Z', '2025-06-21T01:07:36.767954+00:00', '2025-06-24T00:15:00.000Z'),
('11111111-1111-1111-1111-111111111111', 'green_badger', 'syncing', NULL, '2025-06-22T01:07:36.767954+00:00', '2025-06-24T01:00:00.000Z'),
('11111111-1111-1111-1111-111111111111', 'billy', 'connected', '2025-06-23T12:45:00.000Z', '2025-06-19T01:07:36.767954+00:00', '2025-06-23T16:45:00.000Z'),
('11111111-1111-1111-1111-111111111111', 'clearstory', 'not_connected', NULL, '2025-06-23T01:07:36.767954+00:00', '2025-06-23T01:07:36.767954+00:00'),
('11111111-1111-1111-1111-111111111111', 'track3d', 'connected', '2025-06-23T22:00:00.000Z', '2025-06-18T01:07:36.767954+00:00', '2025-06-23T22:00:00.000Z')
ON CONFLICT (project_id, provider) DO NOTHING;

-- Add sync error for the Box integration to demonstrate error handling
UPDATE public.project_integrations 
SET sync_error = 'Authentication token expired. Please reconnect.'
WHERE provider = 'box' AND project_id = '11111111-1111-1111-1111-111111111111';

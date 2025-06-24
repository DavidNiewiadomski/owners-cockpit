
-- Update the constraint to include new providers and replace box with onedrive
ALTER TABLE public.project_integrations 
DROP CONSTRAINT IF EXISTS project_integrations_provider_check;

ALTER TABLE public.project_integrations 
ADD CONSTRAINT project_integrations_provider_check 
CHECK (provider IN ('procore', 'primavera', 'onedrive', 'iot_sensors', 'smartsheet', 'green_badger', 'billy', 'clearstory', 'track3d', 'bim360', 'microsoft_teams', 'zoom', 'outlook'));

-- Update existing Box integrations to OneDrive
UPDATE public.project_integrations 
SET provider = 'onedrive' 
WHERE provider = 'box';

-- Add sample data for new integrations
INSERT INTO public.project_integrations (
    project_id,
    provider,
    status,
    last_sync,
    created_at,
    updated_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'bim360',
    'connected',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '3 hours'
),
(
    '11111111-1111-1111-1111-111111111111',
    'microsoft_teams',
    'connected',
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '30 minutes'
),
(
    '22222222-2222-2222-2222-222222222222',
    'zoom',
    'error',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 hour'
),
(
    '33333333-3333-3333-3333-333333333333',
    'outlook',
    'connected',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 hour'
);

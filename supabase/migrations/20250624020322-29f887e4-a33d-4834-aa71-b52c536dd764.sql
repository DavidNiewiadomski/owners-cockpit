
-- First, let's see what providers currently exist
SELECT DISTINCT provider FROM public.project_integrations;

-- Drop the existing constraint
ALTER TABLE public.project_integrations 
DROP CONSTRAINT IF EXISTS project_integrations_provider_check;

-- Update existing Box integrations to OneDrive first
UPDATE public.project_integrations 
SET provider = 'onedrive' 
WHERE provider = 'box';

-- Now add the constraint with all the providers
ALTER TABLE public.project_integrations 
ADD CONSTRAINT project_integrations_provider_check 
CHECK (provider IN ('procore', 'primavera', 'onedrive', 'iot_sensors', 'smartsheet', 'green_badger', 'billy', 'clearstory', 'track3d', 'bim360', 'microsoft_teams', 'zoom', 'outlook'));

-- Add sample data for new integrations (using ON CONFLICT DO NOTHING to avoid duplicates)
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
)
ON CONFLICT DO NOTHING;


-- First, drop the existing constraint that's blocking us
ALTER TABLE public.project_integrations 
DROP CONSTRAINT IF EXISTS project_integrations_provider_check;

-- Add the updated constraint with all supported providers
ALTER TABLE public.project_integrations 
ADD CONSTRAINT project_integrations_provider_check 
CHECK (provider IN ('procore', 'primavera', 'box', 'iot_sensors', 'smartsheet', 'green_badger', 'billy', 'clearstory', 'track3d'));

-- Now insert sample integration data for testing
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
    'procore',
    'connected',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '2 hours'
),
(
    '11111111-1111-1111-1111-111111111111',
    'smartsheet',
    'connected',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
),
(
    '22222222-2222-2222-2222-222222222222',
    'box',
    'error',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '1 week',
    NOW() - INTERVAL '1 hour'
),
(
    '22222222-2222-2222-2222-222222222222',
    'green_badger',
    'syncing',
    NOW() - INTERVAL '10 minutes',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '10 minutes'
),
(
    '33333333-3333-3333-3333-333333333333',
    'track3d',
    'connected',
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '30 minutes'
);

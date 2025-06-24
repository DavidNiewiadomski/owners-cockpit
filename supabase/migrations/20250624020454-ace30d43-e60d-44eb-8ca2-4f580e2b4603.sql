
-- Add Zoom and Outlook integrations to the demo project
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
    'zoom',
    'connected',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 hour'
),
(
    '11111111-1111-1111-1111-111111111111',
    'outlook',
    'connected',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '2 hours'
)
ON CONFLICT DO NOTHING;

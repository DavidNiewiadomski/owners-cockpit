
-- Create capture_sets table for storing reality capture data
CREATE TABLE public.capture_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    capture_date TIMESTAMPTZ NOT NULL,
    thumbnail_url TEXT,
    pano_url TEXT,
    pointcloud_url TEXT,
    progress_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.capture_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access capture sets for projects they have access to
CREATE POLICY "Users can view capture sets for accessible projects"
    ON public.capture_sets
    FOR ALL
    USING (
        project_id IN (
            SELECT project_id 
            FROM public.user_projects 
            WHERE user_id = auth.uid()
        )
    );

-- Enable realtime for live updates
ALTER TABLE public.capture_sets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.capture_sets;

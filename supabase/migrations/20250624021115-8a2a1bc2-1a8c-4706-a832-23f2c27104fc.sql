
-- Create communications table for storing all project communications
CREATE TABLE public.communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('teams', 'outlook', 'zoom', 'google_meet', 'manual')),
    comm_type TEXT NOT NULL CHECK (comm_type IN ('email', 'chat_message', 'meeting_recording', 'meeting_transcript', 'channel_message')),
    subject TEXT,
    body TEXT,
    speaker JSONB DEFAULT '{}',
    message_ts TIMESTAMPTZ NOT NULL,
    url TEXT,
    embedding VECTOR(1536),
    participants JSONB DEFAULT '[]',
    thread_id TEXT,
    external_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create integration_tokens table for storing encrypted OAuth tokens
CREATE TABLE public.integration_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('teams', 'outlook', 'zoom', 'google_meet')),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_data JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, project_id, provider)
);

-- Create indexes for performance
CREATE INDEX idx_communications_project_id ON public.communications(project_id);
CREATE INDEX idx_communications_message_ts ON public.communications(message_ts DESC);
CREATE INDEX idx_communications_provider ON public.communications(provider);
CREATE INDEX idx_communications_comm_type ON public.communications(comm_type);
CREATE INDEX idx_communications_thread_id ON public.communications(thread_id) WHERE thread_id IS NOT NULL;
CREATE INDEX idx_communications_external_id ON public.communications(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_integration_tokens_user_project ON public.integration_tokens(user_id, project_id);

-- Create vector similarity index for RAG
CREATE INDEX ON public.communications USING hnsw (embedding vector_cosine_ops) WHERE embedding IS NOT NULL;

-- Enable RLS on both tables
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for communications
-- Users can view communications if they have project access AND are participants or have exec/admin role
CREATE POLICY "Users can view project communications with proper access" 
ON public.communications FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_projects up 
        WHERE up.user_id = auth.uid() 
        AND up.project_id = communications.project_id
    )
    AND (
        -- User is a participant in the communication
        participants ? auth.uid()::text
        OR
        -- User has admin/exec role
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.project_id = communications.project_id
            AND ur.role IN ('admin', 'gc')
        )
    )
);

-- Users can insert communications for projects they have access to
CREATE POLICY "Users can insert communications for accessible projects"
ON public.communications FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_projects up 
        WHERE up.user_id = auth.uid() 
        AND up.project_id = communications.project_id
    )
);

-- Users can update their own communications or if they have admin role
CREATE POLICY "Users can update communications with proper access"
ON public.communications FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_projects up 
        WHERE up.user_id = auth.uid() 
        AND up.project_id = communications.project_id
    )
    AND (
        speaker->>'id' = auth.uid()::text
        OR
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.project_id = communications.project_id
            AND ur.role IN ('admin', 'gc')
        )
    )
);

-- RLS policies for integration_tokens
-- Users can only access their own tokens
CREATE POLICY "Users can manage their own integration tokens"
ON public.integration_tokens FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create updated_at trigger for communications
CREATE OR REPLACE FUNCTION public.update_communications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_communications_updated_at
    BEFORE UPDATE ON public.communications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_communications_updated_at();

-- Create updated_at trigger for integration_tokens
CREATE OR REPLACE FUNCTION public.update_integration_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_integration_tokens_updated_at
    BEFORE UPDATE ON public.integration_tokens
    FOR EACH ROW
    EXECUTE FUNCTION public.update_integration_tokens_updated_at();

-- Create function to search communications with embeddings
CREATE OR REPLACE FUNCTION public.search_communications(
    query_embedding VECTOR(1536),
    project_uuid UUID,
    match_count INTEGER DEFAULT 10,
    similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    project_id UUID,
    provider TEXT,
    comm_type TEXT,
    subject TEXT,
    body TEXT,
    speaker JSONB,
    message_ts TIMESTAMPTZ,
    url TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.project_id,
        c.provider,
        c.comm_type,
        c.subject,
        c.body,
        c.speaker,
        c.message_ts,
        c.url,
        (1 - (c.embedding <=> query_embedding)) AS similarity
    FROM public.communications c
    WHERE c.project_id = project_uuid
        AND c.embedding IS NOT NULL
        AND (1 - (c.embedding <=> query_embedding)) > similarity_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Create storage bucket for meeting recordings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'recordings',
    'recordings',
    false,
    104857600, -- 100MB limit
    ARRAY['video/mp4', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'video/webm']
);

-- Storage policies for recordings bucket
CREATE POLICY "Users can upload recordings for their projects"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'recordings'
    AND EXISTS (
        SELECT 1 FROM public.user_projects up 
        WHERE up.user_id = auth.uid() 
        AND up.project_id = (storage.foldername(name))[1]::UUID
    )
);

CREATE POLICY "Users can view recordings for accessible projects"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'recordings'
    AND EXISTS (
        SELECT 1 FROM public.user_projects up 
        WHERE up.user_id = auth.uid() 
        AND up.project_id = (storage.foldername(name))[1]::UUID
    )
);

CREATE POLICY "Users can delete recordings for their projects with admin role"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'recordings'
    AND EXISTS (
        SELECT 1 FROM public.user_projects up 
        JOIN public.user_roles ur ON ur.user_id = up.user_id AND ur.project_id = up.project_id
        WHERE up.user_id = auth.uid() 
        AND up.project_id = (storage.foldername(name))[1]::UUID
        AND ur.role IN ('admin', 'gc')
    )
);

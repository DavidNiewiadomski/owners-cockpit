
-- Create insights table for AI-generated project insights
CREATE TABLE IF NOT EXISTS public.insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    context_data JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Users can view insights for projects they have access to
CREATE POLICY "Users can view insights for accessible projects" ON public.insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_projects up 
            WHERE up.user_id = auth.uid() AND up.project_id = insights.project_id
        )
    );

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_insights_project_created 
ON public.insights(project_id, created_at DESC);

-- Add index for unread insights
CREATE INDEX IF NOT EXISTS idx_insights_unread 
ON public.insights(project_id, read_at) WHERE read_at IS NULL;

-- Enable realtime for insights table
ALTER TABLE public.insights REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.insights;

-- Create user notification preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    insight_frequency TEXT NOT NULL DEFAULT 'realtime' CHECK (insight_frequency IN ('realtime', 'daily', 'weekly')),
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add RLS for notification preferences
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notification preferences" ON public.user_notification_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insights_updated_at_trigger
    BEFORE UPDATE ON public.insights
    FOR EACH ROW EXECUTE FUNCTION update_insights_updated_at();

CREATE TRIGGER user_notification_preferences_updated_at_trigger
    BEFORE UPDATE ON public.user_notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_insights_updated_at();

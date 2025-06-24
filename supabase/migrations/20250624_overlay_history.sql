
-- Create overlay_history table for storing user command history
CREATE TABLE IF NOT EXISTS public.overlay_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.overlay_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own overlay history
CREATE POLICY "Users can view own overlay history" ON public.overlay_history
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own overlay history
CREATE POLICY "Users can insert own overlay history" ON public.overlay_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_overlay_history_user_created 
ON public.overlay_history(user_id, created_at DESC);

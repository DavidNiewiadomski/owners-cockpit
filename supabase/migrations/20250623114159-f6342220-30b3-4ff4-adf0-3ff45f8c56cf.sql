
-- Create audit_logs table to track all actions
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create index for better performance on common queries
CREATE INDEX idx_audit_logs_project_created ON public.audit_logs(project_id, created_at DESC);
CREATE INDEX idx_audit_logs_user_created ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);

-- RLS policy for audit_logs - users can view logs for projects they have access to
CREATE POLICY "Users can view audit logs for accessible projects"
  ON public.audit_logs
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.user_projects WHERE user_id = auth.uid()
    )
  );

-- Only admins and GCs can insert audit logs (typically done by triggers)
CREATE POLICY "Admins and GCs can manage audit logs"
  ON public.audit_logs
  FOR ALL
  USING (public.has_admin_access(auth.uid(), project_id))
  WITH CHECK (public.has_admin_access(auth.uid(), project_id));

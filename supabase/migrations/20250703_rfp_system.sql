-- Add RFP project tables
CREATE TABLE IF NOT EXISTS public.rfp_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'evaluation', 'leveling_complete', 'bafo_requested', 'awarded', 'cancelled')),
  bid_type TEXT,
  estimated_value NUMERIC(15,2),
  currency TEXT DEFAULT 'USD',
  owner_id UUID REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  settings JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT rfp_projects_settings_check CHECK (
    jsonb_typeof(settings) = 'object'
  )
);

CREATE TABLE IF NOT EXISTS public.rfp_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES rfp_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  csi_code TEXT,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  ai_assisted BOOLEAN DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('draft', 'in-review', 'approved')),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  reviewers UUID[] DEFAULT '{}'::uuid[],
  comments JSONB DEFAULT '[]'::jsonb,
  CONSTRAINT rfp_scopes_requirements_check CHECK (
    jsonb_typeof(requirements) = 'array'
  ),
  CONSTRAINT rfp_scopes_specifications_check CHECK (
    jsonb_typeof(specifications) = 'array'
  ),
  CONSTRAINT rfp_scopes_attachments_check CHECK (
    jsonb_typeof(attachments) = 'array'
  ),
  CONSTRAINT rfp_scopes_comments_check CHECK (
    jsonb_typeof(comments) = 'array'
  )
);

CREATE TABLE IF NOT EXISTS public.rfp_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES rfp_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('milestone', 'task', 'deadline')),
  date DATE NOT NULL,
  duration INTEGER,
  dependencies UUID[] DEFAULT '{}'::uuid[],
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'delayed', 'at-risk')),
  description TEXT,
  critical_path BOOLEAN DEFAULT false,
  assignee_id UUID REFERENCES auth.users(id),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  notifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT rfp_timeline_events_notifications_check CHECK (
    jsonb_typeof(notifications) = 'array'
  )
);

CREATE TABLE IF NOT EXISTS public.rfp_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES rfp_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}'::text[],
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.rfp_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES rfp_projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'warning', 'alert', 'update')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  timestamp TIMESTAMPTZ DEFAULT now(),
  event_id UUID REFERENCES rfp_timeline_events(id) ON DELETE SET NULL,
  action_url TEXT,
  read BOOLEAN DEFAULT false,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_rfp_projects_org ON public.rfp_projects(org_id);
CREATE INDEX idx_rfp_projects_owner ON public.rfp_projects(owner_id);
CREATE INDEX idx_rfp_projects_status ON public.rfp_projects(status);

CREATE INDEX idx_rfp_scopes_project ON public.rfp_scopes(project_id);
CREATE INDEX idx_rfp_scopes_status ON public.rfp_scopes(status);
CREATE INDEX idx_rfp_scopes_reviewers ON public.rfp_scopes USING gin(reviewers);

CREATE INDEX idx_rfp_timeline_events_project ON public.rfp_timeline_events(project_id);
CREATE INDEX idx_rfp_timeline_events_date ON public.rfp_timeline_events(date);
CREATE INDEX idx_rfp_timeline_events_status ON public.rfp_timeline_events(status);
CREATE INDEX idx_rfp_timeline_events_assignee ON public.rfp_timeline_events(assignee_id);
CREATE INDEX idx_rfp_timeline_events_dependencies ON public.rfp_timeline_events USING gin(dependencies);

CREATE INDEX idx_rfp_team_members_project ON public.rfp_team_members(project_id);
CREATE INDEX idx_rfp_team_members_user ON public.rfp_team_members(user_id);

CREATE INDEX idx_rfp_notifications_project ON public.rfp_notifications(project_id);
CREATE INDEX idx_rfp_notifications_recipient ON public.rfp_notifications(recipient_id);
CREATE INDEX idx_rfp_notifications_unread ON public.rfp_notifications(project_id, read) WHERE NOT read;

-- Add triggers for updating timestamps
CREATE TRIGGER update_rfp_projects_updated_at
  BEFORE UPDATE ON public.rfp_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rfp_scopes_updated_at
  BEFORE UPDATE ON public.rfp_scopes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rfp_timeline_events_updated_at
  BEFORE UPDATE ON public.rfp_timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rfp_team_members_updated_at
  BEFORE UPDATE ON public.rfp_team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.rfp_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfp_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfp_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfp_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfp_notifications ENABLE ROW LEVEL SECURITY;

-- RFP project policies
CREATE POLICY "Enable read access for all users" ON public.rfp_projects
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = id
  ));

CREATE POLICY "Enable insert for authenticated users" ON public.rfp_projects
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Enable update for project members" ON public.rfp_projects
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = id
  ));

-- RFP scope policies
CREATE POLICY "Enable read access for project members" ON public.rfp_scopes
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

CREATE POLICY "Enable insert for project members" ON public.rfp_scopes
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

CREATE POLICY "Enable update for project members" ON public.rfp_scopes
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

-- RFP timeline event policies
CREATE POLICY "Enable read access for project members" ON public.rfp_timeline_events
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

CREATE POLICY "Enable insert for project members" ON public.rfp_timeline_events
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

CREATE POLICY "Enable update for project members" ON public.rfp_timeline_events
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

-- RFP team member policies
CREATE POLICY "Enable read access for project members" ON public.rfp_team_members
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

CREATE POLICY "Enable insert for project admins" ON public.rfp_team_members
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members 
    WHERE project_id = project_id AND 'admin' = ANY(permissions)
  ));

CREATE POLICY "Enable update for project admins" ON public.rfp_team_members
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members 
    WHERE project_id = project_id AND 'admin' = ANY(permissions)
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members 
    WHERE project_id = project_id AND 'admin' = ANY(permissions)
  ));

-- RFP notification policies
CREATE POLICY "Enable read access for recipients" ON public.rfp_notifications
  FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Enable insert for project members" ON public.rfp_notifications
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.rfp_team_members WHERE project_id = project_id
  ));

CREATE POLICY "Enable update for recipients" ON public.rfp_notifications
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

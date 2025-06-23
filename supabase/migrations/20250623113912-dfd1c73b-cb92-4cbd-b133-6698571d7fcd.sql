
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'gc', 'vendor', 'viewer');

-- Create user_roles table to manage role assignments
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, project_id)
);

-- Create external_invites table to track pending invitations
CREATE TABLE public.external_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(email, project_id)
);

-- Enable RLS on both tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_invites ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _project_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND project_id = _project_id
      AND role = _role
  )
$$;

-- Create function to check if user has admin or higher role
CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id UUID, _project_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND project_id = _project_id
      AND role IN ('admin', 'gc')
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view roles for projects they have access to"
  ON public.user_roles
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.user_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and GCs can manage user roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_admin_access(auth.uid(), project_id))
  WITH CHECK (public.has_admin_access(auth.uid(), project_id));

-- RLS policies for external_invites
CREATE POLICY "Users can view invites for projects they have access to"
  ON public.external_invites
  FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.user_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and GCs can manage invites"
  ON public.external_invites
  FOR ALL
  USING (public.has_admin_access(auth.uid(), project_id))
  WITH CHECK (public.has_admin_access(auth.uid(), project_id));

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_roles_updated_at 
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

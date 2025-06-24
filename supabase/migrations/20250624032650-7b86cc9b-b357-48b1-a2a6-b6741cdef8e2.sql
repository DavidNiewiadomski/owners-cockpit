
-- Create action_items table
CREATE TABLE public.action_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  priority TEXT DEFAULT 'Medium',
  due_date DATE,
  assignee UUID, -- References auth.users but no FK constraint since we can't reference auth schema
  source_type TEXT, -- 'meeting', 'insight', 'manual', etc.
  source_id UUID, -- References the source record (meeting, insight, etc.)
  created_by UUID, -- References auth.users
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Create policies for project-based access
CREATE POLICY "Users can view action items for their projects" 
  ON public.action_items 
  FOR SELECT 
  USING (has_project_access(project_id));

CREATE POLICY "Users can create action items for their projects" 
  ON public.action_items 
  FOR INSERT 
  WITH CHECK (has_project_access(project_id));

CREATE POLICY "Users can update action items for their projects" 
  ON public.action_items 
  FOR UPDATE 
  USING (has_project_access(project_id));

CREATE POLICY "Users can delete action items for their projects" 
  ON public.action_items 
  FOR DELETE 
  USING (has_project_access(project_id));

-- Create trigger for updated_at
CREATE TRIGGER update_action_items_updated_at
    BEFORE UPDATE ON public.action_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.action_items;

-- Create index for performance
CREATE INDEX idx_action_items_project_id ON public.action_items(project_id);
CREATE INDEX idx_action_items_status ON public.action_items(status);
CREATE INDEX idx_action_items_assignee ON public.action_items(assignee);
CREATE INDEX idx_action_items_due_date ON public.action_items(due_date);

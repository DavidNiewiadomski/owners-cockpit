
-- Create storage bucket for BIM models
INSERT INTO storage.buckets (id, name, public)
VALUES ('bim_models', 'bim_models', false);

-- Create BIM files table
CREATE TABLE public.bim_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'ifc',
  version INTEGER NOT NULL DEFAULT 1,
  file_size BIGINT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  upload_ts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create model bindings table to link BIM elements to project data
CREATE TABLE public.model_bindings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  bim_file_id UUID NOT NULL REFERENCES bim_files(id) ON DELETE CASCADE,
  element_id TEXT NOT NULL,
  element_type TEXT,
  binding_type TEXT NOT NULL, -- 'task', 'budget_item', 'rfi', 'safety_incident'
  binding_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_bim_files_project_id ON public.bim_files(project_id);
CREATE INDEX idx_bim_files_active ON public.bim_files(project_id, is_active) WHERE is_active = true;
CREATE INDEX idx_model_bindings_project_element ON public.model_bindings(project_id, element_id);
CREATE INDEX idx_model_bindings_binding ON public.model_bindings(binding_type, binding_id);

-- Enable RLS
ALTER TABLE public.bim_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_bindings ENABLE ROW LEVEL SECURITY;

-- RLS policies for bim_files
CREATE POLICY "Users can view BIM files for accessible projects" 
  ON public.bim_files 
  FOR SELECT 
  USING (has_project_access(project_id));

CREATE POLICY "Project managers can manage BIM files" 
  ON public.bim_files 
  FOR ALL 
  USING (has_admin_access(auth.uid(), project_id));

-- RLS policies for model_bindings
CREATE POLICY "Users can view model bindings for accessible projects" 
  ON public.model_bindings 
  FOR SELECT 
  USING (has_project_access(project_id));

CREATE POLICY "Project managers can manage model bindings" 
  ON public.model_bindings 
  FOR ALL 
  USING (has_admin_access(auth.uid(), project_id));

-- Storage policies for bim_models bucket
CREATE POLICY "Users can view BIM models for accessible projects"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'bim_models' AND
    EXISTS (
      SELECT 1 FROM public.bim_files bf
      WHERE bf.file_path = storage.objects.name
      AND has_project_access(bf.project_id)
    )
  );

CREATE POLICY "Project managers can upload BIM models"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'bim_models' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Project managers can update BIM models"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'bim_models' AND
    EXISTS (
      SELECT 1 FROM public.bim_files bf
      WHERE bf.file_path = storage.objects.name
      AND has_admin_access(auth.uid(), bf.project_id)
    )
  );

CREATE POLICY "Project managers can delete BIM models"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'bim_models' AND
    EXISTS (
      SELECT 1 FROM public.bim_files bf
      WHERE bf.file_path = storage.objects.name
      AND has_admin_access(auth.uid(), bf.project_id)
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_bim_files_updated_at
  BEFORE UPDATE ON public.bim_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_bindings_updated_at
  BEFORE UPDATE ON public.model_bindings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

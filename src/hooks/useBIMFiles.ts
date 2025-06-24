
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BIMFile {
  id: string;
  project_id: string;
  filename: string;
  file_path: string;
  file_type: string;
  version: number;
  file_size: number | null;
  is_active: boolean;
  uploaded_by: string | null;
  upload_ts: string;
  created_at: string;
  updated_at: string;
}

export const useBIMFiles = (projectId: string) => {
  return useQuery({
    queryKey: ['bim-files', projectId],
    queryFn: async (): Promise<BIMFile[]> => {
      const { data, error } = await supabase
        .from('bim_files')
        .select('*')
        .eq('project_id', projectId)
        .order('upload_ts', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch BIM files: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!projectId,
  });
};

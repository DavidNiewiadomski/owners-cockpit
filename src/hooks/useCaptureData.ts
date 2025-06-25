
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CaptureSet {
  id: string;
  project_id: string;
  provider: string;
  capture_date: string;
  thumbnail_url: string | null;
  pano_url: string | null;
  pointcloud_url: string | null;
  progress_data?: unknown;
  created_at: string;
}

export const useCaptureData = (projectId: string) => {
  return useQuery({
    queryKey: ['capture-data', projectId],
    queryFn: async (): Promise<CaptureSet[]> => {
      const { data, error } = await supabase
        .from('capture_sets')
        .select('*')
        .eq('project_id', projectId)
        .order('capture_date', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch capture data: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!projectId,
  });
};

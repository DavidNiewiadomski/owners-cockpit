
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectIntegration {
  id: string;
  project_id: string;
  provider: 'procore' | 'primavera' | 'onedrive' | 'iot_sensors' | 'smartsheet' | 'green_badger' | 'billy' | 'clearstory' | 'track3d' | 'bim360' | 'microsoft_teams' | 'zoom' | 'outlook';
  status: 'connected' | 'error' | 'not_connected' | 'syncing';
  api_key?: string;
  refresh_token?: string;
  oauth_data?: unknown;
  last_sync?: string;
  sync_error?: string;
  config?: unknown;
  created_at: string;
  updated_at: string;
}

export function useProjectIntegrationsQuery(projectId: string) {
  return useQuery({
    queryKey: ['project-integrations', projectId],
    queryFn: async (): Promise<ProjectIntegration[]> => {
      console.log('🔍 Fetching integrations for project:', projectId);
      
      // For demo project, map to actual project IDs that exist in the database
      let actualProjectId = projectId;
      if (projectId === 'project-1') {
        // Use the first project ID from your database screenshots
        actualProjectId = '11111111-1111-1111-1111-111111111111';
        console.log('🎭 Demo mode: mapping project-1 to actual project ID:', actualProjectId);
      }
      
      console.log('🏗️ Fetching integrations for mapped project:', actualProjectId);
      const { data, error } = await supabase
        .from('project_integrations')
        .select('*')
        .eq('project_id', actualProjectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching project integrations:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} integrations for project ${actualProjectId}:`, data);
      return (data || []).map(item => ({
        ...item,
        provider: item.provider as ProjectIntegration['provider'],
        status: item.status as ProjectIntegration['status']
      }));
    },
    enabled: !!projectId,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds 
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus for debugging
    refetchOnMount: true, // Enable refetch on component mount
    retry: 2, // Retry twice on failure
  });
}

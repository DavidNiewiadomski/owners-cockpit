
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectIntegration {
  id: string;
  project_id: string;
  provider: 'procore' | 'primavera' | 'box' | 'iot_sensors' | 'smartsheet' | 'green_badger' | 'billy' | 'clearstory' | 'track3d';
  status: 'connected' | 'error' | 'not_connected' | 'syncing';
  api_key?: string;
  refresh_token?: string;
  oauth_data?: any;
  last_sync?: string;
  sync_error?: string;
  config?: any;
  created_at: string;
  updated_at: string;
}

export function useProjectIntegrationsQuery(projectId: string) {
  return useQuery({
    queryKey: ['project-integrations', projectId],
    queryFn: async (): Promise<ProjectIntegration[]> => {
      console.log('Fetching integrations for project:', projectId);
      
      // If it's the demo project ID, get any project's integrations for demo purposes
      let actualProjectId = projectId;
      
      if (projectId === 'project-1') {
        // Get the first project from the database to use its integrations
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .limit(1);
        
        if (projects && projects.length > 0) {
          actualProjectId = projects[0].id;
          console.log('Using actual project ID for demo:', actualProjectId);
        } else {
          // No projects exist, return empty array
          return [];
        }
      }
      
      const { data, error } = await supabase
        .from('project_integrations')
        .select('*')
        .eq('project_id', actualProjectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project integrations:', error);
        throw error;
      }

      // Type assertion to ensure proper typing after database fetch
      return (data || []).map(item => ({
        ...item,
        provider: item.provider as ProjectIntegration['provider'],
        status: item.status as ProjectIntegration['status']
      }));
    },
    enabled: !!projectId,
  });
}

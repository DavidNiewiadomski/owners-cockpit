
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
      
      // If it's the demo project ID, get integrations from any project for demo purposes
      if (projectId === 'project-1') {
        console.log('Demo mode: fetching integrations from any available project');
        
        // First, try to get integrations from any project
        const { data: allIntegrations, error: integrationsError } = await supabase
          .from('project_integrations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20); // Get up to 20 integrations for demo

        if (integrationsError) {
          console.error('Error fetching integrations for demo:', integrationsError);
          // If we can't fetch integrations, return empty array rather than throw
          return [];
        }

        if (allIntegrations && allIntegrations.length > 0) {
          console.log(`Found ${allIntegrations.length} integrations for demo`);
          return allIntegrations.map(item => ({
            ...item,
            provider: item.provider as ProjectIntegration['provider'],
            status: item.status as ProjectIntegration['status']
          }));
        }

        // If no integrations exist anywhere, return empty array
        console.log('No integrations found in database');
        return [];
      }
      
      // For real project IDs, fetch normally
      const { data, error } = await supabase
        .from('project_integrations')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project integrations:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} integrations for project ${projectId}`);
      return (data || []).map(item => ({
        ...item,
        provider: item.provider as ProjectIntegration['provider'],
        status: item.status as ProjectIntegration['status']
      }));
    },
    enabled: !!projectId,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}

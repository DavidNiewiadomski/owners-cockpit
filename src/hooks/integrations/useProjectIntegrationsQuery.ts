
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
      console.log('🔍 Fetching integrations for project:', projectId);
      
      // If it's the demo project ID, get integrations from any project for demo purposes
      if (projectId === 'project-1') {
        console.log('🎭 Demo mode: fetching integrations from any available project');
        
        // First, try to get integrations from any project
        const { data: allIntegrations, error: integrationsError } = await supabase
          .from('project_integrations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20); // Get up to 20 integrations for demo

        if (integrationsError) {
          console.error('❌ Error fetching integrations for demo:', integrationsError);
          // Don't throw error, return empty array to prevent query failure
          return [];
        }

        if (allIntegrations && allIntegrations.length > 0) {
          console.log(`✅ Found ${allIntegrations.length} integrations for demo:`, allIntegrations);
          const mappedIntegrations = allIntegrations.map(item => ({
            ...item,
            provider: item.provider as ProjectIntegration['provider'],
            status: item.status as ProjectIntegration['status']
          }));
          console.log('🔄 Mapped integrations:', mappedIntegrations);
          return mappedIntegrations;
        }

        // If no integrations exist anywhere, return empty array
        console.log('📭 No integrations found in database');
        return [];
      }
      
      // For real project IDs, fetch normally
      console.log('🏗️ Fetching integrations for real project:', projectId);
      const { data, error } = await supabase
        .from('project_integrations')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching project integrations:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} integrations for project ${projectId}:`, data);
      return (data || []).map(item => ({
        ...item,
        provider: item.provider as ProjectIntegration['provider'],
        status: item.status as ProjectIntegration['status']
      }));
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes 
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
    retry: 1, // Only retry once on failure
  });
}

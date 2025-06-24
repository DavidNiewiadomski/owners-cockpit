
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
      
      // For demo project, let's fetch all integrations regardless of RLS
      if (projectId === 'project-1') {
        console.log('🎭 Demo mode: fetching integrations using service role bypass');
        
        // Try direct query first
        const { data: directData, error: directError } = await supabase
          .from('project_integrations')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('📊 Direct query result:', { directData, directError });

        if (directError) {
          console.error('❌ Direct query failed:', directError);
          
          // Fallback: try to get any integrations from existing projects
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('project_integrations')
            .select('*')
            .limit(10);

          if (fallbackError) {
            console.error('❌ Fallback query also failed:', fallbackError);
            return [];
          }

          console.log('✅ Fallback query succeeded:', fallbackData);
          return (fallbackData || []).map(item => ({
            ...item,
            provider: item.provider as ProjectIntegration['provider'],
            status: item.status as ProjectIntegration['status']
          }));
        }

        console.log('✅ Direct query succeeded with', directData?.length, 'integrations');
        return (directData || []).map(item => ({
          ...item,
          provider: item.provider as ProjectIntegration['provider'],
          status: item.status as ProjectIntegration['status']
        }));
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
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds 
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus for debugging
    refetchOnMount: true, // Enable refetch on component mount
    retry: 2, // Retry twice on failure
  });
}

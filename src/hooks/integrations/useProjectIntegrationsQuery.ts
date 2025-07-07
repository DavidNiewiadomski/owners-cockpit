
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
      
      // Demo mode: return mock connected integrations
      const mockIntegrations: ProjectIntegration[] = [
        {
          id: '1',
          project_id: projectId,
          provider: 'outlook',
          status: 'connected',
          last_sync: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          project_id: projectId,
          provider: 'microsoft_teams',
          status: 'connected',
          last_sync: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          project_id: projectId,
          provider: 'zoom',
          status: 'connected',
          last_sync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          project_id: projectId,
          provider: 'procore',
          status: 'connected',
          last_sync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          project_id: projectId,
          provider: 'primavera',
          status: 'connected',
          last_sync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          project_id: projectId,
          provider: 'bim360',
          status: 'connected',
          last_sync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      console.log(`✅ Returning ${mockIntegrations.length} mock integrations for demo:`, mockIntegrations);
      return mockIntegrations;
    },
    enabled: !!projectId,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds 
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus for debugging
    refetchOnMount: true, // Enable refetch on component mount
    retry: 2, // Retry twice on failure
  });
}

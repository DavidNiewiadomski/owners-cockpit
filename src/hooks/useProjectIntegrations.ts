
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface ProjectIntegration {
  id: string;
  project_id: string;
  provider: 'procore' | 'primavera' | 'box' | 'iot_sensors' | 'smartsheet';
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

export function useProjectIntegrations(projectId: string) {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel('project-integrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_integrations',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Integration change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['project-integrations', projectId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  return useQuery({
    queryKey: ['project-integrations', projectId],
    queryFn: async (): Promise<ProjectIntegration[]> => {
      console.log('Fetching integrations for project:', projectId);
      
      const { data, error } = await supabase
        .from('project_integrations')
        .select('*')
        .eq('project_id', projectId)
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

export function useCreateIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (integration: Omit<ProjectIntegration, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating integration:', integration);
      
      const { data, error } = await supabase
        .from('project_integrations')
        .upsert([integration], { 
          onConflict: 'project_id,provider',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating integration:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-integrations'] });
      toast.success('Integration connected successfully');
    },
    onError: (error) => {
      console.error('Failed to create integration:', error);
      toast.error('Failed to connect integration');
    },
  });
}

export function useUpdateIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectIntegration> & { id: string }) => {
      console.log('Updating integration:', id, updates);
      
      const { data, error } = await supabase
        .from('project_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating integration:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-integrations'] });
      toast.success('Integration updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update integration:', error);
      toast.error('Failed to update integration');
    },
  });
}

export function useDeleteIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting integration:', id);
      
      const { error } = await supabase
        .from('project_integrations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting integration:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-integrations'] });
      toast.success('Integration disconnected successfully');
    },
    onError: (error) => {
      console.error('Failed to delete integration:', error);
      toast.error('Failed to disconnect integration');
    },
  });
}

export function useTestIntegration() {
  return useMutation({
    mutationFn: async ({ provider, apiKey, refreshToken, oauthData, config }: {
      provider: string;
      apiKey?: string;
      refreshToken?: string;
      oauthData?: any;
      config?: any;
    }) => {
      console.log('Testing integration:', provider);
      
      const { data, error } = await supabase.functions.invoke('testIntegration', {
        body: { provider, apiKey, refreshToken, oauthData, config }
      });

      if (error) {
        console.error('Error testing integration:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.ok) {
        toast.success('Integration test successful');
      } else {
        toast.error(`Integration test failed: ${data.error}`);
      }
    },
    onError: (error) => {
      console.error('Failed to test integration:', error);
      toast.error('Failed to test integration');
    },
  });
}

export function useSyncIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ integrationId, provider }: { integrationId: string; provider: string }) => {
      console.log('Syncing integration:', integrationId, provider);
      
      // Update status to syncing
      await supabase
        .from('project_integrations')
        .update({ status: 'syncing', sync_error: null })
        .eq('id', integrationId);

      // Call appropriate sync function based on provider
      const syncFunction = `${provider}Sync`;
      const { data, error } = await supabase.functions.invoke(syncFunction, {
        body: { integrationId }
      });

      if (error) {
        // Update status to error
        await supabase
          .from('project_integrations')
          .update({ 
            status: 'error', 
            sync_error: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', integrationId);
        
        throw error;
      }

      // Update status to connected and last_sync
      await supabase
        .from('project_integrations')
        .update({ 
          status: 'connected', 
          last_sync: new Date().toISOString(),
          sync_error: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', integrationId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-integrations'] });
      toast.success('Sync completed successfully');
    },
    onError: (error) => {
      console.error('Failed to sync integration:', error);
      queryClient.invalidateQueries({ queryKey: ['project-integrations'] });
      toast.error('Sync failed');
    },
  });
}

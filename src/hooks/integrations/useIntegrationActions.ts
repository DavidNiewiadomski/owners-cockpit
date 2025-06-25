
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useTestIntegration() {
  return useMutation({
    mutationFn: async ({ provider, apiKey, refreshToken, oauthData, config }: {
      provider: string;
      apiKey?: string;
      refreshToken?: string;
      oauthData?: unknown;
      config?: unknown;
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

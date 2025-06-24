
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProjectIntegration } from './useProjectIntegrationsQuery';

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

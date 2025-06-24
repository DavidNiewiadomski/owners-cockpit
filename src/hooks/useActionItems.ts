
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ActionItem, CreateActionItemData, UpdateActionItemData } from '@/types/actionItems';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useActionItems(projectId: string) {
  return useQuery({
    queryKey: ['action-items', projectId],
    queryFn: async (): Promise<ActionItem[]> => {
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        status: item.status as ActionItem['status'],
        priority: item.priority as ActionItem['priority']
      }));
    },
    enabled: !!projectId
  });
}

export function useCreateActionItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: CreateActionItemData }) => {
      const { data: result, error } = await supabase
        .from('action_items')
        .insert({
          project_id: projectId,
          created_by: user?.id,
          ...data
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['action-items', projectId] });
      toast({
        title: 'Action Item Created',
        description: 'The action item has been successfully created.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create action item. Please try again.',
        variant: 'destructive'
      });
      console.error('Error creating action item:', error);
    }
  });
}

export function useUpdateActionItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateActionItemData }) => {
      const { data: result, error } = await supabase
        .from('action_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['action-items', result.project_id] });
      toast({
        title: 'Action Item Updated',
        description: 'The action item has been successfully updated.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update action item. Please try again.',
        variant: 'destructive'
      });
      console.error('Error updating action item:', error);
    }
  });
}

export function useDeleteActionItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from('action_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { id, projectId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['action-items', result.projectId] });
      toast({
        title: 'Action Item Deleted',
        description: 'The action item has been successfully deleted.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete action item. Please try again.',
        variant: 'destructive'
      });
      console.error('Error deleting action item:', error);
    }
  });
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserRole {
  id: string;
  user_id: string;
  project_id: string;
  role: 'admin' | 'gc' | 'vendor' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface ExternalInvite {
  id: string;
  email: string;
  project_id: string;
  role: 'admin' | 'gc' | 'vendor' | 'viewer';
  invited_by: string | null;
  status: string;
  expires_at: string;
  created_at: string;
}

export function useUserRoles(projectId?: string) {
  return useQuery({
    queryKey: ['user-roles', projectId],
    queryFn: async (): Promise<UserRole[]> => {
      console.log('Fetching user roles for project:', projectId);
      
      let query = supabase.from('user_roles').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }

      console.log('User roles fetched:', data);
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useExternalInvites(projectId?: string) {
  return useQuery({
    queryKey: ['external-invites', projectId],
    queryFn: async (): Promise<ExternalInvite[]> => {
      console.log('Fetching external invites for project:', projectId);
      
      let query = supabase.from('external_invites').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching external invites:', error);
        throw error;
      }

      console.log('External invites fetched:', data);
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, projectId, role }: { 
      userId: string; 
      projectId: string; 
      role: 'admin' | 'gc' | 'vendor' | 'viewer';
    }) => {
      console.log('Updating user role:', { userId, projectId, role });
      
      const { data, error } = await supabase
        .from('user_roles')
        .upsert([{
          user_id: userId,
          project_id: projectId,
          role,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    },
  });
}

export function useInviteExternalUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, projectId, role }: { 
      email: string; 
      projectId: string; 
      role: 'admin' | 'gc' | 'vendor' | 'viewer';
    }) => {
      console.log('Inviting external user:', { email, projectId, role });
      
      // Call the edge function to send the invitation
      const { data, error } = await supabase.functions.invoke('inviteExternalUser', {
        body: { email, projectId, role }
      });

      if (error) {
        console.error('Error inviting external user:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-invites'] });
      toast.success('Invitation sent successfully');
    },
    onError: (error) => {
      console.error('Failed to send invitation:', error);
      toast.error('Failed to send invitation');
    },
  });
}

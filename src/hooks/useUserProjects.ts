
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProject {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  created_at: string;
  project: {
    id: string;
    name: string;
    description?: string;
    status: string;
    start_date?: string;
    end_date?: string;
    org_id?: string;
  };
}

export function useUserProjects() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-projects', user?.id],
    queryFn: async (): Promise<UserProject[]> => {
      if (!user) return [];
      
      console.log('Fetching user projects...');
      
      const { data, error } = await supabase
        .from('user_projects')
        .select(`
          *,
          project:projects (
            id,
            name,
            description,
            status,
            start_date,
            end_date,
            org_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user projects:', error);
        throw error;
      }

      console.log('User projects fetched:', data);
      return data || [];
    },
    enabled: !!user,
  });
}

export function useGrantProjectAccess() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ projectId, userId, role = 'member' }: { 
      projectId: string; 
      userId?: string;
      role?: string;
    }) => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) throw new Error('No user ID provided');

      const { data, error } = await supabase
        .from('user_projects')
        .insert({
          user_id: targetUserId,
          project_id: projectId,
          role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

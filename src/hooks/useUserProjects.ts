
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  return useQuery({
    queryKey: ['user-projects'],
    queryFn: async (): Promise<UserProject[]> => {
      console.log('Fetching user projects from Supabase...');
      
      const { data, error } = await supabase
        .from('user_projects')
        .select(`
          *,
          project:projects(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user projects:', error);
        throw error;
      }

      console.log('User projects fetched from database:', data);
      return data || [];
    },
  });
}

export function useGrantProjectAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId, role = 'member' }: { 
      projectId: string; 
      userId?: string;
      role?: string;
    }) => {
      console.log('Granting project access:', { projectId, userId, role });
      
      const { data, error } = await supabase
        .from('user_projects')
        .insert([{
          user_id: userId || 'demo-user-123',
          project_id: projectId,
          role,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error granting project access:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

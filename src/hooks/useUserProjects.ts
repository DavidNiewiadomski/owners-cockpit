
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
      console.log('Fetching user projects - using direct project fetch for demo mode...');
      
      // In demo mode, we'll fetch all projects and format them as user projects
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      // Format projects as user projects for demo mode
      const userProjects: UserProject[] = (projects || []).map(project => ({
        id: `user-project-${project.id}`,
        user_id: '12345678-1234-1234-1234-123456789012',
        project_id: project.id,
        role: 'owner',
        created_at: project.created_at || new Date().toISOString(),
        project: project
      }));

      console.log('User projects fetched from database:', userProjects);
      return userProjects;
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
          user_id: userId || '12345678-1234-1234-1234-123456789012',
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

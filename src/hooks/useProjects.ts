
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  org_id?: string;
  created_at?: string;
  updated_at?: string;
}

export function useProjects() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async (): Promise<Project[]> => {
      if (!user) {
        console.log('No authenticated user, returning empty projects');
        return [];
      }

      console.log('Fetching projects from Supabase for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }

        console.log('Projects fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Database connection error:', error);
        throw error;
      }
    },
    enabled: !!user,
  });
}

export function useCreateProject() {
  const { user } = useAuth();
  
  return async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User must be authenticated to create projects');
    
    console.log('Creating project:', projectData);
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    console.log('Project created successfully:', data);
    return data;
  };
}

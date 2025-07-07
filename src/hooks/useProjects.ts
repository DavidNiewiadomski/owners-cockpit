import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getAllProjects } from '@/utils/projectSampleData';

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
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      console.log('🔥 STARTING PROJECT FETCH');
      console.log('🔥 Supabase URL:', supabase.supabaseUrl);
      console.log('🔥 Supabase Key:', supabase.supabaseKey?.substring(0, 20) + '...');
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('🔥 Database error, falling back to sample data:', error);
          const sampleProjects = getAllProjects();
          console.log('🔥 Using sample projects:', sampleProjects);
          return sampleProjects;
        }

        // If no data in database, use sample data
        if (!data || data.length === 0) {
          console.log('🔥 No projects in database, using sample data');
          const sampleProjects = getAllProjects();
          console.log('🔥 Sample projects loaded:', sampleProjects);
          return sampleProjects;
        }

        console.log('🔥 SUCCESS - Projects data from database:', data);
        return data;
      } catch (err) {
        console.warn('🔥 Fetch failed, falling back to sample data:', err);
        const sampleProjects = getAllProjects();
        console.log('🔥 Fallback sample projects:', sampleProjects);
        return sampleProjects;
      }
    },
    retry: 1,
    staleTime: 0,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating project:', projectData);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      console.log('Project created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

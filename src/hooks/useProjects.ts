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
      console.log('Loading projects for demo...');
      
      // For demo purposes, prioritize sample data
      const sampleData = getAllProjects();
      if (sampleData && sampleData.length > 0) {
        console.log('Using comprehensive sample data:', sampleData);
        return sampleData;
      }
      
      // Fallback to Supabase if sample data is not available
      console.log('Fetching projects from Supabase...');
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        // Return sample data as fallback even on error
        return getAllProjects();
      }

      console.log('Raw projects data from database:', data);
      
      // If no data from database, seed with sample data
      if (!data || data.length === 0) {
        console.log('No projects found, using sample data...');
        return getAllProjects();
      }

      return data || getAllProjects();
    },
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

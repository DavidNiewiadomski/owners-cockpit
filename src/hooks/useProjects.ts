
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Sample projects for demo purposes
const sampleProjects: Project[] = [
  {
    id: 'sample-1',
    name: 'Downtown Office Complex',
    description: 'Modern 15-story office building with retail space',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-12-15',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sample-2',
    name: 'Residential Tower Phase 2',
    description: '42-unit luxury residential development',
    status: 'planning',
    start_date: '2024-03-01',
    end_date: '2025-08-30',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'sample-3',
    name: 'Shopping Center Renovation',
    description: 'Complete renovation of existing retail space',
    status: 'on_hold',
    start_date: '2024-02-01',
    end_date: '2024-10-15',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      console.log('Fetching projects from Supabase...');
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          console.log('Falling back to sample projects');
          return sampleProjects;
        }

        if (!data || data.length === 0) {
          console.log('No projects found in database, returning sample projects');
          return sampleProjects;
        }

        console.log('Projects fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Database connection error:', error);
        console.log('Returning sample projects as fallback');
        return sampleProjects;
      }
    },
  });
}

export function useCreateProject() {
  return async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
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

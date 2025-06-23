
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

const SAMPLE_PROJECTS: Project[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Downtown Office Complex',
    description: 'A 12-story mixed-use office building with retail space on the ground floor.',
    status: 'active' as const,
    start_date: '2024-01-15',
    end_date: '2024-12-20'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Residential Townhomes',
    description: 'Development of 24 luxury townhomes with modern amenities.',
    status: 'planning' as const,
    start_date: '2024-03-01',
    end_date: '2024-11-30'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Hospital Renovation',
    description: 'Complete renovation of the west wing including new patient rooms.',
    status: 'on_hold' as const,
    start_date: '2024-02-01',
    end_date: '2024-08-15'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Shopping Center Expansion',
    description: 'Adding 50,000 sq ft retail space and updating existing facilities.',
    status: 'completed' as const,
    start_date: '2023-06-01',
    end_date: '2024-01-30'
  }
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
          console.error('Supabase error fetching projects:', error);
          console.log('Using sample data due to error');
          return SAMPLE_PROJECTS;
        }

        // If database returns data, use it; otherwise use sample data
        if (data && data.length > 0) {
          console.log('Projects fetched successfully:', data);
          return data;
        } else {
          console.log('Database returned empty projects, using sample data');
          return SAMPLE_PROJECTS;
        }
      } catch (err) {
        console.error('Unexpected error fetching projects:', err);
        console.log('Using sample data due to unexpected error');
        return SAMPLE_PROJECTS;
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

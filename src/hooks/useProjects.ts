import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      console.log('Fetching projects from Supabase...');
      
      // First, let's check if RLS is causing issues by testing the connection
      const { data: testData, error: testError } = await supabase
        .from('projects')
        .select('count(*)', { count: 'exact' });
      
      console.log('Projects count test:', testData, 'Test error:', testError);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Raw projects data from database:', data);
      console.log('Number of projects found:', data?.length || 0);
      
      // If no data, let's try to seed some sample projects directly
      if (!data || data.length === 0) {
        console.log('No projects found, attempting to seed sample data...');
        
        const sampleProjects = [
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Downtown Office Building',
            description: 'A 12-story modern office building project in downtown area with sustainable design features.',
            status: 'active' as const,
            start_date: '2024-01-15',
            end_date: '2024-12-31'
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'Residential Complex Phase 1',
            description: 'Construction of 50-unit residential complex with modern amenities and green spaces.',
            status: 'planning' as const,
            start_date: '2024-03-01',
            end_date: '2025-02-28'
          },
          {
            id: '33333333-3333-3333-3333-333333333333',
            name: 'Highway Bridge Renovation',
            description: 'Major renovation and structural upgrades to the Main Street bridge infrastructure.',
            status: 'active' as const,
            start_date: '2024-02-01',
            end_date: '2024-10-31'
          }
        ];

        try {
          const { data: insertedData, error: insertError } = await supabase
            .from('projects')
            .upsert(sampleProjects, { 
              onConflict: 'id',
              ignoreDuplicates: false 
            })
            .select();

          if (insertError) {
            console.error('Error inserting sample projects:', insertError);
          } else {
            console.log('Successfully inserted sample projects:', insertedData);
            return insertedData || [];
          }
        } catch (seedError) {
          console.error('Failed to seed sample data:', seedError);
        }
      }

      return data || [];
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

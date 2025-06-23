
import { useQuery } from '@tanstack/react-query';

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
      console.log('Returning mock projects for demo');
      
      // Return mock projects for demo purposes
      const mockProjects: Project[] = [
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          name: 'Downtown Office Building',
          description: 'Modern 15-story office complex with retail space',
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-12-15',
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          name: 'Residential Complex Phase 1',
          description: '120-unit residential development',
          status: 'planning',
          start_date: '2024-03-01',
          end_date: '2025-06-30',
          created_at: '2024-02-01T00:00:00Z'
        },
        {
          id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
          name: 'Industrial Warehouse',
          description: '50,000 sq ft distribution center',
          status: 'active',
          start_date: '2024-02-01',
          end_date: '2024-08-30',
          created_at: '2024-01-20T00:00:00Z'
        }
      ];

      return mockProjects;
    },
  });
}

export function useCreateProject() {
  return async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('Creating project (mock):', projectData);
    
    // Return mock created project
    const mockProject: Project = {
      id: `mock-${Date.now()}`,
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Project created (mock):', mockProject);
    return mockProject;
  };
}

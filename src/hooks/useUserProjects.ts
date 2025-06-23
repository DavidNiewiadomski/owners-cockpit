
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
      console.log('Returning mock user projects for demo');
      
      // Return mock user projects for demo purposes
      const mockUserProjects: UserProject[] = [
        {
          id: 'up1',
          user_id: 'mock-user',
          project_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          role: 'owner',
          created_at: '2024-01-15T00:00:00Z',
          project: {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            name: 'Downtown Office Building',
            description: 'Modern 15-story office complex with retail space',
            status: 'active',
            start_date: '2024-01-15',
            end_date: '2024-12-15'
          }
        },
        {
          id: 'up2',
          user_id: 'mock-user',
          project_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          role: 'member',
          created_at: '2024-02-01T00:00:00Z',
          project: {
            id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            name: 'Residential Complex Phase 1',
            description: '120-unit residential development',
            status: 'planning',
            start_date: '2024-03-01',
            end_date: '2025-06-30'
          }
        },
        {
          id: 'up3',
          user_id: 'mock-user',
          project_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
          role: 'member',
          created_at: '2024-01-20T00:00:00Z',
          project: {
            id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            name: 'Industrial Warehouse',
            description: '50,000 sq ft distribution center',
            status: 'active',
            start_date: '2024-02-01',
            end_date: '2024-08-30'
          }
        }
      ];

      return mockUserProjects;
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
      console.log('Granting project access (mock):', { projectId, userId, role });
      
      // Return mock data
      return {
        id: `mock-${Date.now()}`,
        user_id: userId || 'mock-user',
        project_id: projectId,
        role,
        created_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}


import { useQuery } from '@tanstack/react-query';
import { Task, TasksResponse } from '@/types/tasks';

interface UseTasksOptions {
  projectId: string;
  limit?: number;
}

export function useTasks({ projectId, limit = 10 }: UseTasksOptions) {
  return useQuery({
    queryKey: ['tasks', projectId, limit],
    queryFn: async (): Promise<TasksResponse> => {
      // Mock data for now - in real app this would call the API
      const mockTasks: Task[] = [
        {
          id: '1',
          name: 'Foundation Work',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-15'),
          progress: 85,
          priority: 'high',
          assignee: 'John Smith',
          projectId,
          isLate: false,
        },
        {
          id: '2',
          name: 'Framing Phase',
          startDate: new Date('2024-02-10'),
          endDate: new Date('2024-03-10'),
          progress: 45,
          priority: 'medium',
          assignee: 'Mike Johnson',
          projectId,
          isLate: true,
        },
        {
          id: '3',
          name: 'Electrical Installation',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-03-25'),
          progress: 20,
          priority: 'medium',
          assignee: 'Sarah Wilson',
          projectId,
          isLate: false,
        },
        {
          id: '4',
          name: 'Plumbing Work',
          startDate: new Date('2024-03-05'),
          endDate: new Date('2024-04-01'),
          progress: 10,
          priority: 'low',
          assignee: 'David Brown',
          projectId,
          isLate: true,
        },
        {
          id: '5',
          name: 'Interior Finishing',
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-05-15'),
          progress: 0,
          priority: 'medium',
          assignee: 'Lisa Davis',
          projectId,
          isLate: false,
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        tasks: mockTasks.slice(0, limit),
        totalCount: mockTasks.length,
      };
    },
    enabled: !!projectId,
  });
}

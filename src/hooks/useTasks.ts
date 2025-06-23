
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  priority: number;
  assigned_to?: string;
  due_date?: string;
  project_id: string;
  created_at?: string;
  updated_at?: string;
  // Add frontend properties for compatibility
  startDate: Date;
  endDate: Date;
  completedDate?: Date;
  progress: number; // 0-100
  projectId: string;
  dependencies?: string[];
  isLate?: boolean;
}

interface UseTasksOptions {
  projectId: string;
  limit?: number;
}

export function useTasks({ projectId, limit = 10 }: UseTasksOptions) {
  return useQuery({
    queryKey: ['tasks', projectId, limit],
    queryFn: async (): Promise<{ tasks: Task[]; totalCount: number }> => {
      console.log('Fetching tasks for project:', projectId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching tasks:', error);
        // Return sample data for demo if there's an error
        const sampleTasks = [
          {
            id: '55555555-5555-5555-5555-555555555555',
            name: 'Foundation and Excavation',
            description: 'Complete site excavation and pour concrete foundation for the building structure.',
            status: 'completed' as const,
            priority: 3,
            assigned_to: 'Mike Construction Crew',
            due_date: '2024-02-28',
            project_id: projectId,
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-02-28'),
            completedDate: new Date('2024-02-25'),
            progress: 100,
            projectId: projectId,
            isLate: false
          },
          {
            id: '66666666-6666-6666-6666-666666666666',
            name: 'Steel Frame Installation',
            description: 'Install structural steel framework for floors 1-6. Coordinate with crane operations.',
            status: 'in_progress' as const,
            priority: 3,
            assigned_to: 'Steel Works Inc',
            due_date: '2024-04-15',
            project_id: projectId,
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-04-15'),
            progress: 65,
            projectId: projectId,
            isLate: false
          },
          {
            id: '77777777-7777-7777-7777-777777777777',
            name: 'Electrical Rough-in',
            description: 'Install electrical conduits, wiring, and panel boxes for floors 1-3.',
            status: 'not_started' as const,
            priority: 2,
            assigned_to: 'ABC Electrical',
            due_date: '2024-05-20',
            project_id: projectId,
            startDate: new Date('2024-04-20'),
            endDate: new Date('2024-05-20'),
            progress: 0,
            projectId: projectId,
            isLate: false
          },
          {
            id: '88888888-8888-8888-8888-888888888888',
            name: 'HVAC System Installation',
            description: 'Install heating, ventilation, and air conditioning systems for the entire building.',
            status: 'not_started' as const,
            priority: 2,
            assigned_to: 'Climate Solutions LLC',
            due_date: '2024-06-10',
            project_id: projectId,
            startDate: new Date('2024-05-25'),
            endDate: new Date('2024-06-10'),
            progress: 0,
            projectId: projectId,
            isLate: false
          },
          {
            id: '99999999-9999-9999-9999-999999999999',
            name: 'Interior Finishing',
            description: 'Complete drywall, painting, flooring, and final interior work for all floors.',
            status: 'not_started' as const,
            priority: 1,
            assigned_to: 'Interior Design Pro',
            due_date: '2024-09-30',
            project_id: projectId,
            startDate: new Date('2024-08-01'),
            endDate: new Date('2024-09-30'),
            progress: 0,
            projectId: projectId,
            isLate: false
          }
        ];

        return {
          tasks: sampleTasks.slice(0, limit),
          totalCount: sampleTasks.length
        };
      }

      // Transform database tasks to match frontend interface
      const transformedTasks = (data || []).map(task => {
        const startDate = task.created_at ? new Date(task.created_at) : new Date();
        const endDate = task.due_date ? new Date(task.due_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        
        // Calculate progress based on status
        let progress = 0;
        if (task.status === 'completed') progress = 100;
        else if (task.status === 'in_progress') progress = 50;
        else if (task.status === 'blocked') progress = 25;
        
        // Check if task is late
        const isLate = task.status !== 'completed' && endDate < new Date();
        
        return {
          ...task,
          startDate,
          endDate,
          progress,
          projectId: task.project_id,
          isLate,
          completedDate: task.status === 'completed' ? endDate : undefined
        };
      });

      console.log('Tasks fetched successfully:', transformedTasks);
      return {
        tasks: transformedTasks,
        totalCount: transformedTasks.length
      };
    },
    enabled: !!projectId,
  });
}

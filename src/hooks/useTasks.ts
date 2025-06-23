
import { useQuery } from '@tanstack/react-query';
import { Task, TasksResponse } from '@/types/tasks';
import { supabase } from '@/integrations/supabase/client';

interface UseTasksOptions {
  projectId: string;
  limit?: number;
}

export function useTasks({ projectId, limit = 10 }: UseTasksOptions) {
  return useQuery({
    queryKey: ['tasks', projectId, limit],
    queryFn: async (): Promise<TasksResponse> => {
      console.log(`Fetching tasks for project ${projectId} from Supabase...`);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      // Transform the data to match the expected Task interface
      const tasks: Task[] = (data || []).map(task => ({
        id: task.id,
        name: task.name,
        startDate: task.created_at ? new Date(task.created_at) : new Date(),
        endDate: task.due_date ? new Date(task.due_date) : new Date(),
        progress: 0, // This would need to be calculated or stored separately
        priority: task.priority === 1 ? 'low' : task.priority === 2 ? 'medium' : 'high',
        assignee: task.assigned_to || 'Unassigned',
        projectId: task.project_id,
        isLate: task.due_date ? new Date(task.due_date) < new Date() : false,
      }));

      console.log(`Returning ${tasks.length} tasks for project ${projectId}`);

      return {
        tasks,
        totalCount: tasks.length,
      };
    },
    enabled: !!projectId,
  });
}

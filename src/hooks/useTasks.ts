
import { useQuery } from '@tanstack/react-query';
import type { Task, TasksResponse } from '@/types/tasks';
import { supabase } from '@/integrations/supabase/client';

interface UseTasksOptions {
  projectId: string;
  limit?: number;
  enabled?: boolean;
}

export function useTasks({ projectId, limit = 10, enabled = true }: UseTasksOptions) {
  return useQuery({
    queryKey: ['tasks', projectId, limit],
    queryFn: async (): Promise<TasksResponse> => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      console.log(`Fetching tasks for project ${projectId} from Supabase...`);
      
      const { data, error, count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching tasks:', error);
        throw new Error(`Failed to fetch tasks: ${error.message}`);
      }

      // Transform the data to match the expected Task interface with better error handling
      const tasks: Task[] = (data || []).map(task => {
        try {
          return {
            id: task.id,
            name: task.name || 'Untitled Task',
            startDate: task.created_at ? new Date(task.created_at) : new Date(),
            endDate: task.due_date ? new Date(task.due_date) : new Date(),
            progress: 0, // This would need to be calculated or stored separately
            priority: task.priority === 1 ? 'low' : task.priority === 2 ? 'medium' : 'high',
            assignee: task.assigned_to || 'Unassigned',
            projectId: task.project_id,
            isLate: task.due_date ? new Date(task.due_date) < new Date() : false,
          };
        } catch (transformError) {
          console.warn('Error transforming task:', task, transformError);
          // Return a fallback task object
          return {
            id: task.id || 'unknown',
            name: 'Error loading task',
            startDate: new Date(),
            endDate: new Date(),
            progress: 0,
            priority: 'low' as const,
            assignee: 'Unknown',
            projectId: projectId,
            isLate: false,
          };
        }
      });

      console.log(`Returning ${tasks.length} tasks for project ${projectId}`);

      return {
        tasks,
        totalCount: count || tasks.length,
      };
    },
    enabled: enabled && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}

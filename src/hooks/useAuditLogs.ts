
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_id: string | null;
  project_id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  old_values: unknown;
  new_values: unknown;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface UseAuditLogsOptions {
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
  enabled?: boolean;
  limit?: number;
}

export function useAuditLogs({
  projectId,
  dateFrom,
  dateTo,
  enabled = true,
  limit = 100
}: UseAuditLogsOptions) {
  return useQuery({
    queryKey: ['audit-logs', projectId, dateFrom, dateTo, limit],
    queryFn: async (): Promise<AuditLog[]> => {
      if (!projectId) {
        throw new Error('Project ID is required for audit logs');
      }

      console.log('Fetching audit logs for project:', projectId);
      
      let query = supabase
        .from('audit_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw new Error(`Failed to fetch audit logs: ${error.message}`);
      }

      console.log('Audit logs fetched:', data?.length || 0);
      
      // Transform the data to match our interface, handling the ip_address type safely
      const transformedData: AuditLog[] = (data || []).map(log => {
        try {
          return {
            ...log,
            ip_address: log.ip_address ? String(log.ip_address) : null
          };
        } catch (transformError) {
          console.warn('Error transforming audit log:', log, transformError);
          // Return a fallback log entry
          return {
            id: log.id || 'unknown',
            user_id: log.user_id || null,
            project_id: projectId,
            action: log.action || 'unknown',
            table_name: log.table_name || 'unknown',
            record_id: log.record_id || null,
            old_values: log.old_values || {},
            new_values: log.new_values || {},
            ip_address: null,
            user_agent: log.user_agent || null,
            created_at: log.created_at || new Date().toISOString(),
          };
        }
      });
      
      return transformedData;
    },
    enabled: enabled && !!projectId,
    staleTime: 30 * 1000, // 30 seconds for audit logs (more real-time)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on permission errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: true, // Audit logs should be fresh
  });
}

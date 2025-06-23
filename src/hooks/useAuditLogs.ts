
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_id: string | null;
  project_id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function useAuditLogs(projectId?: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['audit-logs', projectId, dateFrom, dateTo],
    queryFn: async (): Promise<AuditLog[]> => {
      console.log('Fetching audit logs for project:', projectId);
      
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }

      console.log('Audit logs fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!projectId,
  });
}

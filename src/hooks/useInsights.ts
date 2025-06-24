
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export interface Insight {
  id: string;
  project_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  summary: string;
  context_data: any;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useInsights(projectId?: string) {
  return useQuery({
    queryKey: ['insights', projectId],
    queryFn: async (): Promise<Insight[]> => {
      let query = supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching insights:', error);
        throw error;
      }

      return data || [];
    },
  });
}

export function useUnreadInsights(projectId?: string) {
  return useQuery({
    queryKey: ['insights', 'unread', projectId],
    queryFn: async (): Promise<Insight[]> => {
      let query = supabase
        .from('insights')
        .select('*')
        .is('read_at', null)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching unread insights:', error);
        throw error;
      }

      return data || [];
    },
  });
}

export function useMarkInsightRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (insightId: string) => {
      const { error } = await supabase
        .from('insights')
        .update({ read_at: new Date().toISOString() })
        .eq('id', insightId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}

export function useInsightRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('insights-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'insights'
        },
        (payload) => {
          const newInsight = payload.new as Insight;
          
          // Show toast notification for new insights
          const severityEmoji = {
            low: '📘',
            medium: '📙',
            high: '📕',
            critical: '🚨'
          };

          toast(
            `${severityEmoji[newInsight.severity]} ${newInsight.title}`,
            {
              description: newInsight.summary,
              action: {
                label: 'View',
                onClick: () => {
                  // This will be handled by the insights drawer
                  window.dispatchEvent(new CustomEvent('openInsightsDrawer', { 
                    detail: { insightId: newInsight.id } 
                  }));
                }
              },
              duration: newInsight.severity === 'critical' ? 10000 : 5000,
            }
          );

          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['insights'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

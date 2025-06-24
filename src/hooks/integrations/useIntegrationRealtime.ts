
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useIntegrationRealtime(projectId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId || projectId === 'project-1') return;

    const channel = supabase
      .channel('project-integrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_integrations',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Integration change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['project-integrations', projectId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);
}

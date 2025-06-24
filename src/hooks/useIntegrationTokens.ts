
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface IntegrationToken {
  id: string;
  user_id: string;
  project_id: string;
  provider: 'teams' | 'outlook' | 'zoom' | 'google_meet';
  access_token: string;
  refresh_token?: string;
  token_data: any;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export function useIntegrationTokens(projectId: string) {
  return useQuery({
    queryKey: ['integration-tokens', projectId],
    queryFn: async (): Promise<IntegrationToken[]> => {
      console.log('🔍 Fetching integration tokens for project:', projectId);
      
      const { data, error } = await supabase
        .from('integration_tokens')
        .select('*')
        .eq('project_id', projectId);

      if (error) {
        console.error('❌ Error fetching integration tokens:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} integration tokens:`, data);
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        token_data: item.token_data || {}
      })) as IntegrationToken[];
    },
    enabled: !!projectId,
  });
}

export function useCreateIntegrationToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: Omit<IntegrationToken, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('📝 Creating integration token for provider:', token.provider);

      const { data, error } = await supabase
        .from('integration_tokens')
        .insert(token)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating integration token:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Integration token created:', data.provider);
      queryClient.invalidateQueries({ queryKey: ['integration-tokens', data.project_id] });
    },
  });
}

export function useUpdateIntegrationToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<IntegrationToken> }) => {
      console.log('📝 Updating integration token:', id);

      const { data, error } = await supabase
        .from('integration_tokens')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating integration token:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Integration token updated:', data.id);
      queryClient.invalidateQueries({ queryKey: ['integration-tokens', data.project_id] });
    },
  });
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Communication {
  id: string;
  project_id: string;
  provider: 'teams' | 'outlook' | 'zoom' | 'google_meet' | 'manual';
  comm_type: 'email' | 'chat_message' | 'meeting_recording' | 'meeting_transcript' | 'channel_message';
  subject?: string;
  body?: string;
  speaker: {
    id?: string;
    name?: string;
    email?: string;
  };
  message_ts: string;
  url?: string;
  participants: string[];
  thread_id?: string;
  external_id: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export function useCommunications(projectId: string) {
  return useQuery({
    queryKey: ['communications', projectId],
    queryFn: async (): Promise<Communication[]> => {
      console.log('🔍 Fetching communications for project:', projectId);
      
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('project_id', projectId)
        .order('message_ts', { ascending: false });

      if (error) {
        console.error('❌ Error fetching communications:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} communications:`, data);
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        speaker: item.speaker || {},
        participants: Array.isArray(item.participants) ? item.participants : [],
        metadata: item.metadata || {}
      })) as Communication[];
    },
    enabled: !!projectId,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
}

export function useCreateCommunication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (communication: Omit<Communication, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('📝 Creating communication:', communication);

      const { data, error } = await supabase
        .from('communications')
        .insert(communication)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating communication:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Communication created:', data);
      queryClient.invalidateQueries({ queryKey: ['communications', data.project_id] });
    },
  });
}

export function useSearchCommunications() {
  return useMutation({
    mutationFn: async ({ 
      query, 
      projectId, 
      limit = 10 
    }: { 
      query: string; 
      projectId: string; 
      limit?: number;
    }) => {
      console.log('🔍 Searching communications:', { query, projectId });

      // First, generate embedding for the query
      const embeddingResponse = await fetch('/api/generate-embedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query })
      });

      if (!embeddingResponse.ok) {
        throw new Error('Failed to generate embedding');
      }

      const { embedding } = await embeddingResponse.json();

      // Use the search function
      const { data, error } = await supabase
        .rpc('search_communications', {
          query_embedding: embedding,
          project_uuid: projectId,
          match_count: limit,
          similarity_threshold: 0.7
        });

      if (error) {
        console.error('❌ Error searching communications:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} matching communications:`, data);
      return data || [];
    },
  });
}

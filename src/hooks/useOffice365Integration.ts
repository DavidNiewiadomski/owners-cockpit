
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Office365Token {
  id: string;
  user_id: string;
  project_id: string;
  provider: 'outlook' | 'teams';
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  token_data: any;
  created_at: string;
  updated_at: string;
}

export function useOffice365Tokens(projectId: string) {
  return useQuery({
    queryKey: ['office365-tokens', projectId],
    queryFn: async (): Promise<Office365Token[]> => {
      console.log('🔍 Fetching Office 365 tokens for project:', projectId);
      
      const { data, error } = await supabase
        .from('integration_tokens')
        .select('*')
        .eq('project_id', projectId)
        .in('provider', ['outlook', 'teams']);

      if (error) {
        console.error('❌ Error fetching Office 365 tokens:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} Office 365 tokens:`, data);
      // Type cast the data to ensure provider matches our union type
      return (data || []).map(token => ({
        ...token,
        provider: token.provider as 'outlook' | 'teams'
      }));
    },
    enabled: !!projectId,
  });
}

export function useStartOffice365Auth() {
  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      console.log('🔐 Starting Office 365 OAuth for project:', projectId);

      const { data, error } = await supabase.functions.invoke('office365-auth', {
        method: 'GET',
        body: { project_id: projectId }
      });

      if (error) {
        console.error('❌ Error starting OAuth:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('✅ OAuth URL generated:', data.auth_url);
      // Redirect to Microsoft OAuth
      window.location.href = data.auth_url;
    },
    onError: (error) => {
      console.error('Failed to start Office 365 OAuth:', error);
      toast.error('Failed to start Office 365 authentication');
    },
  });
}

export function useDraftReply() {
  return useMutation({
    mutationFn: async ({ 
      threadId, 
      prompt, 
      projectId, 
      userId 
    }: { 
      threadId: string; 
      prompt: string; 
      projectId: string; 
      userId: string; 
    }) => {
      console.log('✍️ Drafting reply for thread:', threadId);

      const { data, error } = await supabase.functions.invoke('draft-reply', {
        body: {
          thread_id: threadId,
          prompt,
          project_id: projectId,
          user_id: userId
        }
      });

      if (error) {
        console.error('❌ Error drafting reply:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Reply drafted successfully');
      toast.success('Reply drafted successfully');
    },
    onError: (error) => {
      console.error('Failed to draft reply:', error);
      toast.error('Failed to draft reply');
    },
  });
}

export function useSendReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      messageId, 
      replyBody, 
      projectId, 
      userId 
    }: { 
      messageId: string; 
      replyBody: string; 
      projectId: string; 
      userId: string; 
    }) => {
      console.log('📤 Sending reply to message:', messageId);

      const { data, error } = await supabase.functions.invoke('send-reply', {
        body: {
          message_id: messageId,
          reply_body: replyBody,
          project_id: projectId,
          user_id: userId
        }
      });

      if (error) {
        console.error('❌ Error sending reply:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      console.log('✅ Reply sent successfully');
      toast.success('Reply sent successfully');
      queryClient.invalidateQueries({ queryKey: ['communications'] });
    },
    onError: (error) => {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply');
    },
  });
}

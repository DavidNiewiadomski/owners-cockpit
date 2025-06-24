
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AIAction {
  type: 'summarize' | 'reply' | 'analyze' | 'extract';
  prompt?: string;
  communicationId: string;
  projectId: string;
}

export function useAICommunications() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processWithAI = useMutation({
    mutationFn: async ({ type, prompt, communicationId, projectId }: AIAction) => {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('ai-communication-processor', {
        body: {
          action: type,
          prompt: prompt || getDefaultPrompt(type),
          communication_id: communicationId,
          project_id: projectId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "AI Processing Complete",
        description: `Successfully ${variables.type}d the communication.`,
      });
    },
    onError: (error) => {
      console.error('AI processing error:', error);
      toast({
        title: "AI Processing Failed",
        description: "Failed to process communication with AI.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const generateSmartReply = useMutation({
    mutationFn: async ({ communicationId, prompt, projectId }: { 
      communicationId: string; 
      prompt: string; 
      projectId: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke('draft-reply', {
        body: {
          thread_id: communicationId,
          prompt,
          project_id: projectId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error('Smart reply error:', error);
      toast({
        title: "Smart Reply Failed",
        description: "Failed to generate smart reply.",
        variant: "destructive",
      });
    }
  });

  return {
    processWithAI,
    generateSmartReply,
    isProcessing: isProcessing || processWithAI.isPending || generateSmartReply.isPending
  };
}

function getDefaultPrompt(type: string): string {
  switch (type) {
    case 'summarize':
      return 'Provide a concise summary of this communication, highlighting key points, decisions, and action items.';
    case 'analyze':
      return 'Analyze the sentiment and tone of this communication. Identify any urgent matters or concerns.';
    case 'reply':
      return 'Draft a professional and appropriate reply to this communication.';
    case 'extract':
      return 'Extract important dates, names, tasks, and commitments from this communication.';
    default:
      return 'Process this communication and provide relevant insights.';
  }
}

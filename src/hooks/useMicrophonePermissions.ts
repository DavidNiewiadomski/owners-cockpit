
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useMicrophonePermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setHasPermission(false);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    hasPermission,
    checkMicrophonePermission,
    setHasPermission
  };
};

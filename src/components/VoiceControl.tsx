
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useMicrophonePermissions } from '@/hooks/useMicrophonePermissions';
import VoiceButton from '@/components/voice/VoiceButton';
import VoiceStatusBadges from '@/components/voice/VoiceStatusBadges';
import TranscriptDisplay from '@/components/voice/TranscriptDisplay';
import VoiceOutputToggle from '@/components/voice/VoiceOutputToggle';

interface VoiceControlProps {
  onSendMessage?: (message: string) => void;
  onVoiceResponse?: (text: string) => void;
  disabled?: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  onSendMessage,
  onVoiceResponse,
  disabled = false
}) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { toast } = useToast();
  
  const { hasPermission, checkMicrophonePermission } = useMicrophonePermissions();
  const { 
    isListening, 
    isProcessing, 
    transcript, 
    recognition, 
    startListening, 
    stopListening 
  } = useSpeechRecognition({ onSendMessage });

  const handleMicrophoneClick = useCallback(async () => {
    if (disabled) return;
    
    if (isListening) {
      stopListening();
      return;
    }

    // Check permissions first
    if (hasPermission === null) {
      const permitted = await checkMicrophonePermission();
      if (!permitted) return;
    }

    if (!recognition) {
      toast({
        title: "Voice Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    startListening();
  }, [disabled, isListening, recognition, hasPermission, checkMicrophonePermission, toast, stopListening, startListening]);

  const toggleVoiceResponse = useCallback(() => {
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled]);

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" disabled>
              <MicOff className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice features not supported in this browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2 relative">
      <VoiceButton 
        isListening={isListening}
        disabled={disabled}
        onClick={handleMicrophoneClick}
      />

      <VoiceOutputToggle 
        voiceEnabled={voiceEnabled}
        onToggle={toggleVoiceResponse}
      />

      <VoiceStatusBadges 
        isListening={isListening}
        isProcessing={isProcessing}
      />

      <TranscriptDisplay 
        transcript={transcript}
        isListening={isListening}
      />
    </div>
  );
};

export default VoiceControl;

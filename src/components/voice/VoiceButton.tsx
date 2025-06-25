
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  disabled: boolean;
  onClick: () => void;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ isListening, disabled, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isListening ? "destructive" : "ghost"}
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={`relative ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? (
              <Mic className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            {isListening && (
              <div className="absolute -inset-1 rounded-full bg-red-500/20 animate-ping" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Stop listening' : 'Start voice input'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceButton;

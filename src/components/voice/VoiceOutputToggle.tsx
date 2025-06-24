
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceOutputToggleProps {
  voiceEnabled: boolean;
  onToggle: () => void;
}

const VoiceOutputToggle: React.FC<VoiceOutputToggleProps> = ({ voiceEnabled, onToggle }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            {voiceEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceOutputToggle;

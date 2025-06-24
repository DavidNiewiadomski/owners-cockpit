
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VoiceStatusBadgesProps {
  isListening: boolean;
  isProcessing: boolean;
}

const VoiceStatusBadges: React.FC<VoiceStatusBadgesProps> = ({ isListening, isProcessing }) => {
  return (
    <div className="flex items-center gap-1">
      {isListening && (
        <Badge variant="destructive" className="text-xs">
          Listening
        </Badge>
      )}
      {isProcessing && (
        <Badge variant="secondary" className="text-xs">
          Processing
        </Badge>
      )}
    </div>
  );
};

export default VoiceStatusBadges;

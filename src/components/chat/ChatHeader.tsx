
import React from 'react';
import { Brain, RotateCcw, Volume2, VolumeX, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  roleConfig: {
    displayName: string;
    description: string;
  };
  agentMemory: {
    messageHistory: any[];
    persona: string;
  };
  isSpeaking: boolean;
  voiceResponseEnabled: boolean;
  ttsSupported: boolean;
  getBestVoice: () => string;
  messagesLength: number;
  isLoading: boolean;
  isStreaming: boolean;
  onRetry: () => void;
  onClear: () => void;
  onToggleVoice: () => void;
  onStopSpeaking: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  roleConfig,
  agentMemory,
  isSpeaking,
  voiceResponseEnabled,
  ttsSupported,
  getBestVoice,
  messagesLength,
  isLoading,
  isStreaming,
  onRetry,
  onClear,
  onToggleVoice,
  onStopSpeaking
}) => {
  return (
    <div className="border-b border-border/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {roleConfig.displayName} Mode
              </Badge>
              <span className="text-xs text-muted-foreground">
                {agentMemory.messageHistory.length} messages in context
              </span>
              {isSpeaking && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  Speaking...
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Stop Speaking Button - Only show when AI is speaking */}
          {isSpeaking && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onStopSpeaking}
              className="animate-pulse"
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
          )}
          
          {ttsSupported && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVoice}
              className={`text-muted-foreground hover:text-foreground ${voiceResponseEnabled ? 'text-primary' : ''}`}
            >
              {voiceResponseEnabled ? (
                <Volume2 className="w-4 h-4 mr-1" />
              ) : (
                <VolumeX className="w-4 h-4 mr-1" />
              )}
              Voice
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRetry}
            disabled={isLoading || isStreaming || messagesLength === 0}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Retry
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        </div>
      </div>
      
      {/* Role Context Banner */}
      <div className="mt-3 p-2 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Context:</strong> {agentMemory.persona}
          {voiceResponseEnabled && ttsSupported && (
            <span className="ml-2 text-primary">
              🔊 Voice: {getBestVoice()}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;


import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import VoiceControl from '@/components/VoiceControl';

interface ChatInputProps {
  roleConfig: {
    displayName: string;
  };
  isLoading: boolean;
  isStreaming: boolean;
  error: Error | null;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  roleConfig,
  isLoading,
  isStreaming,
  error,
  onSendMessage
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceMessage = useCallback((message: string) => {
    if (!message.trim()) return;
    onSendMessage(message);
  }, [onSendMessage]);

  return (
    <div className="border-t border-border/40 p-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask your ${roleConfig.displayName} assistant...`}
            className="bg-background/50 border-border/40 focus:border-primary/50 font-mono pr-20"
            disabled={isLoading || isStreaming}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <VoiceControl
              onSendMessage={handleVoiceMessage}
              disabled={isLoading || isStreaming}
            />
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading || isStreaming}
          className="neumorphic-button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      {error && (
        <p className="text-destructive text-sm mt-2">
          Error: {error.message}
        </p>
      )}
    </div>
  );
};

export default ChatInput;

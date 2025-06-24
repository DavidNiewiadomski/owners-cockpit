
import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Message, Citation } from '@/hooks/useChatRag';
import ChatMessage from './ChatMessage';
import WelcomeMessage from './WelcomeMessage';
import TypingIndicator from './TypingIndicator';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  roleConfig: {
    displayName: string;
    description: string;
  };
  currentRole: string;
  voiceResponseEnabled: boolean;
  ttsSupported: boolean;
  getBestVoice: () => string;
  onCitationClick: (citation: Citation, sourceId?: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isStreaming,
  roleConfig,
  currentRole,
  voiceResponseEnabled,
  ttsSupported,
  getBestVoice,
  onCitationClick
}) => {
  console.log('🟡 ChatMessages rendering with messages count:', messages.length);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <WelcomeMessage
          roleConfig={roleConfig}
          currentRole={currentRole}
          voiceResponseEnabled={voiceResponseEnabled}
          ttsSupported={ttsSupported}
          getBestVoice={getBestVoice}
        />
      )}

      <AnimatePresence>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onCitationClick={onCitationClick}
          />
        ))}
      </AnimatePresence>

      {(isLoading || isStreaming) && !messages.some(m => m.isStreaming) && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

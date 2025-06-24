
import React, { useState, useEffect, useCallback } from 'react';
import { Citation } from '@/hooks/useChatRag';
import { useChatRag } from '@/hooks/useChatRag';
import { useRole } from '@/contexts/RoleContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import SourceModal from '@/components/SourceModal';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

interface ChatWindowProps {
  projectId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ projectId }) => {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>(undefined);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [voiceResponseEnabled, setVoiceResponseEnabled] = useState(true);
  
  const { currentRole, getRoleConfig, getActiveAgentMemory } = useRole();
  const roleConfig = getRoleConfig(currentRole);
  const agentMemory = getActiveAgentMemory();
  
  const { speak, stop, isSpeaking, isSupported: ttsSupported, getBestVoice } = useTextToSpeech();
  
  const {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    clearConversation,
    resendLastMessage,
    error
  } = useChatRag({ projectId });

  // Speak AI responses when they arrive with more natural settings
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        !lastMessage.isStreaming && 
        voiceResponseEnabled &&
        ttsSupported) {
      // Small delay to ensure the message is fully rendered
      setTimeout(() => {
        speak(lastMessage.content, { 
          rate: 0.85, // Slower, more conversational pace
          pitch: 0.95, // Slightly lower pitch for warmth
          volume: 0.9 
        });
      }, 500);
    }
  }, [messages, speak, voiceResponseEnabled, ttsSupported]);

  const handleSendMessage = useCallback((content: string) => {
    // Stop any current speech when sending a new message
    if (isSpeaking) {
      stop();
    }
    
    sendMessage(content);
  }, [sendMessage, isSpeaking, stop]);

  const handleCitationClick = (citation: Citation, sourceId?: string) => {
    setSelectedCitation(citation);
    setSelectedSourceId(sourceId);
    setIsSourceModalOpen(true);
  };

  const toggleVoiceResponse = useCallback(() => {
    setVoiceResponseEnabled(!voiceResponseEnabled);
    if (isSpeaking && !voiceResponseEnabled) {
      stop();
    }
  }, [voiceResponseEnabled, isSpeaking, stop]);

  const handleStopSpeaking = useCallback(() => {
    stop();
  }, [stop]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        roleConfig={roleConfig}
        agentMemory={agentMemory}
        isSpeaking={isSpeaking}
        voiceResponseEnabled={voiceResponseEnabled}
        ttsSupported={ttsSupported}
        getBestVoice={getBestVoice}
        messagesLength={messages.length}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onRetry={resendLastMessage}
        onClear={clearConversation}
        onToggleVoice={toggleVoiceResponse}
        onStopSpeaking={handleStopSpeaking}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        roleConfig={roleConfig}
        currentRole={currentRole}
        voiceResponseEnabled={voiceResponseEnabled}
        ttsSupported={ttsSupported}
        getBestVoice={getBestVoice}
        onCitationClick={handleCitationClick}
      />

      <ChatInput
        roleConfig={roleConfig}
        isLoading={isLoading}
        isStreaming={isStreaming}
        error={error}
        onSendMessage={handleSendMessage}
      />

      <SourceModal
        citation={selectedCitation}
        sourceId={selectedSourceId}
        isOpen={isSourceModalOpen}
        onClose={() => {
          setIsSourceModalOpen(false);
          setSelectedCitation(null);
          setSelectedSourceId(undefined);
        }}
      />
    </div>
  );
};

export default ChatWindow;


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
  console.log('🟢 ChatWindow rendering with projectId:', projectId);
  
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

  console.log('🟢 ChatWindow state:', { 
    messagesCount: messages.length, 
    isLoading, 
    isStreaming, 
    currentRole,
    projectId,
    roleConfig: !!roleConfig,
    agentMemory: !!agentMemory 
  });

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
    console.log('🟢 ChatWindow handleSendMessage called with:', content);
    // Stop any current speech when sending a new message
    if (isSpeaking) {
      stop();
    }
    
    sendMessage(content);
  }, [sendMessage, isSpeaking, stop]);

  const handleCitationClick = (citation: Citation, sourceId?: string) => {
    console.log('🟢 ChatWindow handleCitationClick called');
    setSelectedCitation(citation);
    setSelectedSourceId(sourceId);
    setIsSourceModalOpen(true);
  };

  const toggleVoiceResponse = useCallback(() => {
    console.log('🟢 ChatWindow toggleVoiceResponse called');
    setVoiceResponseEnabled(!voiceResponseEnabled);
    if (isSpeaking && !voiceResponseEnabled) {
      stop();
    }
  }, [voiceResponseEnabled, isSpeaking, stop]);

  const handleStopSpeaking = useCallback(() => {
    console.log('🟢 ChatWindow handleStopSpeaking called');
    stop();
  }, [stop]);

  console.log('🟢 ChatWindow about to render JSX');

  // Simple fallback if role context is missing
  if (!roleConfig || !agentMemory) {
    console.log('🔴 ChatWindow: Missing roleConfig or agentMemory, using defaults');
    const defaultRoleConfig = {
      displayName: 'AI Assistant',
      description: 'General AI Assistant'
    };
    const defaultAgentMemory = {
      messageHistory: [],
      persona: 'I am a helpful AI assistant ready to answer your questions.'
    };
    
    return (
      <div className="flex flex-col h-full bg-background border border-border">
        <ChatHeader
          roleConfig={defaultRoleConfig}
          agentMemory={defaultAgentMemory}
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
          roleConfig={defaultRoleConfig}
          currentRole={currentRole}
          voiceResponseEnabled={voiceResponseEnabled}
          ttsSupported={ttsSupported}
          getBestVoice={getBestVoice}
          onCitationClick={handleCitationClick}
        />

        <ChatInput
          roleConfig={defaultRoleConfig}
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
  }

  return (
    <div className="flex flex-col h-full bg-background border border-border">
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

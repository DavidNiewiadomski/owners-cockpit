import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, RotateCcw } from 'lucide-react';
import { useChatRag, Citation } from '@/hooks/useChatRag';
import CitationChip from '@/components/CitationChip';
import SourceModal from '@/components/SourceModal';

interface ChatWindowProps {
  projectId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ projectId }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>(undefined);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    clearConversation,
    resendLastMessage,
    error
  } = useChatRag({ projectId });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;
    
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCitationClick = (citation: Citation, sourceId?: string) => {
    setSelectedCitation(citation);
    setSelectedSourceId(sourceId);
    setIsSourceModalOpen(true);
  };

  const renderTypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <Card className="p-3 neumorphic-card bg-muted/50">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resendLastMessage}
              disabled={isLoading || isStreaming || messages.length === 0}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Retry
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearConversation}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <Card className={`max-w-[80%] p-3 neumorphic-card ${
                message.role === 'user' 
                  ? 'bg-primary/10 ml-auto' 
                  : 'bg-muted/50'
              }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="mb-0 whitespace-pre-wrap font-mono text-sm">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-primary/60 ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
                
                {message.citations && message.citations.length > 0 && !message.isStreaming && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                    <div className="flex flex-wrap gap-1">
                      {message.citations.map((citation, index) => (
                        <CitationChip
                          key={citation.id}
                          citation={citation}
                          index={index}
                          onClick={handleCitationClick}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {(isLoading || isStreaming) && !messages.some(m => m.isStreaming) && renderTypingIndicator()}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border/40 p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your project..."
            className="flex-1 bg-background/50 border-border/40 focus:border-primary/50 font-mono"
            disabled={isLoading || isStreaming}
          />
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

      {/* Source Modal */}
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

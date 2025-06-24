
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import { Message, Citation } from '@/hooks/useChatRag';
import CitationChip from '@/components/CitationChip';

interface ChatMessageProps {
  message: Message;
  onCitationClick: (citation: Citation, sourceId?: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onCitationClick }) => {
  return (
    <motion.div
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
                  onClick={onCitationClick}
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
  );
};

export default ChatMessage;

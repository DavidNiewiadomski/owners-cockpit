import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Brain, Mic, MicOff, Volume2, VolumeX, Square, Settings, Zap } from 'lucide-react';
import { conversationalAI } from '@/services/conversationalAI';
import { elevenLabsVoiceService } from '@/services/elevenLabsVoice';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
  toolCalls?: any[];
  isVoiceInput?: boolean;
}

interface SimpleAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: any;
}

const SimpleAIChat: React.FC<SimpleAIChatProps> = ({ 
  projectId, 
  activeView, 
  contextData 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize AI services
  useEffect(() => {
    const initializeAI = async () => {
      try {
        // Get API keys from environment or use demo mode
        const apiKeys = {
          openai: import.meta.env.VITE_OPENAI_API_KEY,
          elevenlabs: import.meta.env.VITE_ELEVENLABS_API_KEY,
          gemini: import.meta.env.VITE_GEMINI_API_KEY
        };

        const initialized = await conversationalAI.initialize(apiKeys);
        setIsInitialized(initialized);
        
        if (initialized) {
          console.log('🤖 Advanced AI services initialized successfully');
        } else {
          console.log('📝 Running in demo mode - add API keys for full functionality');
        }
      } catch (error) {
        console.error('❌ Failed to initialize AI services:', error);
        setError('Failed to initialize AI services');
      }
    };

    initializeAI();

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-send voice input
        handleSendMessage(transcript, true);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setError('Voice recognition failed. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setError(null);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const handleSendMessage = async (content?: string, isVoice = false) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      isVoiceInput: isVoice,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Processing conversation with advanced AI...');
      
      const response = await conversationalAI.processConversation({
        message: messageContent,
        projectId,
        context: {
          activeView,
          contextData,
          timestamp: new Date().toISOString()
        },
        enableVoice: voiceEnabled && (isVoice || true), // Enable voice for all responses
        priority: 'normal'
      });

      if (response.success) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString(),
          audioUrl: response.audioUrl,
          toolCalls: response.toolCalls
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Auto-play voice response if available
        if (response.audioUrl && voiceEnabled) {
          try {
            await elevenLabsVoiceService.playAudio(response.audioUrl);
          } catch (audioError) {
            console.error('Audio playback failed:', audioError);
          }
        }

        console.log('✅ Conversation processed successfully:', {
          model: response.metadata.model,
          tokens: response.metadata.tokens,
          responseTime: response.metadata.responseTime,
          toolsUsed: response.metadata.toolsUsed
        });
      } else {
        throw new Error(response.error || 'Conversation processing failed');
      }

    } catch (err) {
      console.error('❌ Conversation processing failed:', err);
      setError(`AI processing failed: ${err.message || 'Unknown error'}`);
      
      // Fallback message
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble processing your request right now. This might be due to API connectivity issues. Please try again in a moment, or contact support if the problem persists.\n\nIn the meantime, I can still help you with general construction management questions!`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className={`flex items-start gap-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <Card className={`max-w-[85%] p-3 ${
        message.role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted/50'
      }`}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm whitespace-pre-wrap flex-1">{message.content}</p>
          {message.isVoiceInput && (
            <Badge variant="secondary" className="text-xs ml-2">
              <Mic className="w-3 h-3 mr-1" />
              Voice
            </Badge>
          )}
        </div>
        
        {/* Tool Calls Indicator */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.toolCalls.map((tool, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {tool.name.replace('get', '').replace('Construction', '').replace('Project', '')}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Audio Playback Button */}
        {message.audioUrl && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => elevenLabsVoiceService.playAudio(message.audioUrl!)}
              className="text-xs p-1 h-6"
            >
              <Volume2 className="w-3 h-3 mr-1" />
              Play Audio
            </Button>
          </div>
        )}
        
        <p className={`text-xs mt-2 opacity-70 ${
          message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </Card>
      
      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">AI Construction Assistant</h2>
            <div className="text-sm text-muted-foreground">
              <span><strong>Project:</strong> {projectId === 'portfolio' ? 'Portfolio View' : `Project ${projectId}`}</span>
              <span className="mx-2">•</span>
              <span>{activeView}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Advanced AI
            </Badge>
            <Badge variant={isInitialized ? "default" : "secondary"} className="text-xs">
              {isInitialized ? '🟢 Live' : '📝 Demo'}
            </Badge>
            <Badge variant={voiceEnabled ? "default" : "secondary"} className="text-xs">
              <Volume2 className="w-3 h-3 mr-1" />
              Voice {voiceEnabled ? 'On' : 'Off'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            {elevenLabsVoiceService.isPlaying() && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => elevenLabsVoiceService.stopAudio()}
                className="animate-pulse"
              >
                <Square className="w-3 h-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={voiceEnabled ? 'text-primary' : 'text-muted-foreground'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              👋 Hello! I'm your AI construction assistant. I can help you with project management, 
              schedules, budgets, safety, team coordination, and much more. 
              
              Try asking me about your project status, recent progress, or budget updates!
            </p>
          </Card>
        )}
        
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <Card className="p-3 bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-muted-foreground ml-2">AI is analyzing your request...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/40 p-4">
        <div className="flex gap-2">
          <Button
            variant={isListening ? "destructive" : "ghost"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            disabled={!recognitionRef.current || isLoading}
            className={isListening ? 'animate-pulse' : ''}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Ask about your project or request assistance..."}
            disabled={isLoading || isListening}
            className="flex-1"
          />
          
          <Button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim() || isListening}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💡 Try asking about schedules, budgets, safety, progress, or team coordination
        </p>
      </div>
    </div>
  );
};

export default SimpleAIChat;

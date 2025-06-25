import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Square,
  Brain,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoiceInput?: boolean;
}

interface SafeAdvancedAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: any;
}

const SafeAdvancedAIChat: React.FC<SafeAdvancedAIChatProps> = ({ 
  projectId, 
  activeView, 
  contextData 
}) => {
  console.log('🔵 SafeAdvancedAIChat render started');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Safe initialization
  useEffect(() => {
    console.log('🔵 SafeAdvancedAIChat useEffect running');
    
    try {
      // Check speech recognition support
      if (typeof window !== 'undefined') {
        const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        setSpeechSupported(hasRecognition);
        console.log('🔵 Speech Recognition supported:', hasRecognition);
        
        // Check text-to-speech support  
        const hasTTS = 'speechSynthesis' in window;
        setTtsSupported(hasTTS);
        console.log('🔵 Text-to-Speech supported:', hasTTS);
      }
    } catch (err) {
      console.error('❌ Error checking speech support:', err);
      setError('Error initializing speech features');
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    console.log('🔵 Sending message:', messageContent);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Simulated AI response for safety
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const demoResponse = `I understand you're asking about "${messageContent}". 

Based on your ${activeView} view for project ${projectId}, I can help with:
• Project status and progress tracking
• Budget and cost analysis
• Schedule management
• Safety monitoring
• Team communications
• Document management

This is a safe demo response. The full AI backend will be connected once all components are stable.`;
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: demoResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('❌ Error sending message:', err);
      setError(`Message failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, activeView, projectId]);

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
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

  console.log('🔵 SafeAdvancedAIChat render completing');

  return (
    <div className="flex flex-col h-full bg-background border border-border">
      {/* Header */}
      <div className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">AI Construction Assistant (Safe Mode)</h2>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <strong>Project:</strong>
                  <span>{projectId === 'portfolio' ? 'Portfolio View' : `Project ${projectId}`}</span>
                  <span className="mx-2">•</span>
                  <span>{activeView}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Safe Mode
          </Badge>
          <Badge variant={speechSupported ? "default" : "secondary"} className="text-xs">
            <Mic className="w-3 h-3 mr-1" />
            Speech {speechSupported ? 'Available' : 'Unavailable'}
          </Badge>
          <Badge variant={ttsSupported ? "default" : "secondary"} className="text-xs">
            <Volume2 className="w-3 h-3 mr-1" />
            TTS {ttsSupported ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              👋 Hello! I'm your AI construction assistant running in safe mode. 
              I can help with project management questions and provide intelligent responses
              based on your current context.
              
              Try asking me about schedules, budgets, safety, or project status.
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
                <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
              </div>
            </Card>
          </div>
        )}
        
        {error && (
          <Card className="p-3 bg-destructive/10 border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </Card>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/40 p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your project..."
            disabled={isLoading}
            className="flex-1"
          />
          
          <Button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          ⌨️ Enter to send • Safe mode with demo responses
        </p>
      </div>
    </div>
  );
};

export default SafeAdvancedAIChat;

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Brain,
  Zap,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoiceInput?: boolean;
  hasAudio?: boolean;
}

interface PremiumAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  projectContext?: {
    projectId: string;
    projectName: string;
    currentView: string;
  };
}

const PremiumAIChat: React.FC<PremiumAIChatProps> = ({
  isOpen,
  onClose,
  projectContext
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Hello! I'm Atlas, your AI construction assistant. ${projectContext ? `I can see you're working on ${projectContext.projectName} in the ${projectContext.currentView} view.` : ''} I can help you with project management, analytics, team coordination, and more. What would you like to know?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, projectContext, messages.length]);

  // Initialize speech recognition
  useEffect(() => {
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
      
      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        setError('Voice recognition failed. Please try again.');
        setTimeout(() => setError(null), 3000);
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

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setError(null);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = async (content?: string, isVoice = false) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      isVoiceInput: isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Simulate AI response with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate contextual response
      const response = generateAIResponse(messageContent, projectContext);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        hasAudio: voiceEnabled
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simulate voice response
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }

    } catch (err) {
      setError('Failed to get AI response. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string, context?: any): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Project-specific responses
    if (context?.projectName) {
      if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
        return `Based on the current data for ${context.projectName}, the project is tracking well within budget. The allocated budget shows 75% utilization with strong cost controls in place. Would you like me to break down specific cost categories or provide budget variance analysis?`;
      }
      
      if (lowerMessage.includes('schedule') || lowerMessage.includes('timeline')) {
        return `The ${context.projectName} timeline shows we're currently on track for the December deadline. Critical path activities are progressing well, with the foundation work completed ahead of schedule. The next major milestone is framing, scheduled to begin next week.`;
      }
      
      if (lowerMessage.includes('team') || lowerMessage.includes('staff')) {
        return `The project team for ${context.projectName} consists of 8 active members across different specialties. Team coordination is strong with daily standups and weekly progress reviews. Would you like to see team utilization rates or schedule a team meeting?`;
      }
    }

    // General construction responses
    if (lowerMessage.includes('safety') || lowerMessage.includes('risk')) {
      return `Safety is our top priority. Current safety metrics show zero incidents in the last 30 days across all active projects. All teams have completed recent safety training, and we maintain compliance with OSHA standards. Would you like to review the latest safety reports?`;
    }

    if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      return `I can generate comprehensive reports including project progress, budget analysis, team performance, and safety metrics. What type of report would you like me to prepare? I can create executive summaries, detailed project breakdowns, or custom analytics dashboards.`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I'm your comprehensive construction management assistant. I can help you with:
      
• Project monitoring and analytics
• Budget tracking and cost analysis  
• Schedule management and timeline optimization
• Team coordination and resource allocation
• Safety compliance and risk management
• Document management and reporting
• Communication with stakeholders

What specific area would you like assistance with?`;
    }

    // Default intelligent response
    return `I understand you're asking about "${userMessage}". As your AI construction assistant, I have access to real-time project data, team information, budgets, schedules, and safety metrics. I can provide detailed analysis, generate reports, coordinate communications, and help optimize project performance. Could you be more specific about what information or assistance you need?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl transition-all duration-300 ${isMinimized ? 'h-20' : 'h-[80vh]'} p-0`}>
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <div>
                <DialogTitle className="text-lg">Atlas - AI Construction Assistant</DialogTitle>
                {projectContext && (
                  <p className="text-sm text-muted-foreground">
                    {projectContext.projectName} • {projectContext.currentView}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={voiceEnabled ? "default" : "secondary"} className="text-xs">
                <Volume2 className="w-3 h-3 mr-1" />
                Voice {voiceEnabled ? 'On' : 'Off'}
              </Badge>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
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
                  
                  <Card className={`max-w-[85%] ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50'
                  }`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm whitespace-pre-wrap flex-1">{message.content}</p>
                        <div className="flex flex-col gap-1">
                          {message.isVoiceInput && (
                            <Badge variant="secondary" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice
                            </Badge>
                          )}
                          {message.hasAudio && (
                            <Badge variant="outline" className="text-xs">
                              <Volume2 className="w-3 h-3 mr-1" />
                              Audio
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-xs mt-2 opacity-70 ${
                        message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="text-sm text-muted-foreground ml-2">Atlas is thinking...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {error && (
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Button
                  variant={isListening ? "destructive" : "ghost"}
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  disabled={!recognitionRef.current || isLoading}
                  className={isListening ? 'animate-pulse' : ''}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={voiceEnabled ? 'text-primary' : 'text-muted-foreground'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Ask Atlas about your projects..."}
                  disabled={isLoading || isListening}
                  className="flex-1"
                />
                
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim() || isListening}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                💡 Atlas has access to your project data and can help with analytics, reports, and coordination
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumAIChat;

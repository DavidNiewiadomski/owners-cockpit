import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Brain, Zap, Eye } from 'lucide-react';
import { enterpriseAI } from '@/services/enterpriseAI';
import { useAppState } from '@/hooks/useAppState';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
  toolCalls?: any[];
  isVoiceInput?: boolean;
  dashboardContext?: any;
}

interface EnterpriseAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: any;
}

const EnterpriseAIChat: React.FC<EnterpriseAIChatProps> = ({ 
  projectId, 
  activeView, 
  contextData 
}) => {
  const { selectedProject } = useAppState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardContext, setDashboardContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Capture current dashboard context for AI visibility
  const captureDashboardContext = useCallback(() => {
    try {
      const context = {
        activeView,
        selectedProject,
        projectId,
        timestamp: new Date().toISOString(),
        // Capture visible dashboard elements
        visibleWidgets: document.querySelectorAll('[data-widget]').length,
        currentRoute: window.location.pathname,
        userRole: localStorage.getItem('userRole') || 'owner',
        // Add specific dashboard data based on current view
        dashboardData: {
          view: activeView,
          project: selectedProject,
          widgets: Array.from(document.querySelectorAll('[data-widget]')).map(el => ({
            type: el.getAttribute('data-widget'),
            visible: el.getBoundingClientRect().height > 0
          })),
          // Capture any data from context
          contextData: contextData
        }
      };
      
      setDashboardContext(context);
      return context;
    } catch (error) {
      console.error('Failed to capture dashboard context:', error);
      return { activeView, projectId, timestamp: new Date().toISOString() };
    }
  }, [activeView, selectedProject, projectId, contextData]);

  // Initialize speech recognition and capture initial context
  useEffect(() => {
    // Capture dashboard context on mount and view changes
    const context = captureDashboardContext();
    console.log('🎯 Dashboard context captured:', context);

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
        // Auto-send voice input with current dashboard context
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

    // Add welcome message with context awareness
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Hello! I'm Atlas, your AI construction assistant. I can see you're currently viewing the ${activeView} for ${projectId === 'portfolio' ? 'your portfolio' : `Project ${projectId}`}. I have full visibility into your dashboard and can help you with anything you see here, plus access real-time project data. What would you like to know?`,
        timestamp: new Date().toISOString(),
        dashboardContext: context
      };
      setMessages([welcomeMessage]);
    }
  }, [activeView, projectId, captureDashboardContext]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setError(null);
      // Capture fresh context before voice input
      captureDashboardContext();
      recognitionRef.current.start();
    }
  }, [isListening, captureDashboardContext]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const handleSendMessage = async (content?: string, isVoice = false) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    // Capture current dashboard context for this message
    const currentContext = captureDashboardContext();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      isVoiceInput: isVoice,
      dashboardContext: currentContext
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Processing with Enterprise AI and dashboard context...');
      
      const response = await enterpriseAI.processConversation({
        message: messageContent,
        projectId,
        context: {
          activeView,
          contextData,
          dashboardContext: currentContext,
          timestamp: new Date().toISOString(),
          userPreferences: {
            voiceEnabled,
            currentSession: enterpriseAI.getConversationId()
          }
        },
        enableVoice: voiceEnabled,
        conversationId: enterpriseAI.getConversationId() || undefined
      });

      if (response.success) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString(),
          audioUrl: response.audioUrl,
          toolCalls: response.toolCalls,
          dashboardContext: currentContext
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Auto-play voice response if available
        if (response.audioUrl && voiceEnabled) {
          try {
            const audio = new Audio(response.audioUrl);
            await audio.play();
          } catch (audioError) {
            console.error('Audio playback failed:', audioError);
          }
        }

        console.log('✅ Enterprise AI Response:', {
          model: response.metadata.model,
          tokens: response.metadata.tokensUsed,
          responseTime: response.metadata.responseTime,
          toolsUsed: response.toolCalls?.length || 0,
          hasVoice: response.metadata.hasVoice
        });
      } else {
        throw new Error(response.error || 'AI processing failed');
      }

    } catch (err: any) {
      console.error('❌ Enterprise AI Error:', err);
      setError(`AI processing failed: ${err.message || 'Unknown error'}`);
      
      // Fallback message with context awareness
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I apologize, but I'm experiencing technical difficulties right now. However, I can see you're currently viewing the ${activeView} dashboard. While I resolve this connectivity issue, I can still provide general assistance about construction project management. Please try your question again in a moment.`,
        timestamp: new Date().toISOString(),
        dashboardContext: currentContext
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
          <div className="flex flex-col gap-1">
            {message.isVoiceInput && (
              <Badge variant="secondary" className="text-xs">
                <Mic className="w-3 h-3 mr-1" />
                Voice
              </Badge>
            )}
            {message.dashboardContext && (
              <Badge variant="outline" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Context
              </Badge>
            )}
          </div>
        </div>
        
        {/* Tool Calls Indicator */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.toolCalls.map((tool, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {tool.name?.replace('get', '').replace('Construction', '').replace('Project', '') || 'Tool'}
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
              onClick={() => {
                const audio = new Audio(message.audioUrl!);
                audio.play().catch(console.error);
              }}
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
            <h2 className="text-lg font-semibold">Atlas - Enterprise AI Assistant</h2>
            <div className="text-sm text-muted-foreground">
              <span><strong>Project:</strong> {projectId === 'portfolio' ? 'Portfolio View' : `Project ${projectId}`}</span>
              <span className="mx-2">•</span>
              <span><strong>View:</strong> {activeView}</span>
              <span className="mx-2">•</span>
              <span><strong>Context:</strong> {dashboardContext ? 'Active' : 'Loading'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Enterprise AI
            </Badge>
            <Badge variant={enterpriseAI.isReady() ? "default" : "secondary"} className="text-xs">
              {enterpriseAI.isReady() ? '🟢 Connected' : '🟡 Connecting'}
            </Badge>
            <Badge variant={voiceEnabled ? "default" : "secondary"} className="text-xs">
              <Volume2 className="w-3 h-3 mr-1" />
              Voice {voiceEnabled ? 'On' : 'Off'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Dashboard Visible
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
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
                <span className="text-sm text-muted-foreground ml-2">Atlas is analyzing your dashboard and request...</span>
              </div>
            </Card>
          </div>
        )}
        
        {error && (
          <Card className="p-3 bg-destructive/10 border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
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
            placeholder={isListening ? "Listening..." : "Ask Atlas about what you see on the dashboard..."}
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
          💡 Atlas can see your current dashboard and access real-time project data
        </p>
      </div>
    </div>
  );
};

export default EnterpriseAIChat;

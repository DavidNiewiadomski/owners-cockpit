import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Brain, 
  Zap, 
  Eye,
  CheckCircle2,
  AlertTriangle,
  Building,
  Wrench,
  MessageSquare,
  PlayCircle,
  StopCircle,
  Square,
  Loader2,
  Sparkles
} from 'lucide-react';
import { FrontendAIService } from '@/lib/ai/frontend-ai-service';
import { useAppState } from '@/hooks/useAppState';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AutonomousAgent } from '@/lib/ai/autonomous-agent';

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
  const [aiReady, setAiReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiServiceRef = useRef<FrontendAIService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const agentRef = useRef<AutonomousAgent | null>(null);

  // Fetch available voices
  const fetchAvailableVoices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/voices');
      const data = await response.json();
      if (data.success) {
        setAvailableVoices(data.voices);
      }
    } catch (error) {
      console.error('Failed to fetch voices:', error);
    }
  };

  // Stop any playing audio
  const stopAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsAudioPlaying(false);
    }
  }, [currentAudio]);

  // Play audio with controls
  const playAudio = useCallback((audioUrl: string) => {
    // Stop any existing audio
    stopAudio();

    const audio = new Audio(audioUrl);
    audio.addEventListener('ended', () => {
      setIsAudioPlaying(false);
      setCurrentAudio(null);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      setIsAudioPlaying(false);
      setCurrentAudio(null);
      toast.error('Failed to play audio');
    });

    setCurrentAudio(audio);
    setIsAudioPlaying(true);
    
    audio.play().catch(err => {
      console.error('Audio playback failed:', err);
      setIsAudioPlaying(false);
      setCurrentAudio(null);
    });
  }, [stopAudio]);

  // Preview voice
  const previewVoice = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/voices/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice_id: selectedVoice,
          text: "Hi, I'm your construction assistant. This is how I sound."
        })
      });
      
      const data = await response.json();
      if (data.success && data.audio_url) {
        playAudio(data.audio_url);
      }
    } catch (error) {
      console.error('Voice preview failed:', error);
      toast.error('Failed to preview voice');
    }
  }, [selectedVoice, playAudio]);

  // Capture current dashboard context for AI visibility
  const captureDashboardContext = useCallback(() => {
    try {
      const context = {
        activeView,
        selectedProject,
        projectId,
        timestamp: new Date().toISOString(),
        visibleWidgets: document.querySelectorAll('[data-widget]').length,
        currentRoute: window.location.pathname,
        userRole: localStorage.getItem('userRole') || 'owner',
        dashboardData: {
          view: activeView,
          project: selectedProject,
          widgets: Array.from(document.querySelectorAll('[data-widget]')).map(el => ({
            type: el.getAttribute('data-widget'),
            visible: el.getBoundingClientRect().height > 0
          })),
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

  // Initialize AI service
  useEffect(() => {
    const initializeAI = async () => {
      if (!aiServiceRef.current) {
        const aiService = new FrontendAIService();
        const initialized = await aiService.initialize();
        
        if (initialized) {
          aiServiceRef.current = aiService;
          setAiReady(true);
          console.log('✅ AI Service initialized');
          toast.success('AI Assistant ready');
          
          // Fetch available voices
          fetchAvailableVoices();
        } else {
          setError('Failed to initialize AI service');
          toast.error('AI initialization failed');
        }
      }
    };

    initializeAI();

    // Capture dashboard context on mount and view changes
    const context = captureDashboardContext();
    console.log('🎯 Dashboard context captured:', context);

    // Add welcome message with context awareness
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Hey there. What do you need?`,
        timestamp: new Date().toISOString(),
        dashboardContext: context
      };
      setMessages([welcomeMessage]);
    }
  }, [activeView, projectId, captureDashboardContext]);

  useEffect(() => {
    agentRef.current = new AutonomousAgent('user_id', projectId);
  }, [projectId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recording handlers
  const startListening = useCallback(async () => {
    if (!aiServiceRef.current || isListening || !aiReady) return;
    
    try {
      setIsListening(true);
      setError(null);
      captureDashboardContext();
      
      await aiServiceRef.current.startVoiceRecording(
        (transcript) => {
          setInput(transcript);
          setIsListening(false);
          handleSendMessage(transcript, true);
        },
        (error) => {
          setError('Voice recognition failed: ' + error.message);
          setIsListening(false);
          toast.error('Voice recognition failed');
        }
      );
      
      toast.info('Listening... Speak now');
    } catch (error) {
      setError('Failed to start voice recording');
      setIsListening(false);
    }
  }, [isListening, aiReady, captureDashboardContext]);

  const stopListening = useCallback(() => {
    if (aiServiceRef.current && isListening) {
      aiServiceRef.current.stopVoiceRecording();
      setIsListening(false);
    }
  }, [isListening]);

  const handleSendMessage = async (content?: string, isVoice = false) => {
    const messageContent = content || input.trim();
    if (!messageContent || !aiReady) return;

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
    setIsTyping(true);

    try {
      if (!aiServiceRef.current) {
        throw new Error('AI service not initialized');
      }

      console.log('🤖 Processing message with AI service...');
      
      const response = await aiServiceRef.current.processMessage({
        message: messageContent,
        projectId,
        userId: 'enterprise_user',
        enableVoice: voiceEnabled,
        voiceOptimized: isVoice,
        isVoiceInput: isVoice,
        context: currentContext,
        priority: 'normal',
        voiceId: selectedVoice
      });
      
      if (!response.success) {
        throw new Error(response.error || 'AI processing failed');
      }
      
      console.log('✅ Received AI response:', {
        hasAudio: !!response.audioUrl,
        toolCount: response.toolCalls?.length || 0,
        modelUsed: response.metadata?.model
      });

      setIsTyping(false);

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

      // Handle tool results if any
      if (response.toolCalls && response.toolCalls.length > 0) {
        const toolNames = response.toolCalls.map(t => t.name).join(', ');
        toast.success(`Executed: ${toolNames}`);
      }

      // Auto-play voice response if available and enabled
      if (response.audioUrl && voiceEnabled) {
        playAudio(response.audioUrl);
      }

    } catch (err: any) {
      console.error('❌ AI Error:', err);
      setIsTyping(false);
      
      // Check if this is a network/connection error vs API response error
      const isNetworkError = err.message?.includes('Failed to fetch') || 
                            err.message?.includes('NetworkError') ||
                            err.message?.includes('CORS');
      
      if (isNetworkError) {
        setError('Connection error - please check your network');
        const networkErrorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `I'm having trouble connecting to the server. Please check your network connection and make sure the local Supabase instance is running.`,
          timestamp: new Date().toISOString(),
          dashboardContext: currentContext
        };
        setMessages(prev => [...prev, networkErrorMessage]);
        toast.error('Connection error');
      } else {
        // For other errors, just log them but don't show generic API key message
        console.warn('AI processing error (may be using fallback mode):', err.message);
        setError(null); // Clear error since AI might still be working with fallbacks
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerAgent = async (goal: string) => {
    if (agentRef.current) {
      await agentRef.current.operate(goal, 'autonomous');
      toast.success('Agent triggered', { description: 'Autonomous agent started.' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
          : 'bg-muted/50 border-primary/20'
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
                {tool.name?.replace(/get|Construction|Project/g, '') || 'Action'}
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
              onClick={() => playAudio(message.audioUrl!)}
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
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                AI Construction Assistant
                {aiReady && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                Viewing: {activeView} | Project: {projectId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {voiceEnabled && availableVoices.length > 0 && (
              <>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="text-xs px-2 py-1 rounded border bg-background"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previewVoice}
                  disabled={isAudioPlaying}
                  title="Preview selected voice"
                >
                  <PlayCircle className="w-4 h-4" />
                </Button>
              </>
            )}
            {isAudioPlaying && (
              <Button
                variant="destructive"
                size="sm"
                onClick={stopAudio}
                title="Stop audio"
              >
                <Square className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={voiceEnabled ? 'text-primary' : ''}
              title={voiceEnabled ? "Disable voice" : "Enable voice"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(renderMessage)}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
          <p className="text-xs text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/40 p-4">
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={isListening ? stopListening : startListening}
            disabled={!aiReady || isLoading}
            className="flex-shrink-0"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={aiReady ? "Ask anything or say 'Hey Atlas' for voice..." : "Initializing AI..."}
            disabled={!aiReady || isLoading}
            className="flex-1"
          />
          
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || !aiReady || isLoading}
            size="icon"
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            {isListening ? "Listening... speak now" : "Press Enter to send, or click the mic for voice"}
          </p>
          {voiceEnabled && (
            <Badge variant="outline" className="text-xs">
              <Volume2 className="w-3 h-3 mr-1" />
              Voice enabled
            </Badge>
          )}
        </div>
      </div>

      {/* Agent Actions */}
      <div className="p-4 border-t">
        <h4>Agent Actions</h4>
        {/* Display from agent */}
      </div>
    </div>
  );
};

export default EnterpriseAIChat;
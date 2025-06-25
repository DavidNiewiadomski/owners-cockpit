import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Settings, 
  Minimize2,
  Maximize2,
  X,
  MessageSquare,
  Brain,
  Zap,
  Users,
  Building2,
  ChevronDown,
  Play,
  Pause,
  Sparkles,
  AudioWaveform,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { premiumAI, type AIMessage } from '@/services/premiumAI';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId?: string;
  availableProjects?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  className?: string;
}

interface VoiceSettings {
  voiceId: string;
  voiceName: string;
  speed: number;
  pitch: number;
  emotion: 'neutral' | 'confident' | 'friendly' | 'authoritative';
}

const PREMIUM_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella - Professional', description: 'Clear, professional, confident delivery' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni - Executive', description: 'Authoritative, experienced, direct' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli - Advisor', description: 'Analytical, supportive, insightful' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh - Manager', description: 'Organized, practical, detail-oriented' }
];

export const PremiumAIChat: React.FC<PremiumAIChatProps> = ({
  isOpen,
  onClose,
  currentProjectId = '',
  availableProjects = [],
  className
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([currentProjectId]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    voiceName: 'Bella - Professional',
    speed: 1.0,
    pitch: 0.8,
    emotion: 'confident'
  });
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize voice assistant
  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeVoiceAssistant();
    }
  }, [isOpen, conversationId]);

  const initializeVoiceAssistant = async () => {
    try {
      const projectData = {
        projects: availableProjects.filter(p => selectedProjects.includes(p.id))
      };
      
      const initialized = await premiumAI.initializeVoiceAssistant(projectData);
      if (initialized) {
        const convId = await premiumAI.startVoiceConversation();
        setConversationId(convId);
        
        // Add welcome message
        const welcomeMessage: AIMessage = {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `Hey there! Just got back from the site visit on Pacific Heights. Everything's looking good - the steel delivery should be on track now. I've got my hands on all the latest project data. What can I help you with today? You can just talk to me or type whatever's on your mind.`,
          timestamp: new Date().toISOString(),
          metadata: { model: 'sarah-project-manager' }
        };
        
        setMessages([welcomeMessage]);
        
        if (isVoiceEnabled) {
          speakMessage(welcomeMessage.content);
        }
      }
    } catch (error) {
      console.error('Failed to initialize voice assistant:', error);
      toast({
        title: "Voice Assistant Error",
        description: "Failed to initialize voice features. Text chat is still available.",
        variant: "destructive",
      });
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: "Listening...",
        description: "Speak your message. Click the mic again to stop.",
      });
    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    try {
      const context = {
        projectId: selectedProjects.join(','),
        activeView: 'chat',
        userRole: 'building_owner'
      };

      const result = await premiumAI.sendVoiceMessage(audioBlob, context);
      
      // Add user message (transcribed)
      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: '[Voice Message]', // Would contain transcription in real implementation
        timestamp: new Date().toISOString(),
        metadata: { isVoice: true }
      };

      // Add assistant response
      const assistantMessage: AIMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
        metadata: { 
          model: 'elevenlabs-voice-ai',
          isVoice: true,
          hasAudio: true
        }
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);

      // Play audio response
      if (isVoiceEnabled && result.audioResponse) {
        await playAudioResponse(result.audioResponse);
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Voice Processing Error",
        description: "Failed to process voice input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudioResponse = async (audioBlob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      setIsSpeaking(true);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsSpeaking(false);
    }
  };

  const speakMessage = async (text: string) => {
    if (!isVoiceEnabled) return;
    
    try {
      const audioBlob = await premiumAI.textToSpeech?.(text, voiceSettings.voiceId);
      if (audioBlob) {
        await playAudioResponse(audioBlob);
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = {
        projectId: selectedProjects.join(','),
        activeView: 'chat',
        conversationHistory: messages,
        userRole: 'building_owner',
        contextData: {
          selectedProjects: selectedProjects,
          voiceEnabled: isVoiceEnabled
        }
      };

      const response = await premiumAI.sendMessage(inputMessage, context);
      setMessages(prev => [...prev, response]);

      // Speak the response if voice is enabled
      if (isVoiceEnabled && response.content) {
        await speakMessage(response.content);
      }

    } catch (error) {
      console.error('Message send error:', error);
      toast({
        title: "Message Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (isSpeaking && currentAudioRef.current) {
      currentAudioRef.current.pause();
      setIsSpeaking(false);
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const updateProjectSelection = (projectIds: string[]) => {
    setSelectedProjects(projectIds);
    premiumAI.updateProjectContext?.(projectIds);
    
    toast({
      title: "Context Updated",
      description: `Now analyzing ${projectIds.length} project${projectIds.length !== 1 ? 's' : ''}`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed bottom-4 right-4 w-96 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/5 before:to-purple-500/5 before:pointer-events-none",
          isMinimized && "h-16",
          !isMinimized && "h-[600px]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {premiumAI.isReady() && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Sarah Mitchell</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Project Manager • {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} active
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="space-y-4">
                  {/* Project Selection */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Project Context
                    </label>
                    <Select 
                      value={selectedProjects[0] || ''} 
                      onValueChange={(value) => updateProjectSelection([value])}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-3 w-3" />
                              <span>{project.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {project.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice Settings */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Voice Assistant
                    </label>
                    <Select 
                      value={voiceSettings.voiceId} 
                      onValueChange={(value) => {
                        const voice = PREMIUM_VOICES.find(v => v.id === value);
                        if (voice) {
                          setVoiceSettings(prev => ({
                            ...prev,
                            voiceId: value,
                            voiceName: voice.name
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PREMIUM_VOICES.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div>
                              <div className="font-medium">{voice.name}</div>
                              <div className="text-xs text-gray-500">{voice.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      "flex items-start space-x-2 max-w-[85%]",
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    )}>
                      {/* Avatar */}
                      <div className={cn(
                        "flex-shrink-0 mt-1",
                        message.role === 'user' ? 'order-last' : 'order-first'
                      )}>
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={cn(
                            "text-xs font-medium",
                            message.role === 'user' 
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                              : 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-600 dark:text-purple-400'
                          )}>
                            {message.role === 'user' ? (
                              <Users className="h-3 w-3" />
                            ) : (
                              <Brain className="h-3 w-3" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Message Bubble */}
                      <div className={cn(
                        "relative rounded-2xl p-4 shadow-sm backdrop-blur-sm border",
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500/20'
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border-gray-200/50 dark:border-gray-700/50'
                      )}>
                        {/* Message content */}
                        <div className="space-y-2">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          
                          {/* Voice indicator */}
                          {message.metadata?.isVoice && (
                            <div className="flex items-center space-x-1 mt-2">
                              <AudioWaveform className="h-3 w-3 opacity-60" />
                              <span className="text-xs opacity-60">Voice message</span>
                            </div>
                          )}
                        </div>

                        {/* Message metadata */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 opacity-50" />
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            {message.metadata?.model && (
                              <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                                {message.metadata.model.includes('gpt') ? 'GPT-4' : 
                                 message.metadata.model.includes('elevenlabs') ? 'Voice AI' : 'AI'}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex items-center space-x-1">
                            {message.metadata?.hasAudio && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity"
                                onClick={() => speakMessage(message.content)}
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  navigator.clipboard.writeText(message.content);
                                  toast({
                                    title: "Copied to clipboard",
                                    description: "Message copied successfully",
                                  });
                                }}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Message tail */}
                        <div className={cn(
                          "absolute top-4 w-3 h-3 transform rotate-45",
                          message.role === 'user'
                            ? '-right-1.5 bg-gradient-to-br from-blue-600 to-blue-700'
                            : '-left-1.5 bg-white/80 dark:bg-gray-800/80 border-l border-t border-gray-200/50 dark:border-gray-700/50'
                        )} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className="space-y-3">
                {/* Main input area */}
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="What's on your mind? Ask me about budgets, schedules, or anything project-related..."
                      className={cn(
                        "min-h-[48px] max-h-[120px] resize-none rounded-xl border-gray-200/50 dark:border-gray-700/50",
                        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50",
                        "transition-all duration-200"
                      )}
                      disabled={isLoading}
                    />
                    
                    {/* Character count */}
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                      {inputMessage.length}/500
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Voice input button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={isListening ? stopListening : startListening}
                        variant={isListening ? "destructive" : "outline"}
                        size="sm"
                        className={cn(
                          "h-12 w-12 p-0 rounded-xl transition-all duration-200",
                          isListening 
                            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                            : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        disabled={isLoading}
                      >
                        {isListening ? (
                          <MicOff className="h-5 w-5" />
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                      </Button>
                    </motion.div>
                    
                    {/* Voice output toggle */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={toggleVoice}
                        variant={isVoiceEnabled ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-12 w-12 p-0 rounded-xl transition-all duration-200",
                          isVoiceEnabled
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        {isVoiceEnabled ? (
                          <Volume2 className="h-5 w-5" />
                        ) : (
                          <VolumeX className="h-5 w-5" />
                        )}
                      </Button>
                    </motion.div>
                    
                    {/* Send button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        size="sm"
                        className={cn(
                          "h-12 w-12 p-0 rounded-xl transition-all duration-200",
                          "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "shadow-lg hover:shadow-xl"
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
                
                {/* Enhanced Status Bar */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-3">
                    {/* AI Status */}
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        premiumAI.isReady() ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                      )} />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {premiumAI.getStatus()}
                      </span>
                    </div>
                    
                    {/* Voice Status */}
                    {isVoiceEnabled && (
                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          Voice AI Active
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Activity indicators */}
                  <div className="flex items-center space-x-2">
                    {isListening && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full"
                      >
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                          Listening...
                        </span>
                      </motion.div>
                    )}
                    
                    {isSpeaking && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full"
                      >
                        <AudioWaveform className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Speaking...
                        </span>
                      </motion.div>
                    )}
                    
                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                      >
                        <Loader2 className="h-3 w-3 text-blue-600 dark:text-blue-400 animate-spin" />
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Processing...
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

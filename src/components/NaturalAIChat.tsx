import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X,
  MessageSquare,
  Settings,
  CheckCircle
} from 'lucide-react';
import { naturalAI, type ConversationContext } from '@/services/naturalAI';

interface NaturalAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: unknown;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoiceInput?: boolean;
  actions?: Array<{
    type: string;
    description: string;
    data?: unknown;
  }>;
}

interface VoiceSettings {
  enabled: boolean;
  autoPlay: boolean;
  selectedVoice: string;
  rate: number;
  pitch: number;
}

const NaturalAIChat: React.FC<NaturalAIChatProps> = ({ 
  projectId, 
  activeView, 
  contextData,
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    autoPlay: true,
    selectedVoice: '',
    rate: 0.9,
    pitch: 1.0
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => 
        voice.lang.startsWith('en') && 
        !voice.name.includes('Novelty')
      );
      setAvailableVoices(englishVoices);
      
      // Set default voice to a premium one if available
      const defaultVoice = englishVoices.find(voice => 
        voice.name.includes('Samantha') || 
        voice.name.includes('Alex') ||
        voice.name.includes('Google') ||
        voice.name.includes('Microsoft')
      ) || englishVoices[0];
      
      if (defaultVoice && !voiceSettings.selectedVoice) {
        setVoiceSettings(prev => ({ ...prev, selectedVoice: defaultVoice.name }));
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, [voiceSettings.selectedVoice]);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Set a flag to send the message after state updates
        setTimeout(() => handleSendMessage(transcript, true), 100);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
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

  // Add initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = {
        id: 'greeting',
        role: 'assistant' as const,
        content: `Hi! I'm here to help with your ${projectId === 'portfolio' ? 'portfolio management' : projectId + ' project'}. What would you like to know?`,
        timestamp: new Date().toISOString()
      };
      setMessages([greeting]);

      // Show suggested questions
      setTimeout(() => {
        const suggestions = naturalAI.getSuggestedQuestions({
          projectId,
          activeView,
          conversationHistory: []
        });
        
        const suggestionMessage = {
          id: 'suggestions',
          role: 'assistant' as const,
          content: "Here are some things I can help with:",
          timestamp: new Date().toISOString(),
          actions: suggestions.map(suggestion => ({
            type: 'suggestion',
            description: suggestion,
            data: { query: suggestion }
          }))
        };
        
        setMessages(prev => [...prev, suggestionMessage]);
      }, 1000);
    }
  }, [projectId, activeView, messages.length]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speakText = useCallback((text: string) => {
    if (!voiceSettings.enabled || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current = utterance;
    
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = 0.8;
    
    const selectedVoice = availableVoices.find(voice => voice.name === voiceSettings.selectedVoice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    speechSynthesis.speak(utterance);
  }, [voiceSettings, availableVoices]);

  const _stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    synthRef.current = null;
  }, []);

  const handleSendMessage = useCallback(async (content?: string, isVoice = false) => {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      isVoiceInput: isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context: ConversationContext = {
        projectId,
        activeView,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        contextData
      };

      const response = await naturalAI.sendMessage(messageContent, context);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        actions: response.actions
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-play voice response if enabled
      if (voiceSettings.enabled && voiceSettings.autoPlay) {
        speakText(response.content);
      }

    } catch (error) {
      console.error('Natural AI Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, input, isLoading, projectId, activeView, contextData, voiceSettings, speakText]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const executeAction = (action: { type: string; description: string; data?: { query?: string } }) => {
    console.log('Executing action:', action);
    if (action.type === 'suggestion' && action.data?.query) {
      handleSuggestionClick(action.data.query);
    }
    // Add more action types as needed
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">AI Assistant</div>
                <div className="text-blue-100 text-sm">
                  {projectId === 'portfolio' ? 'Portfolio Overview' : projectId} • {activeView}
                </div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Voice Settings */}
          {showSettings && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Voice Responses</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVoiceSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className="text-white hover:bg-white/20"
                >
                  {voiceSettings.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
              
              {voiceSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm">Voice Selection</label>
                    <Select
                      value={voiceSettings.selectedVoice}
                      onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, selectedVoice: value }))}
                    >
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-play responses</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVoiceSettings(prev => ({ ...prev, autoPlay: !prev.autoPlay }))}
                      className="text-white hover:bg-white/20"
                    >
                      {voiceSettings.autoPlay ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-white rounded" />}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  {message.role === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  
                  <div className="flex-1">
                    <div className="text-sm">{message.content}</div>
                    
                    {message.role === 'assistant' && voiceSettings.enabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(message.content)}
                        className="mt-2 h-6 text-xs hover:bg-gray-200"
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Listen
                      </Button>
                    )}
                    
                    {/* Action buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => executeAction(action)}
                            className="mr-2 mb-2"
                          >
                            {action.description}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your project, budgets, timelines, or anything else..."
                className="pr-12 focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${
                  isListening ? 'text-red-500' : 'text-gray-400'
                }`}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NaturalAIChat;

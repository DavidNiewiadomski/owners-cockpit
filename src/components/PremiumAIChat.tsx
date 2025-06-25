import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Settings
} from 'lucide-react';
import { premiumAI, type AIMessage, type StreamingResponse } from '@/services/premiumAI';

interface PremiumAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: any;
}

const PremiumAIChat: React.FC<PremiumAIChatProps> = ({ 
  projectId, 
  activeView, 
  contextData 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamMessage, setCurrentStreamMessage] = useState<AIMessage | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoVoiceResponse, setAutoVoiceResponse] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Premium AI Status
  const aiStatus = premiumAI.getStatus();
  const aiReady = premiumAI.isReady();

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
  }, [messages, currentStreamMessage]);

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

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    // Stop any existing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current = utterance;
    
    // Enhanced voice settings
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.volume = 0.9;
    
    // Try to use a premium voice
    const voices = speechSynthesis.getVoices();
    const premiumVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Premium')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }
    
    speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    synthRef.current = null;
  }, []);

  const handleSendMessage = async (content?: string, isVoice = false) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    console.log('🚀 Sending message to Premium AI:', messageContent);

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      metadata: { isVoiceInput: isVoice }
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setError(null);
    setCurrentStreamMessage(null);

    try {
      const context = {
        projectId,
        activeView,
        conversationHistory: messages,
        userRole: 'Building Owner/Manager',
        contextData
      };

      // Use streaming for better UX
      const response = await premiumAI.sendMessage(
        messageContent,
        context,
        (streamChunk: StreamingResponse) => {
          setCurrentStreamMessage(streamChunk.message);
          
          if (streamChunk.isComplete) {
            setMessages(prev => [...prev, streamChunk.message]);
            setCurrentStreamMessage(null);
            setIsStreaming(false);
            
            // Auto voice response
            if ((isVoice && autoVoiceResponse) || autoVoiceResponse) {
              speakText(streamChunk.message.content);
            }
          }
        }
      );

      // Fallback if streaming didn't work
      if (!isStreaming) {
        setMessages(prev => [...prev, response]);
        
        if ((isVoice && autoVoiceResponse) || autoVoiceResponse) {
          speakText(response.content);
        }
      }

    } catch (err) {
      console.error('❌ Premium AI Chat error:', err);
      setError(`AI connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: AIMessage) => (
    <div
      key={message.id}
      className={`flex items-start gap-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      {message.role === 'assistant' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Brain className="w-5 h-5 text-white" />
        </div>
      )}
      
      <Card className={`max-w-[80%] p-4 ${
        message.role === 'user' 
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-md'
      }`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm whitespace-pre-wrap flex-1 leading-relaxed">
            {message.content}
          </p>
          {message.metadata?.isVoiceInput && (
            <Badge variant="secondary" className="text-xs shrink-0">
              <Mic className="w-3 h-3 mr-1" />
              Voice
            </Badge>
          )}
        </div>
        
        {/* AI Model & Actions */}
        {message.role === 'assistant' && message.metadata && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.metadata.model && (
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {message.metadata.model}
              </Badge>
            )}
            {message.metadata.tokens && (
              <Badge variant="outline" className="text-xs">
                {message.metadata.tokens} tokens
              </Badge>
            )}
            {message.metadata.actions && message.metadata.actions.length > 0 && (
              <Badge variant="default" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {message.metadata.actions.length} action(s)
              </Badge>
            )}
          </div>
        )}
        
        {/* Platform Actions */}
        {message.metadata?.actions && message.metadata.actions.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.metadata.actions.map((action: any, index: number) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">{action.description}</span>
                <Badge variant="secondary" className="text-xs">
                  {action.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <p className={`text-xs opacity-70 ${
            message.role === 'user' ? 'text-white/70' : 'text-gray-500'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
          
          {message.role === 'assistant' && voiceEnabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakText(message.content)}
              className="h-6 px-2 text-xs"
            >
              <Volume2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </Card>
      
      {message.role === 'user' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
      {/* Premium Header */}
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Premium AI Assistant</h2>
              <div className="text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <strong>Project:</strong>
                  <span>{projectId === 'portfolio' ? 'Portfolio Overview' : `Project ${projectId}`}</span>
                  <span className="mx-2">•</span>
                  <span>{activeView}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {speechSynthesis.speaking && (
              <Button
                variant="secondary"
                size="sm"
                onClick={stopSpeaking}
                className="animate-pulse"
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={voiceEnabled ? 'bg-white/20' : 'bg-white/10'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* AI Status */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
            <div className={`w-2 h-2 rounded-full mr-2 ${aiReady ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
            {aiStatus}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
            <Clock className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
            <Zap className="w-3 h-3 mr-1" />
            Function Calling
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium AI Assistant Ready</h3>
              <p className="text-sm text-gray-600 mb-4">
                I'm your advanced construction management AI with access to real-time data, 
                platform integrations, and the ability to perform actions across Teams, Outlook, and your project systems.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <Badge variant="outline">GPT-4 Omni</Badge>
                <Badge variant="outline">Voice Recognition</Badge>
                <Badge variant="outline">Function Calling</Badge>
                <Badge variant="outline">Real-time Streaming</Badge>
                <Badge variant="outline">Platform Actions</Badge>
              </div>
            </div>
          </Card>
        )}
        
        {messages.map(renderMessage)}
        
        {/* Streaming Message */}
        {currentStreamMessage && (
          <div className="flex items-start gap-3 justify-start mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>
            <Card className="max-w-[80%] p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-md">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {currentStreamMessage.content}
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                  Streaming...
                </Badge>
              </div>
            </Card>
          </div>
        )}
        
        {/* Loading */}
        {isLoading && !currentStreamMessage && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-gray-600 ml-2">AI is analyzing and preparing response...</span>
              </div>
            </Card>
          </div>
        )}
        
        {error && (
          <Card className="p-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </Card>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input */}
      <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex gap-3">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            disabled={!recognitionRef.current}
            className={`shrink-0 ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Ask about your project, request actions, or start a conversation..."}
            disabled={isLoading || isListening}
            className="flex-1 min-h-[44px] max-h-32 resize-none"
          />
          
          <Button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim() || isListening}
            size="sm"
            className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>🎤 Voice Recognition</span>
            <span>🔊 Text-to-Speech</span>
            <span>⚡ Function Calling</span>
            <span>📡 Real-time Streaming</span>
          </div>
          <span>Enter to send • Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumAIChat;

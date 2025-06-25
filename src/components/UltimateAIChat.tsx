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
  Settings,
  Cpu,
  Cloud,
  Shield,
  Target,
  Activity
} from 'lucide-react';
import { enterpriseAI, type AIResponse } from '@/services/enterpriseAI';
import { voiceService } from '@/services/voiceService';

interface UltimateAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: any;
}

interface Message extends AIResponse {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isVoiceInput?: boolean;
}

const UltimateAIChat: React.FC<UltimateAIChatProps> = ({ 
  projectId, 
  activeView, 
  contextData 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamMessage, setCurrentStreamMessage] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoVoiceResponse, setAutoVoiceResponse] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<any>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [averageLatency, setAverageLatency] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Enterprise AI and get model status
  useEffect(() => {
    const initializeAI = async () => {
      const status = enterpriseAI.getModelStatus();
      setModelStatus(status);
      
      // Optimize for current device
      const deviceInfo = {
        platform: 'Mac', // TODO: Detect actual platform
        memory: 24, // Your M4 Pro specs
        processor: 'M4 Pro'
      };
      
      await enterpriseAI.optimizeForDevice(deviceInfo);
      console.log('🚀 Enterprise AI initialized and optimized for M4 Pro');
    };
    
    initializeAI();
  }, []);

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

  // Calculate analytics
  useEffect(() => {
    if (messages.length > 0) {
      const assistantMessages = messages.filter(m => m.role === 'assistant');
      const totalLatency = assistantMessages.reduce((sum, msg) => sum + (msg.latency || 0), 0);
      const totalCostCalc = assistantMessages.reduce((sum, msg) => sum + (msg.cost || 0), 0);
      
      setAverageLatency(totalLatency / assistantMessages.length || 0);
      setTotalCost(totalCostCalc);
    }
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

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current = utterance;
    
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.volume = 0.9;
    
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

    console.log('🚀 Sending message to Enterprise AI:', messageContent);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      isVoiceInput: isVoice,
      model: 'User Input',
      tier: 'user',
      latency: 0,
      cost: 0,
      confidence: 1,
      metadata: { isVoiceInput: isVoice }
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setCurrentStreamMessage(null);

    try {
      const context = {
        projectId,
        activeView,
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
        userRole: 'Building Owner/Manager',
        contextData
      };

      // Use Enterprise AI routing
      const response = await enterpriseAI.sendMessage(
        messageContent,
        context,
        (streamChunk: any) => {
          setCurrentStreamMessage(streamChunk);
          
          if (streamChunk.isComplete) {
            const assistantMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              timestamp: new Date().toISOString(),
              ...streamChunk
            };
            
            setMessages(prev => [...prev, assistantMessage]);
            setCurrentStreamMessage(null);
            setIsStreaming(false);
            
            if ((isVoice && autoVoiceResponse) || autoVoiceResponse) {
              speakText(streamChunk.content);
            }
          }
        }
      );

      // Fallback if streaming didn't work
      if (!currentStreamMessage) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          ...response
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        if ((isVoice && autoVoiceResponse) || autoVoiceResponse) {
          speakText(response.content);
        }
      }

    } catch (err) {
      console.error('❌ Enterprise AI Chat error:', err);
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

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'edge': return <Cpu className="w-3 h-3" />;
      case 'cloud': return <Cloud className="w-3 h-3" />;
      case 'custom': return <Target className="w-3 h-3" />;
      default: return <Brain className="w-3 h-3" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'edge': return 'bg-green-100 text-green-800 border-green-300';
      case 'cloud': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'custom': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className={`flex items-start gap-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      {message.role === 'assistant' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          {getTierIcon(message.tier)}
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
          {message.isVoiceInput && (
            <Badge variant="secondary" className="text-xs shrink-0">
              <Mic className="w-3 h-3 mr-1" />
              Voice
            </Badge>
          )}
        </div>
        
        {/* AI Model & Performance Metrics */}
        {message.role === 'assistant' && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className={`text-xs ${getTierColor(message.tier)}`}>
              {getTierIcon(message.tier)}
              <span className="ml-1">{message.model}</span>
            </Badge>
            
            {message.latency && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {message.latency}ms
              </Badge>
            )}
            
            {message.confidence && (
              <Badge variant="outline" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                {Math.round(message.confidence * 100)}%
              </Badge>
            )}
            
            {message.cost > 0 && (
              <Badge variant="outline" className="text-xs">
                ${message.cost.toFixed(4)}
              </Badge>
            )}
            
            {message.metadata?.classification && (
              <Badge variant="secondary" className="text-xs">
                {message.metadata.classification.complexity} · {message.metadata.classification.domain}
              </Badge>
            )}
          </div>
        )}
        
        {/* Platform Actions */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.actions.map((action: any, index: number) => (
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
      {/* Enterprise Header */}
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Enterprise AI Assistant</h2>
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
        
        {/* Advanced Status & Analytics */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {modelStatus && (
            <>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                <Cpu className="w-3 h-3 mr-1" />
                Edge: {modelStatus.edge?.length || 0} models
              </Badge>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                <Cloud className="w-3 h-3 mr-1" />
                Cloud: {modelStatus.cloud?.length || 0} models
              </Badge>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                <Target className="w-3 h-3 mr-1" />
                Custom: {modelStatus.custom?.length || 0} models
              </Badge>
            </>
          )}
          
          {averageLatency > 0 && (
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
              <Clock className="w-3 h-3 mr-1" />
              Avg: {Math.round(averageLatency)}ms
            </Badge>
          )}
          
          {totalCost > 0 && (
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
              💰 ${totalCost.toFixed(4)}
            </Badge>
          )}
          
          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
            <Shield className="w-3 h-3 mr-1" />
            Intelligent Routing
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 border border-blue-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-green-500 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Enterprise AI Assistant Ready</h3>
              <p className="text-sm text-gray-600 mb-4">
                Powered by intelligent multi-tier routing: Edge compute for speed, cloud for complexity, 
                and custom models for construction expertise. Your queries are automatically routed to the best AI model.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <Badge variant="outline" className="bg-green-50">
                  <Cpu className="w-3 h-3 mr-1" />
                  Local Edge Models
                </Badge>
                <Badge variant="outline" className="bg-blue-50">
                  <Cloud className="w-3 h-3 mr-1" />
                  Cloud AI (GPT-4, Claude)
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  <Target className="w-3 h-3 mr-1" />
                  Construction Experts
                </Badge>
                <Badge variant="outline">🎤 Voice Recognition</Badge>
                <Badge variant="outline">🔊 Premium TTS</Badge>
                <Badge variant="outline">⚡ Function Calling</Badge>
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-gray-600 ml-2">Intelligent AI routing in progress...</span>
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

      {/* Enterprise Input */}
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
            className="shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>🎤 Voice Recognition</span>
            <span>🔊 Premium TTS</span>
            <span>🧠 Intelligent Routing</span>
            <span>⚡ Multi-Tier AI</span>
            <span>🚀 Edge + Cloud</span>
          </div>
          <span>Enter to send • Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default UltimateAIChat;

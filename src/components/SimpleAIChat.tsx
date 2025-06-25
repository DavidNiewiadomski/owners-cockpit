import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Brain } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SimpleAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: any;
}

const SimpleAIChat: React.FC<SimpleAIChatProps> = ({ 
  projectId, 
  activeView, 
  contextData: _contextData 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateDemoResponse = (question: string) => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('schedule') || lowerQ.includes('timeline')) {
      return `Based on your ${projectId} project data, I can see your current schedule shows 85% completion. The critical path indicates potential delays in structural work due to weather. I recommend accelerating interior finishes while monitoring foundation curing. Would you like me to generate a detailed schedule report?`;
    }
    
    if (lowerQ.includes('budget') || lowerQ.includes('cost')) {
      return `Your project is currently 3.2% over budget ($47,000) due to recent material cost increases. I've identified potential savings through vendor renegotiation and scope optimization. The largest variance is in electrical work. Would you like me to create a budget variance report?`;
    }
    
    if (lowerQ.includes('safety') || lowerQ.includes('incident')) {
      return `Safety metrics show excellent performance with zero incidents this month and a 96% compliance rate. Recent safety training completion is at 89%. I notice some subcontractors need updated certifications. Shall I generate a safety compliance report?`;
    }
    
    if (lowerQ.includes('team') || lowerQ.includes('communication')) {
      return `Recent communication analysis shows strong coordination between trades. There are 3 pending action items requiring owner approval and 5 RFIs awaiting response. The average response time has improved by 15% this week. Would you like me to summarize pending items?`;
    }

    if (lowerQ.includes('progress') || lowerQ.includes('status')) {
      return `Current project progress is 78% complete, slightly ahead of the baseline schedule. Key milestones achieved this week include completion of HVAC rough-in and electrical panel installation. Next critical milestone is drywall completion by Friday. Overall trajectory looks positive for on-time delivery.`;
    }

    if (lowerQ.includes('weather') || lowerQ.includes('site conditions')) {
      return `Current site conditions are favorable with clear skies and temperatures ideal for concrete work. Weather forecast shows potential rain Thursday-Friday which may impact exterior finishes. I recommend accelerating roofing work and protecting open areas. Shall I update the weather contingency plan?`;
    }
    
    return `I understand you're asking about "${question}". As your AI construction assistant for ${projectId === 'portfolio' ? 'Portfolio View' : `Project ${projectId}`}, I can help with project data, schedules, budgets, safety metrics, team coordination, and site management. I can also generate reports and send notifications. What specific aspect would you like me to analyze?`;
  };

  const handleSendMessage = async () => {
    const messageContent = input.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: generateDemoResponse(messageContent),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
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
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="default" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            AI Assistant
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Demo Mode
          </Badge>
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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your project or request assistance..."
            disabled={isLoading}
            className="flex-1"
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
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

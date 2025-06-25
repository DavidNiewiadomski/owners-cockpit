import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Mic } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface BasicAIChatProps {
  projectId: string;
  activeView: string;
  contextData?: any;
}

const BasicAIChat: React.FC<BasicAIChatProps> = ({ 
  projectId, 
  activeView 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm Atlas, your AI construction assistant. I'm here to help you manage your ${projectId === 'portfolio' ? 'portfolio' : `Project ${projectId}`}. I can assist with progress tracking, budget analysis, safety compliance, and team coordination. What would you like to know?`;
    }
    
    if (lowerMessage.includes('progress') || lowerMessage.includes('status')) {
      return `Based on your ${projectId === 'portfolio' ? 'portfolio overview' : `Project ${projectId}`}, here's the current progress:\n\n• Overall completion: 73%\n• Current phase: Construction\n• Timeline: On track (2 days ahead)\n• Critical path items: 3 pending\n\nThe project is progressing well with good momentum this week. Would you like me to provide more details on any specific area?`;
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('financial')) {
      return `Financial summary for your project:\n\n• Total Budget: $2.4M\n• Spent to Date: $1.8M (75%)\n• Remaining: $600K\n• Current Variance: +$45K (1.9%)\n\nThe slight budget variance is primarily due to material cost increases. The cash flow remains healthy with a monthly burn rate of $180K. Next payment milestone: $120K due next Friday.`;
    }
    
    if (lowerMessage.includes('safety') || lowerMessage.includes('incident')) {
      return `Safety performance update:\n\n• Safety Score: 94/100 ⭐\n• Incident-free days: 127\n• Training compliance: 96%\n• PPE compliance: 98%\n• Recent inspections: All passed\n\nExcellent safety record! Only 2 team members have overdue safety training. I can send them reminders if you'd like.`;
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast')) {
      return `Weather forecast for your project location:\n\n• Today: Partly cloudy, 72°F, 15% rain chance\n• Tomorrow: Sunny, 75°F, 5% rain chance\n• This week: Mostly favorable conditions\n• Weekend: Light rain possible Saturday\n\nGreat conditions for outdoor work this week! Consider scheduling concrete pours for tomorrow when conditions are optimal.`;
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('communication')) {
      return `Team communication summary:\n\n• Active team members: 24\n• Pending RFIs: 3\n• Recent updates: 12 this week\n• Urgent notifications: 1\n\nThe team is well-coordinated. There's one urgent item regarding the electrical inspection scheduled for Thursday. Would you like me to send a reminder to the electrical team?`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I'm your AI construction management assistant! Here's how I can help:\n\n🏗️ **Project Management**\n• Real-time progress tracking\n• Schedule analysis and updates\n• Milestone monitoring\n\n💰 **Financial Management**\n• Budget tracking and variance analysis\n• Cash flow projections\n• Cost center reporting\n\n🛡️ **Safety & Compliance**\n• Safety score monitoring\n• Training compliance tracking\n• Incident reporting\n\n👥 **Team Coordination**\n• Communication summaries\n• Task assignments\n• Notification management\n\n🌤️ **Environmental Factors**\n• Weather impact assessments\n• Scheduling optimization\n\nJust ask me about any aspect of your project!`;
    }
    
    return `I understand you're asking about "${userMessage}" for your ${projectId === 'portfolio' ? 'portfolio' : `Project ${projectId}`}. I have access to real-time project data and can help with:\n\n• Progress and schedule updates\n• Budget and financial analysis\n• Safety compliance monitoring\n• Team communication coordination\n• Weather and environmental factors\n\nCould you be more specific about what information you need? For example, try asking about "current progress status" or "budget variance analysis".`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: generateResponse(userMessage.content),
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">AI Construction Assistant</h2>
            <p className="text-sm text-muted-foreground">
              <strong>Project:</strong> {projectId === 'portfolio' ? 'Portfolio View' : `Project ${projectId}`} • {activeView}
            </p>
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
        ))}
        
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
                <span className="text-sm text-muted-foreground ml-2">Analyzing your request...</span>
              </div>
            </Card>
          </div>
        )}
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

export default BasicAIChat;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MessageSquare, 
  Mail, 
  Video, 
  Phone, 
  Slack, 
  Bot,
  Bell,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import OutlookPopup from './popups/OutlookPopup';
import TeamsPopup from './popups/TeamsPopup';
import ZoomPopup from './popups/ZoomPopup';
import SlackPopup from './popups/SlackPopup';
import WhatsAppPopup from './popups/WhatsAppPopup';

interface CommunicationProviderIconsProps {
  projectId: string;
}

interface Provider {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  connected: boolean;
  unreadCount: number;
  lastActivity: string;
  urgentCount: number;
}

const CommunicationProviderIcons: React.FC<CommunicationProviderIconsProps> = ({ projectId }) => {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  // Mock provider data - in real app, fetch from API
  const providers: Provider[] = [
    {
      id: 'outlook',
      name: 'Outlook',
      icon: Mail,
      color: 'bg-blue-600 hover:bg-blue-700',
      connected: true,
      unreadCount: 8,
      lastActivity: '5 min ago',
      urgentCount: 2
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: MessageSquare,
      color: 'bg-purple-600 hover:bg-purple-700',
      connected: true,
      unreadCount: 15,
      lastActivity: '2 min ago',
      urgentCount: 1
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: Video,
      color: 'bg-blue-500 hover:bg-blue-600',
      connected: true,
      unreadCount: 3,
      lastActivity: '12 min ago',
      urgentCount: 0
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: Slack,
      color: 'bg-green-600 hover:bg-green-700',
      connected: false,
      unreadCount: 0,
      lastActivity: 'Not connected',
      urgentCount: 0
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: Phone,
      color: 'bg-green-500 hover:bg-green-600',
      connected: true,
      unreadCount: 4,
      lastActivity: '8 min ago',
      urgentCount: 1
    }
  ];

  const handleProviderClick = (providerId: string) => {
    setActiveProvider(activeProvider === providerId ? null : providerId);
  };

  const handleClosePopup = () => {
    setActiveProvider(null);
  };

  const renderPopup = () => {
    switch (activeProvider) {
      case 'outlook':
        return <OutlookPopup projectId={projectId} onClose={handleClosePopup} />;
      case 'teams':
        return <TeamsPopup projectId={projectId} onClose={handleClosePopup} />;
      case 'zoom':
        return <ZoomPopup projectId={projectId} onClose={handleClosePopup} />;
      case 'slack':
        return <SlackPopup projectId={projectId} onClose={handleClosePopup} />;
      case 'whatsapp':
        return <WhatsAppPopup projectId={projectId} onClose={handleClosePopup} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {providers.map((provider) => {
          const IconComponent = provider.icon;
          const hasNotifications = provider.unreadCount > 0;
          const hasUrgent = provider.urgentCount > 0;
          
          return (
            <Tooltip key={provider.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                    provider.connected 
                      ? `${provider.color} text-white shadow-md hover:scale-105` 
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  } ${activeProvider === provider.id ? 'ring-2 ring-white ring-offset-2' : ''}`}
                  onClick={() => handleProviderClick(provider.id)}
                  disabled={!provider.connected}
                >
                  <IconComponent className="w-4 h-4" />
                  
                  {/* Notification Badge */}
                  {hasNotifications && (
                    <Badge 
                      variant="destructive" 
                      className={`absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center ${
                        hasUrgent ? 'animate-pulse bg-red-600' : 'bg-red-500'
                      }`}
                    >
                      {provider.unreadCount > 99 ? '99+' : provider.unreadCount}
                    </Badge>
                  )}
                  
                  {/* Urgent Indicator */}
                  {hasUrgent && (
                    <div className="absolute -bottom-1 -right-1">
                      <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />
                    </div>
                  )}
                  
                  {/* Connection Status */}
                  <div className={`absolute -bottom-0.5 -left-0.5 w-2 h-2 rounded-full border border-white ${
                    provider.connected ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {provider.connected ? (
                      <>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Connected
                        </div>
                        {hasNotifications && (
                          <div className="mt-1">
                            {provider.unreadCount} unread messages
                            {hasUrgent && ` (${provider.urgentCount} urgent)`}
                          </div>
                        )}
                        <div>Last activity: {provider.lastActivity}</div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-gray-400" />
                        Not connected
                      </div>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
        
        {/* AI Communication Assistant */}
        <div className="ml-2 pl-2 border-l border-border/40">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                onClick={() => handleProviderClick('ai-assistant')}
              >
                <Bot className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="space-y-1">
                <div className="font-medium">AI Communication Assistant</div>
                <div className="text-xs text-muted-foreground">
                  Smart replies, meeting summaries, and auto-responses
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Render Active Popup */}
      {activeProvider && renderPopup()}
    </>
  );
};

export default CommunicationProviderIcons;

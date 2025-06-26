import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  MessageCircle, 
  Video, 
  MessageSquare, 
  Phone,
  X,
  Calendar,
  Users,
  Bell
} from 'lucide-react';
import OutlookInterface from './OutlookInterface';
import TeamsInterface from './TeamsInterface';
import ZoomInterface from './ZoomInterface';
import SlackInterface from './SlackInterface';
import WhatsAppInterface from './WhatsAppInterface';
import CalendarInterface from './CalendarInterface';
import { useOAuthConnections } from '@/hooks/useOAuthConnections';

interface CommunicationHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialProvider?: string;
}

const CommunicationHub: React.FC<CommunicationHubProps> = ({ 
  isOpen, 
  onClose, 
  initialProvider = 'outlook' 
}) => {
  const [activeTab, setActiveTab] = useState(initialProvider);
  const { getConnectionStatus } = useOAuthConnections();

  // Update active tab when initialProvider changes
  React.useEffect(() => {
    if (initialProvider) {
      setActiveTab(initialProvider);
    }
  }, [initialProvider]);

  const providers = [
    {
      id: 'outlook',
      name: 'Outlook',
      icon: Mail,
      color: '#0078d4',
      component: OutlookInterface,
      unreadCount: 3
    },
    {
      id: 'teams',
      name: 'Teams',
      icon: MessageCircle,
      color: '#6264a7',
      component: TeamsInterface,
      unreadCount: 5
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: Video,
      color: '#2D8CFF',
      component: ZoomInterface,
      unreadCount: 0
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: MessageSquare,
      color: '#4A154B',
      component: SlackInterface,
      unreadCount: 12
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: Phone,
      color: '#25D366',
      component: WhatsAppInterface,
      unreadCount: 2
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: Calendar,
      color: '#0078d4',
      component: CalendarInterface,
      unreadCount: 0
    }
  ];

  // Show all providers since they're auto-connected in demo mode
  const connectedProviders = providers;

  const totalUnread = connectedProviders.reduce((sum, provider) => sum + provider.unreadCount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Communication tabs at top */}
          <div className="flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 py-2">
            <TabsList className="grid grid-cols-6 bg-muted/50">
              {connectedProviders.map((provider) => {
                const Icon = provider.icon;
                return (
                  <TabsTrigger
                    key={provider.id}
                    value={provider.id}
                    className="flex items-center gap-2 relative text-xs px-2 py-1"
                  >
                    <Icon className="h-3 w-3" style={{ color: provider.color }} />
                    <span className="hidden sm:inline">{provider.name}</span>
                    {provider.unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-1 h-4 px-1 text-[10px] leading-none">
                        {provider.unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {/* Close button */}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* App content - no background wrapper */}
          <div className="flex-1">
            {connectedProviders.map((provider) => {
              const Component = provider.component;
              return (
                <TabsContent 
                  key={provider.id} 
                  value={provider.id} 
                  className="h-full m-0 data-[state=active]:flex"
                >
                  <Component />
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationHub;

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
    }
  ];

  const connectedProviders = providers.filter(provider => 
    getConnectionStatus(provider.id).connected
  );

  const totalUnread = connectedProviders.reduce((sum, provider) => sum + provider.unreadCount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-bold">Communications Hub</DialogTitle>
              {totalUnread > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  {totalUnread} unread
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-4">
          {connectedProviders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Connected Services</h3>
                <p className="text-muted-foreground mb-4">
                  Connect to communication services to access your messages and meetings
                </p>
                <div className="flex gap-2 justify-center">
                  {providers.map((provider) => {
                    const Icon = provider.icon;
                    return (
                      <Button
                        key={provider.id}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => {
                          // This would trigger the OAuth flow
                          console.log(`Connect to ${provider.name}`);
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: provider.color }} />
                        Connect {provider.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                {connectedProviders.map((provider) => {
                  const Icon = provider.icon;
                  return (
                    <TabsTrigger
                      key={provider.id}
                      value={provider.id}
                      className="flex items-center gap-2 relative"
                    >
                      <Icon className="h-4 w-4" style={{ color: provider.color }} />
                      <span>{provider.name}</span>
                      {provider.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                          {provider.unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {connectedProviders.map((provider) => {
                const Component = provider.component;
                return (
                  <TabsContent 
                    key={provider.id} 
                    value={provider.id} 
                    className="h-[calc(100%-60px)] mt-0"
                  >
                    <Component />
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationHub;

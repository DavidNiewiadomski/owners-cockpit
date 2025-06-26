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

  // Find the active provider
  const activeProvider = providers.find(p => p.id === activeTab);
  const Component = activeProvider?.component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0">
        {/* Only show close button - no other wrapper UI */}
        <div className="absolute top-4 right-4 z-50">
          <Button variant="ghost" size="icon" onClick={onClose} className="bg-black/20 hover:bg-black/40 text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Render the active component directly */}
        {Component && <Component />}
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationHub;

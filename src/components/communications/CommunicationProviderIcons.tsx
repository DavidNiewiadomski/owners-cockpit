import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Mail, 
  Video, 
  Phone, 
  Slack, 
  Bot,
  Bell,
  AlertCircle,
  CheckCircle,
  Settings,
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { communicationSetup, type CommunicationProvider } from '@/services/communicationSetup';
import { useToast } from '@/hooks/use-toast';
import OutlookPopup from './popups/OutlookPopup';
import TeamsPopup from './popups/TeamsPopup';
import ZoomPopup from './popups/ZoomPopup';
import SlackPopup from './popups/SlackPopup';
import WhatsAppPopup from './popups/WhatsAppPopup';

interface CommunicationProviderIconsProps {
  projectId: string;
}

interface UIProvider {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  connected: boolean;
  unreadCount: number;
  lastActivity: string;
  urgentCount: number;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectedEmail?: string;
}

const CommunicationProviderIcons: React.FC<CommunicationProviderIconsProps> = ({ projectId }) => {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CommunicationProvider | null>(null);
  const [providers, setProviders] = useState<UIProvider[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  // Icon mapping for providers
  const getProviderIcon = (providerId: string): React.ComponentType<{ className?: string }> => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      outlook: Mail,
      teams: MessageSquare,
      zoom: Video,
      slack: Slack,
      whatsapp: Phone
    };
    return iconMap[providerId] || Mail;
  };

  // Color mapping for providers
  const getProviderColor = (providerId: string): string => {
    const colorMap: Record<string, string> = {
      outlook: 'bg-blue-600 hover:bg-blue-700',
      teams: 'bg-purple-600 hover:bg-purple-700',
      zoom: 'bg-blue-500 hover:bg-blue-600',
      slack: 'bg-green-600 hover:bg-green-700',
      whatsapp: 'bg-green-500 hover:bg-green-600'
    };
    return colorMap[providerId] || 'bg-gray-600 hover:bg-gray-700';
  };

  // Load providers from service
  const loadProviders = () => {
    const serviceProviders = communicationSetup.getProviders();
    const uiProviders: UIProvider[] = serviceProviders.map(provider => ({
      id: provider.id,
      name: provider.name,
      icon: getProviderIcon(provider.id),
      color: getProviderColor(provider.id),
      connected: provider.isConnected,
      unreadCount: provider.unreadCount,
      lastActivity: provider.lastSync || (provider.isConnected ? 'Connected' : 'Not connected'),
      urgentCount: Math.floor(provider.unreadCount * 0.2), // 20% are urgent
      status: provider.status,
      connectedEmail: provider.connectedEmail
    }));
    setProviders(uiProviders);
  };

  // Initialize providers on mount
  useEffect(() => {
    loadProviders();
  }, []);

  // Handle provider connection
  const handleConnect = async (providerId: string) => {
    try {
      setIsConnecting(providerId);
      await communicationSetup.connectProvider(providerId);
      loadProviders();
      setSetupDialogOpen(false);
      toast({
        title: "Connected Successfully",
        description: `${selectedProvider?.name} has been connected to your account.`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect provider",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  // Handle provider disconnection
  const handleDisconnect = async (providerId: string) => {
    try {
      await communicationSetup.disconnectProvider(providerId);
      loadProviders();
      toast({
        title: "Disconnected",
        description: `Provider has been disconnected from your account.`,
      });
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect provider",
        variant: "destructive",
      });
    }
  };

  // Handle provider setup dialog
  const handleProviderSetup = (providerId: string) => {
    const serviceProviders = communicationSetup.getProviders();
    const provider = serviceProviders.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setSetupDialogOpen(true);
    }
  };

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
                  onClick={() => provider.connected ? handleProviderClick(provider.id) : handleProviderSetup(provider.id)}
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
      
      {/* Provider Setup Dialog */}
      <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Setup {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Connect your {selectedProvider?.name} account to enable communication features.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="space-y-6">
              {/* Provider Features */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProvider.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Setup Instructions */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Setup Instructions</h3>
                <div className="space-y-2">
                  {selectedProvider.setupInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </div>
                      {instruction}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Connection Status */}
              {selectedProvider.isConnected && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Already Connected</span>
                  </div>
                  {selectedProvider.connectedEmail && (
                    <p className="text-sm text-green-700 mt-1">
                      Connected as: {selectedProvider.connectedEmail}
                    </p>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSetupDialogOpen(false)}
                >
                  Cancel
                </Button>
                
                <div className="flex items-center gap-2">
                  {selectedProvider.isConnected && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDisconnect(selectedProvider.id)}
                      className="mr-2"
                    >
                      Disconnect
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => handleConnect(selectedProvider.id)}
                    disabled={isConnecting === selectedProvider.id}
                    className="flex items-center gap-2"
                  >
                    {isConnecting === selectedProvider.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    {selectedProvider.isConnected ? 'Reconnect' : 'Connect Account'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunicationProviderIcons;

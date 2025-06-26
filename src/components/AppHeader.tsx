
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Users, Mail, FolderOpen, Loader2 } from 'lucide-react';
import { Calendar, MessageCircle, Phone, Video, MessageSquare } from 'lucide-react';
import { Slack } from 'lucide-react';
import { BarChart3, Palette, ClipboardList, HardHat, Leaf, Shield, Scale, DollarSign, Building } from 'lucide-react';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import MotionWrapper from '@/components/MotionWrapper';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useRole } from '@/contexts/RoleContext';
import { useOAuthConnections } from '@/hooks/useOAuthConnections';

interface AppHeaderProps {
  selectedProject: string | null;
  onProjectChange: (projectId: string | null) => void;
  onUploadToggle: () => void;
  onSettingsToggle: () => void;
  onHeroExit: () => void;
}

const categoryIcons = {
  Overview: BarChart3,
  Design: Palette,
  Preconstruction: ClipboardList,
  Construction: HardHat,
  Sustainability: Leaf,
  Safety: Shield,
  Legal: Scale,
  Finance: DollarSign,
  Facilities: Building,
};

const AppHeader: React.FC<AppHeaderProps> = ({
  selectedProject,
  onProjectChange,
  onUploadToggle,
  onSettingsToggle,
  onHeroExit
}) => {
  const { t } = useTranslation();
  const { access } = useRoleBasedAccess();
  const { currentRole, switchRole } = useRole();
  const { connections, connect, getConnectionStatus } = useOAuthConnections();

  return (
    <MotionWrapper animation="slideUp" className="sticky top-0 z-50">
      <header className="border-b border-border/40 glass backdrop-blur-sm">
        {/* Main Header Row */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <MotionWrapper animation="scaleIn" delay={0.1}>
              <h1 className="text-2xl font-bold gradient-text cursor-pointer" onClick={onHeroExit}>
                {t('app.title')}
              </h1>
            </MotionWrapper>
            <MotionWrapper animation="fadeIn" delay={0.2}>
              <ProjectSwitcher 
                selectedProject={selectedProject}
                onProjectChange={onProjectChange}
              />
            </MotionWrapper>
          </div>
          <MotionWrapper animation="fadeIn" delay={0.3}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onUploadToggle}
                className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                title={t('navigation.upload')}
              >
                <Plus className="h-4 w-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              {/* Communication Provider Icons */}
              <div className="flex items-center gap-1 border-l border-border/40 pl-2 ml-2">
                {/* Microsoft Outlook */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      style={{ backgroundColor: getConnectionStatus('outlook').connected ? '#0078d4' : undefined, color: getConnectionStatus('outlook').connected ? 'white' : undefined }}
                      title="Microsoft Outlook"
                    >
                      {getConnectionStatus('outlook').connecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                      {getConnectionStatus('outlook').connected && (
                        <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Microsoft Outlook</h4>
                        <p className="text-sm text-muted-foreground">
                          Connect your Outlook account to sync emails and calendar events.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getConnectionStatus('outlook').connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm">
                            {getConnectionStatus('outlook').connected ? 'Connected' : 'Not connected'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => connect('outlook')}
                          disabled={getConnectionStatus('outlook').connecting || getConnectionStatus('outlook').connected}
                        >
                          {getConnectionStatus('outlook').connecting ? 'Connecting...' : 
                           getConnectionStatus('outlook').connected ? 'Connected' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Microsoft Teams */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      style={{ backgroundColor: getConnectionStatus('teams').connected ? '#6264a7' : undefined, color: getConnectionStatus('teams').connected ? 'white' : undefined }}
                      title="Microsoft Teams"
                    >
                      {getConnectionStatus('teams').connecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageCircle className="h-4 w-4" />
                      )}
                      {getConnectionStatus('teams').connected && (
                        <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Microsoft Teams</h4>
                        <p className="text-sm text-muted-foreground">
                          Connect to Teams to access chats, meetings, and collaboration.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getConnectionStatus('teams').connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm">
                            {getConnectionStatus('teams').connected ? 'Connected' : 'Not connected'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => connect('teams')}
                          disabled={getConnectionStatus('teams').connecting || getConnectionStatus('teams').connected}
                        >
                          {getConnectionStatus('teams').connecting ? 'Connecting...' : 
                           getConnectionStatus('teams').connected ? 'Connected' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Zoom */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      style={{ backgroundColor: getConnectionStatus('zoom').connected ? '#2D8CFF' : undefined, color: getConnectionStatus('zoom').connected ? 'white' : undefined }}
                      title="Zoom"
                    >
                      {getConnectionStatus('zoom').connecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
                      {getConnectionStatus('zoom').connected && (
                        <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Zoom</h4>
                        <p className="text-sm text-muted-foreground">
                          Connect to Zoom for video conferencing and meeting management.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getConnectionStatus('zoom').connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm">
                            {getConnectionStatus('zoom').connected ? 'Connected' : 'Not connected'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => connect('zoom')}
                          disabled={getConnectionStatus('zoom').connecting || getConnectionStatus('zoom').connected}
                        >
                          {getConnectionStatus('zoom').connecting ? 'Connecting...' : 
                           getConnectionStatus('zoom').connected ? 'Connected' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Slack */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      style={{ backgroundColor: getConnectionStatus('slack').connected ? '#4A154B' : undefined, color: getConnectionStatus('slack').connected ? 'white' : undefined }}
                      title="Slack"
                    >
                      {getConnectionStatus('slack').connecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Slack className="h-4 w-4" />
                      )}
                      {getConnectionStatus('slack').connected && (
                        <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Slack</h4>
                        <p className="text-sm text-muted-foreground">
                          Connect to Slack for team communication and notifications.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getConnectionStatus('slack').connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm">
                            {getConnectionStatus('slack').connected ? 'Connected' : 'Not connected'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => connect('slack')}
                          disabled={getConnectionStatus('slack').connecting || getConnectionStatus('slack').connected}
                        >
                          {getConnectionStatus('slack').connecting ? 'Connecting...' : 
                           getConnectionStatus('slack').connected ? 'Connected' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* WhatsApp */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      style={{ backgroundColor: getConnectionStatus('whatsapp').connected ? '#25D366' : undefined, color: getConnectionStatus('whatsapp').connected ? 'white' : undefined }}
                      title="WhatsApp Business"
                    >
                      {getConnectionStatus('whatsapp').connecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                      {getConnectionStatus('whatsapp').connected && (
                        <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">WhatsApp Business</h4>
                        <p className="text-sm text-muted-foreground">
                          Connect WhatsApp Business for client communication.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getConnectionStatus('whatsapp').connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm">
                            {getConnectionStatus('whatsapp').connected ? 'Connected' : 'Not connected'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => connect('whatsapp')}
                          disabled={getConnectionStatus('whatsapp').connecting || getConnectionStatus('whatsapp').connected}
                        >
                          {getConnectionStatus('whatsapp').connecting ? 'Connecting...' : 
                           getConnectionStatus('whatsapp').connected ? 'Connected' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {selectedProject && access.canManageUsers && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                  onClick={() => window.open(`/settings/access/${selectedProject}`, '_blank')}
                  title="Project Access Settings"
                >
                  <Users className="h-4 w-4" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                onClick={onSettingsToggle}
                title={t('navigation.settings')}
              >
                <Settings className="h-4 w-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <ThemeToggle />
            </div>
          </MotionWrapper>
        </div>
        
        {/* Category Tabs - Seamlessly integrated */}
        <div className="border-t border-border/20 bg-background/50">
          <div className="flex overflow-x-auto scrollbar-hide px-6">
            {Object.entries(categoryIcons).map(([category, Icon]) => {
              const isActive = currentRole === category;
              
              return (
                <button
                  key={category}
                  onClick={() => switchRole(category as any)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap relative
                    ${isActive 
                      ? 'text-primary bg-primary/5' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{category === 'Legal' ? 'Legal & Insurance' : category}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </MotionWrapper>
  );
};

export default AppHeader;


import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Users, Mail, FolderOpen, Loader2 } from 'lucide-react';
import { Calendar, MessageCircle, Phone, Video, MessageSquare } from 'lucide-react';
import { Slack } from 'lucide-react';
import { BarChart3, MapPin, Palette, ClipboardList, HardHat, Leaf, Shield, Scale, DollarSign, Building, ShoppingCart } from 'lucide-react';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import MotionWrapper from '@/components/MotionWrapper';
import CommunicationHub from '@/components/communications/CommunicationHub';
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
  'Division 1': Shield,
  Overview: BarChart3,
  Planning: MapPin,
  Procurement: ShoppingCart,
  Design: Palette,
  Preconstruction: ClipboardList,
  Construction: HardHat,
  Sustainability: Leaf,
  Legal: Scale,
  Finance: DollarSign,
  Facilities: Building,
};

// Map UI category names to actual role names
const categoryToRoleMap: Record<string, string> = {
  'Division 1': 'Executive',
  Overview: 'Executive',
  Planning: 'Executive',
  Procurement: 'Executive',
  Design: 'Preconstruction',
  Preconstruction: 'Preconstruction',
  Construction: 'Construction',
  Sustainability: 'Sustainability',
  Legal: 'Legal',
  Finance: 'Finance',
  Facilities: 'Facilities',
};

// Map role names back to categories for active state
// Note: Design maps to Preconstruction role but should show DesignDashboard
const roleToCategoryMap: Record<string, string[]> = {
  Executive: ['Overview', 'Planning', 'Procurement'],
  Preconstruction: ['Design', 'Preconstruction'],
  Construction: ['Construction'],
  Sustainability: ['Sustainability'],
  Legal: ['Legal'],
  Finance: ['Finance'],
  Facilities: ['Facilities'],
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
  const [showCommunications, setShowCommunications] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>('outlook');
  const [activeCategory, setActiveCategory] = useState<string>('Overview');

  // Initialize activeCategory from sessionStorage on mount
  useEffect(() => {
    const storedCategory = sessionStorage.getItem('activeCategory');
    if (storedCategory) {
      setActiveCategory(storedCategory);
    } else {
      // Set default to Overview and store it
      sessionStorage.setItem('activeCategory', 'Overview');
      setActiveCategory('Overview');
    }
  }, []);

  return (
    <MotionWrapper animation="slideUp" className="sticky top-0 z-50">
      <header className="border-b border-border/40 bg-[#1A2B49] text-white backdrop-blur-sm dark:glass light:bg-[#1A2B49] light:text-white">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                  style={{ backgroundColor: getConnectionStatus('outlook').connected ? '#0078d4' : undefined, color: getConnectionStatus('outlook').connected ? 'white' : undefined }}
                  title="Microsoft Outlook"
                  onClick={() => {
                    if (getConnectionStatus('outlook').connected) {
                      setActiveProvider('outlook');
                      setShowCommunications(true);
                    } else {
                      connect('outlook');
                    }
                  }}
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
                
                {/* Microsoft Teams */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                    style={{ 
                      backgroundColor: getConnectionStatus('teams').connected ? '#6264a7' : undefined, 
                      color: getConnectionStatus('teams').connected ? 'white' : undefined,
                      boxShadow: getConnectionStatus('teams').connected ? '0 0 10px rgba(98, 100, 167, 0.3)' : undefined
                    }}
                  title="Microsoft Teams"
                  onClick={() => {
                    if (getConnectionStatus('teams').connected) {
                      setActiveProvider('teams');
                      setShowCommunications(true);
                    } else {
                      connect('teams');
                    }
                  }}
                >
                  {getConnectionStatus('teams').connecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                  {getConnectionStatus('teams').connected && (
                    <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                  )}
                  {getConnectionStatus('teams').connected && (
                    <Badge className="absolute -top-1 -left-1 h-4 w-4 p-0 bg-red-500 text-xs text-white">5</Badge>
                  )}
                </Button>
                
                {/* Zoom */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                  style={{ backgroundColor: getConnectionStatus('zoom').connected ? '#2D8CFF' : undefined, color: getConnectionStatus('zoom').connected ? 'white' : undefined }}
                  title="Zoom"
                  onClick={() => {
                    if (getConnectionStatus('zoom').connected) {
                      setActiveProvider('zoom');
                      setShowCommunications(true);
                    } else {
                      connect('zoom');
                    }
                  }}
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
                
                {/* Slack */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                  style={{ backgroundColor: getConnectionStatus('slack').connected ? '#4A154B' : undefined, color: getConnectionStatus('slack').connected ? 'white' : undefined }}
                  title="Slack"
                  onClick={() => {
                    if (getConnectionStatus('slack').connected) {
                      setActiveProvider('slack');
                      setShowCommunications(true);
                    } else {
                      connect('slack');
                    }
                  }}
                >
                  {getConnectionStatus('slack').connecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Slack className="h-4 w-4" />
                  )}
                  {getConnectionStatus('slack').connected && (
                    <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                  )}
                  {getConnectionStatus('slack').connected && (
                    <Badge className="absolute -top-1 -left-1 h-4 w-4 p-0 bg-red-500 text-xs text-white">12</Badge>
                  )}
                </Button>
                
                {/* WhatsApp */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                  style={{ backgroundColor: getConnectionStatus('whatsapp').connected ? '#25D366' : undefined, color: getConnectionStatus('whatsapp').connected ? 'white' : undefined }}
                  title="WhatsApp Business"
                  onClick={() => {
                    if (getConnectionStatus('whatsapp').connected) {
                      setActiveProvider('whatsapp');
                      setShowCommunications(true);
                    } else {
                      connect('whatsapp');
                    }
                  }}
                >
                  {getConnectionStatus('whatsapp').connecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                  {getConnectionStatus('whatsapp').connected && (
                    <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                  )}
                  {getConnectionStatus('whatsapp').connected && (
                    <Badge className="absolute -top-1 -left-1 h-4 w-4 p-0 bg-red-500 text-xs text-white">2</Badge>
                  )}
                </Button>
                
                {/* Calendar */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                  style={{ backgroundColor: '#0078d4', color: 'white' }}
                  title="Calendar"
                  onClick={() => {
                    setActiveProvider('calendar');
                    setShowCommunications(true);
                  }}
                >
                  <Calendar className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
                </Button>
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
              const isActive = activeCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => {
                    const targetRole = categoryToRoleMap[category] || category;
                    console.log('===== TAB CLICK START =====');
                    console.log('AppHeader: Clicking category:', category, 'mapping to role:', targetRole);
                    console.log('AppHeader: Current activeCategory before change:', activeCategory);
                    console.log('AppHeader: Current sessionStorage before change:', sessionStorage.getItem('activeCategory'));
                    
                    setActiveCategory(category);
                    sessionStorage.setItem('activeCategory', category);
                    
                    console.log('AppHeader: Updated activeCategory to:', category);
                    console.log('AppHeader: Updated sessionStorage to:', sessionStorage.getItem('activeCategory'));
                    
                    // Dispatch custom event for immediate Dashboard update
                    window.dispatchEvent(new CustomEvent('activeCategoryChange', { detail: category }));
                    console.log('AppHeader: Dispatched activeCategoryChange event with detail:', category);
                    
                    console.log('AppHeader: About to call switchRole with:', targetRole);
                    switchRole(targetRole as any);
                    console.log('===== TAB CLICK END =====');
                  }}
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
            {/* Remove Portfolio and Communications buttons - these were causing navigation issues */}
          </div>
        </div>
      </header>
      
      {/* Communication Hub Modal */}
      <CommunicationHub 
        isOpen={showCommunications}
        onClose={() => setShowCommunications(false)}
        initialProvider={activeProvider}
      />
    </MotionWrapper>
  );
};

export default AppHeader;


import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Plus, FolderOpen, Users, Mail, Phone, Slack, MessageCircle } from 'lucide-react';
import { BarChart3, Palette, ClipboardList, HardHat, Leaf, Shield, Scale, DollarSign, Building } from 'lucide-react';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import MotionWrapper from '@/components/MotionWrapper';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useRole } from '@/contexts/RoleContext';

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
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                title={t('navigation.projects')}
              >
                <FolderOpen className="h-4 w-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              {/* Communication Provider Icons */}
              <div className="flex items-center gap-1 border-l border-border/40 pl-2 ml-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      title="Email Communications"
                    >
                      <Mail className="h-4 w-4" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Email Communications</h3>
                      <p className="text-sm text-gray-600">Manage your email communications and notifications.</p>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      title="Microsoft Teams"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Microsoft Teams</h3>
                      <p className="text-sm text-gray-600">Connect with your team and manage project communications.</p>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      title="Slack Communications"
                    >
                      <Slack className="h-4 w-4" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Slack Integration</h3>
                      <p className="text-sm text-gray-600">Sync with Slack channels and manage team conversations.</p>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 hover:shadow-glow-md hover:scale-105"
                      title="Phone Communications"
                    >
                      <Phone className="h-4 w-4" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Phone & Voice</h3>
                      <p className="text-sm text-gray-600">Access call logs and voice communication features.</p>
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

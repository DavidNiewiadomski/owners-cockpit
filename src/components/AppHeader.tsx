
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Settings, Plus, FolderOpen, Users } from 'lucide-react';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
// import RoleToggle from '@/components/RoleToggle';
import MotionWrapper from '@/components/MotionWrapper';
import CommunicationProviderIcons from '@/components/communications/CommunicationProviderIcons';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useRole } from '@/contexts/RoleContext';
import { Crown, ClipboardList, HardHat, Building, Leaf, Scale, DollarSign } from 'lucide-react';

interface AppHeaderProps {
  selectedProject: string | null;
  onProjectChange: (projectId: string | null) => void;
  onUploadToggle: () => void;
  onSettingsToggle: () => void;
  onHeroExit: () => void;
}

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

  const roleIcons = {
    Executive: Crown,
    Preconstruction: ClipboardList,
    Construction: HardHat,
    Facilities: Building,
    Sustainability: Leaf,
    Legal: Scale,
    Finance: DollarSign,
  };

  const roles = [
    { key: 'Executive', label: 'Executive' },
    { key: 'Design', label: 'Design' },
    { key: 'Preconstruction', label: 'Preconstruction' },
    { key: 'Construction', label: 'Construction' },
    { key: 'Sustainability', label: 'Sustainability' },
    { key: 'Legal', label: 'Legal & Insurance' },
    { key: 'Finance', label: 'Finance' },
    { key: 'Facilities', label: 'Facilities' }
  ];

  return (
    <MotionWrapper animation="slideUp" className="sticky top-0 z-50">
      <header className="border-b border-border/40 glass backdrop-blur-sm">
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
        
        {/* Role Tabs - Center */}
        <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-lg p-1 border border-border/50">
          {roles.map((role) => {
            const Icon = roleIcons[role.key as keyof typeof roleIcons];
            const isActive = currentRole === role.key;
            return (
              <Button
                key={role.key}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => switchRole(role.key as any)}
                className={`
                  relative h-8 px-3 text-xs font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }
                `}
              >
                {Icon && <Icon className="h-3 w-3 mr-1" />}
                {role.label}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-md" />
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Communication Provider Icons - Right */}
          {selectedProject && (
            <MotionWrapper animation="fadeIn" delay={0.2}>
              <CommunicationProviderIcons projectId={selectedProject} />
            </MotionWrapper>
          )}
          
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
                onClick={() => onProjectChange('portfolio')}
                title={t('navigation.projects')}
              >
                <FolderOpen className="h-4 w-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
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
      </header>
    </MotionWrapper>
  );
};

export default AppHeader;

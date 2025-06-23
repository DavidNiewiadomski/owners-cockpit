
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Settings, Plus, FolderOpen, Users } from 'lucide-react';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import RoleToggle from '@/components/RoleToggle';
import MotionWrapper from '@/components/MotionWrapper';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

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
          <MotionWrapper animation="fadeIn" delay={0.3}>
            <div className="flex items-center gap-2">
              <RoleToggle variant="compact" />
              <Button
                variant="ghost"
                size="icon"
                onClick={onUploadToggle}
                className="neumorphic-button hover:scale-105 transition-transform"
                title={t('navigation.upload')}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="neumorphic-button hover:scale-105 transition-transform"
                title={t('navigation.projects')}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
              {selectedProject && access.canManageUsers && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="neumorphic-button hover:scale-105 transition-transform"
                  onClick={() => window.open(`/settings/access/${selectedProject}`, '_blank')}
                  title="Project Access Settings"
                >
                  <Users className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="neumorphic-button hover:scale-105 transition-transform"
                onClick={onSettingsToggle}
                title={t('navigation.settings')}
              >
                <Settings className="h-4 w-4" />
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

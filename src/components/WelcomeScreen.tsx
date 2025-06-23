
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import RoleToggle from '@/components/RoleToggle';
import MotionWrapper from '@/components/MotionWrapper';

interface WelcomeScreenProps {
  selectedProject: string | null;
  onProjectChange: (projectId: string | null) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedProject,
  onProjectChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <MotionWrapper animation="scaleIn" delay={0.2}>
        <Card className="neumorphic-card p-8 text-center max-w-2xl w-full glass">
          <h2 className="text-xl font-semibold mb-4">{t('app.welcome')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('app.selectProject')}
          </p>
          <div className="w-full space-y-4">
            <RoleToggle variant="expanded" />
            <ProjectSwitcher 
              selectedProject={selectedProject}
              onProjectChange={onProjectChange}
            />
          </div>
        </Card>
      </MotionWrapper>
    </div>
  );
};

export default WelcomeScreen;


import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingsAccess from '@/components/SettingsAccess';
import MotionWrapper from '@/components/MotionWrapper';

const SettingsAccessPage: React.FC = () => {
  const { t: _t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <MotionWrapper animation="slideUp">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold gradient-text">
              Project Access Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage user roles and external invitations for this project
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay={0.2}>
          <SettingsAccess projectId={projectId} />
        </MotionWrapper>
      </div>
    </div>
  );
};

export default SettingsAccessPage;

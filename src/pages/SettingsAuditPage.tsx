
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuditLogs from '@/components/AuditLogs';
import MotionWrapper from '@/components/MotionWrapper';

const SettingsAuditPage: React.FC = () => {
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
              Project Audit Trail
            </h1>
            <p className="text-muted-foreground mt-2">
              View and track all actions performed in this project
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay={0.2}>
          <AuditLogs projectId={projectId} />
        </MotionWrapper>
      </div>
    </div>
  );
};

export default SettingsAuditPage;

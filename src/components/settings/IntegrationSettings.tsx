
import React, { useState } from 'react';
import { useRouter } from '@/hooks/useRouter';
import { useProjectIntegrations } from '@/hooks/useProjectIntegrations';
import IntegrationOverview from './integration/IntegrationOverview';
import ConnectedServices from './integration/ConnectedServices';
import SyncSettings from './integration/SyncSettings';

const IntegrationSettings: React.FC = () => {
  const router = useRouter();
  const [selectedProject] = useState('project-1'); // This would come from context
  
  // For demo purposes, let's try to get the first actual project from the database
  // But still use the hook to fetch integrations - it should handle the demo case
  const { data: integrations, isLoading, error } = useProjectIntegrations(selectedProject);

  const handleViewIntegrations = () => {
    if (selectedProject) {
      router.push(`/projects/${selectedProject}/integrations`);
    }
  };

  return (
    <div className="space-y-6">
      <IntegrationOverview onViewIntegrations={handleViewIntegrations} />
      <ConnectedServices 
        integrations={integrations}
        isLoading={isLoading}
        error={error}
      />
      <SyncSettings />
    </div>
  );
};

export default IntegrationSettings;

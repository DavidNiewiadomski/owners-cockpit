
import React, { useState } from 'react';
import { useRouter } from '@/hooks/useRouter';
import { useProjectIntegrations } from '@/hooks/useProjectIntegrations';
import IntegrationOverview from './integration/IntegrationOverview';
import ConnectedServices from './integration/ConnectedServices';
import SyncSettings from './integration/SyncSettings';

const IntegrationSettings: React.FC = () => {
  const router = useRouter();
  // Map the demo project to an actual project ID that exists in the database
  const demoProjectId = '11111111-1111-1111-1111-111111111111';
  const [selectedProject] = useState(demoProjectId);
  
  const { data: integrations, isLoading, error } = useProjectIntegrations(selectedProject);

  const handleViewIntegrations = () => {
    if (selectedProject) {
      router.push(`/projects/project-1/integrations`);
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

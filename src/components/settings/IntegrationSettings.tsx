
import React, { useState } from 'react';
import { useProjectIntegrations } from '@/hooks/useProjectIntegrations';
import ConnectedServices from './integration/ConnectedServices';
import SyncSettings from './integration/SyncSettings';

const IntegrationSettings: React.FC = () => {
  // Map the demo project to an actual project ID that exists in the database
  // This should match the Downtown Office Building project ID
  const demoProjectId = 'aa2e669f-c1e4-4da6-a705-c2fb776d64ec';
  const [selectedProject] = useState(demoProjectId);
  
  const { data: integrations, isLoading, error } = useProjectIntegrations(selectedProject);

  return (
    <div className="space-y-6">
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


import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectIntegrations } from '@/hooks/useProjectIntegrations';
import IntegrationCard from '@/components/integrations/IntegrationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const AVAILABLE_PROVIDERS = ['procore', 'primavera', 'box', 'iot_sensors', 'smartsheet'] as const;

const IntegrationsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: integrations, isLoading, error } = useProjectIntegrations(projectId || '');

  if (!projectId) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>No project selected</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error Loading Integrations
            </CardTitle>
            <CardDescription>
              Failed to load project integrations. Please try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Create a map of existing integrations by provider
  const integrationMap = new Map(
    (integrations || []).map(integration => [integration.provider, integration])
  );

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect external data sources to sync project information automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_PROVIDERS.map(provider => (
          <IntegrationCard
            key={provider}
            provider={provider}
            projectId={projectId}
            integration={integrationMap.get(provider)}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;

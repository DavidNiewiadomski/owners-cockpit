
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlugZap, ExternalLink } from 'lucide-react';

interface IntegrationOverviewProps {
  onViewIntegrations: () => void;
}

const IntegrationOverview: React.FC<IntegrationOverviewProps> = ({ onViewIntegrations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlugZap className="h-5 w-5" />
          Integration Overview
        </CardTitle>
        <CardDescription>
          Manage your external service connections and data synchronization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              View and configure all project integrations in the dedicated integrations page
            </p>
          </div>
          <Button onClick={onViewIntegrations}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Integrations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationOverview;

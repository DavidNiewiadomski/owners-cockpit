
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  PlugZap, 
  ExternalLink, 
  Settings as SettingsIcon, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from '@/hooks/useRouter';

const IntegrationSettings: React.FC = () => {
  const router = useRouter();
  const [selectedProject] = useState('project-1'); // This would come from context

  const handleViewIntegrations = () => {
    if (selectedProject) {
      router.push(`/projects/${selectedProject}/integrations`);
    }
  };

  const integrations = [
    {
      id: 'procore',
      name: 'Procore',
      description: 'Construction management platform',
      status: 'connected',
      lastSync: '2 hours ago',
      enabled: true
    },
    {
      id: 'primavera',
      name: 'Primavera P6',
      description: 'Project scheduling and management',
      status: 'error',
      lastSync: '1 day ago',
      enabled: false,
      error: 'Authentication failed'
    },
    {
      id: 'box',
      name: 'Box',
      description: 'Cloud storage and file sharing',
      status: 'connected',
      lastSync: '30 minutes ago',
      enabled: true
    },
    {
      id: 'smartsheet',
      name: 'Smartsheet',
      description: 'Collaborative work management',
      status: 'not_connected',
      lastSync: 'Never',
      enabled: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Not Connected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
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
            <Button onClick={handleViewIntegrations}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Integrations
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>
            Quick overview of your active integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(integration.status)}
                  <div>
                    <h4 className="text-sm font-medium">{integration.name}</h4>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                    {integration.error && (
                      <p className="text-xs text-red-500 mt-1">{integration.error}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {getStatusBadge(integration.status)}
                    <p className="text-xs text-muted-foreground mt-1">
                      Last sync: {integration.lastSync}
                    </p>
                  </div>
                  <Switch checked={integration.enabled} />
                  <Button variant="ghost" size="sm">
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>
            Configure how and when data is synchronized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Auto-sync</label>
              <p className="text-xs text-muted-foreground">
                Automatically sync data every hour
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Sync Notifications</label>
              <p className="text-xs text-muted-foreground">
                Get notified when sync completes or fails
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Retry Failed Syncs</label>
              <p className="text-xs text-muted-foreground">
                Automatically retry failed synchronizations
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;

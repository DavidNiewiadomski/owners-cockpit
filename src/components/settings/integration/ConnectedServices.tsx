
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  PlugZap, 
  Settings as SettingsIcon, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { ProjectIntegration } from '@/hooks/useProjectIntegrations';
import { formatDistanceToNow } from 'date-fns';

const PROVIDER_NAMES = {
  procore: 'Procore',
  primavera: 'Primavera P6',
  box: 'Box',
  iot_sensors: 'IoT Sensors',
  smartsheet: 'Smartsheet',
  green_badger: 'Green Badger',
  billy: 'Billy',
  clearstory: 'Clearstory',
  track3d: 'Track3D'
};

const PROVIDER_DESCRIPTIONS = {
  procore: 'Construction management platform',
  primavera: 'Project scheduling and management',
  box: 'Cloud storage and file sharing',
  iot_sensors: 'Building sensors and monitoring',
  smartsheet: 'Collaborative work management',
  green_badger: 'Sustainability tracking and reporting',
  billy: 'Insurance management for construction',
  clearstory: 'Construction data analytics',
  track3d: 'AI-powered construction progress tracking'
};

interface ConnectedServicesProps {
  integrations?: ProjectIntegration[];
  isLoading: boolean;
  error: any;
}

const ConnectedServices: React.FC<ConnectedServicesProps> = ({ integrations, isLoading, error }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <Clock className="h-4 w-4 text-blue-500" />;
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
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>;
      default:
        return <Badge variant="secondary">Not Connected</Badge>;
    }
  };

  const getLastSyncText = (lastSync?: string) => {
    if (!lastSync) return 'Never';
    
    try {
      return formatDistanceToNow(new Date(lastSync), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div>
              <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
              <div className="w-32 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
            <div className="w-8 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-8 text-muted-foreground">
      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-red-500" />
      <p>Unable to load integrations</p>
      <p className="text-sm">Click "Open Integrations" to get started</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8 text-muted-foreground">
      <PlugZap className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>No integrations configured yet</p>
      <p className="text-sm">Click "Open Integrations" to get started</p>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-4">
      {integrations!.map((integration) => (
        <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(integration.status)}
            <div>
              <h4 className="text-sm font-medium">
                {PROVIDER_NAMES[integration.provider] || integration.provider}
              </h4>
              <p className="text-xs text-muted-foreground">
                {PROVIDER_DESCRIPTIONS[integration.provider] || 'External service integration'}
              </p>
              {integration.sync_error && (
                <p className="text-xs text-red-500 mt-1">{integration.sync_error}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              {getStatusBadge(integration.status)}
              <p className="text-xs text-muted-foreground mt-1">
                Last sync: {getLastSyncText(integration.last_sync)}
              </p>
            </div>
            <Switch checked={integration.status === 'connected'} />
            <Button variant="ghost" size="sm">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (error) return renderErrorState();
    if (!integrations || integrations.length === 0) return renderEmptyState();
    return renderIntegrations();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Services</CardTitle>
        <CardDescription>
          Quick overview of your active integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ConnectedServices;

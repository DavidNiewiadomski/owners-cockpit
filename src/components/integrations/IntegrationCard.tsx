
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Settings, Plug, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ProjectIntegration, useSyncIntegration, useDeleteIntegration } from '@/hooks/useProjectIntegrations';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { formatDistanceToNow } from 'date-fns';
import IntegrationModal from './IntegrationModal';

interface IntegrationCardProps {
  integration?: ProjectIntegration;
  provider: 'procore' | 'primavera' | 'box' | 'iot_sensors' | 'smartsheet';
  projectId: string;
}

const PROVIDER_CONFIG = {
  procore: {
    name: 'Procore',
    logo: '🏗️',
    description: 'Construction management platform',
    authType: 'oauth' as const,
  },
  primavera: {
    name: 'Primavera P6',
    logo: '📊',
    description: 'Project portfolio management',
    authType: 'api_key' as const,
  },
  box: {
    name: 'Box',
    logo: '📁',
    description: 'Cloud file storage',
    authType: 'oauth' as const,
  },
  iot_sensors: {
    name: 'IoT Sensors',
    logo: '📡',
    description: 'Building sensors and monitoring',
    authType: 'api_key' as const,
  },
  smartsheet: {
    name: 'Smartsheet',
    logo: '📋',
    description: 'Work management platform',
    authType: 'api_key' as const,
  },
};

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  provider,
  projectId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { access, currentRole } = useRoleBasedAccess();
  const syncMutation = useSyncIntegration();
  const deleteMutation = useDeleteIntegration();
  
  const config = PROVIDER_CONFIG[provider];
  const isConnected = integration?.status === 'connected';
  const hasError = integration?.status === 'error';
  const isSyncing = integration?.status === 'syncing';

  const canManageIntegrations = access.canEditData || 
    ['Executive', 'Construction', 'Facilities'].includes(currentRole);

  const handleSync = async () => {
    if (!integration) return;
    
    syncMutation.mutate({
      integrationId: integration.id,
      provider: integration.provider,
    });
  };

  const handleDisconnect = async () => {
    if (!integration) return;
    
    if (confirm(`Are you sure you want to disconnect ${config.name}?`)) {
      deleteMutation.mutate(integration.id);
    }
  };

  const getStatusBadge = () => {
    if (isSyncing) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Syncing
        </Badge>
      );
    }
    
    if (hasError) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    }
    
    if (isConnected) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        <Plug className="w-3 h-3 mr-1" />
        Not Connected
      </Badge>
    );
  };

  const getLastSyncText = () => {
    if (!integration?.last_sync) return 'Never synced';
    
    try {
      return `Last synced ${formatDistanceToNow(new Date(integration.last_sync), { addSuffix: true })}`;
    } catch {
      return 'Last sync unknown';
    }
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{config.logo}</div>
              <div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Last sync info */}
            <p className="text-xs text-muted-foreground">
              {getLastSyncText()}
            </p>
            
            {/* Error message */}
            {hasError && integration?.sync_error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                {integration.sync_error}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-2">
              {isConnected ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSync}
                          disabled={isSyncing || !canManageIntegrations}
                          className="flex-1"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                          Sync Now
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sync data from {config.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!canManageIntegrations}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={deleteMutation.isPending || !canManageIntegrations}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!canManageIntegrations}
                  className="flex-1"
                >
                  <Plug className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              )}
            </div>
            
            {!canManageIntegrations && (
              <p className="text-xs text-muted-foreground">
                You don't have permission to manage integrations
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <IntegrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={provider}
        projectId={projectId}
        existingIntegration={integration}
      />
    </>
  );
};

export default IntegrationCard;

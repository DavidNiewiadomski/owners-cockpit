
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectIntegration, useCreateIntegration, useUpdateIntegration, useTestIntegration } from '@/hooks/useProjectIntegrations';
import { toast } from 'sonner';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'procore' | 'primavera' | 'onedrive' | 'iot_sensors' | 'smartsheet' | 'green_badger' | 'billy' | 'clearstory' | 'track3d' | 'bim360' | 'microsoft_teams' | 'zoom' | 'outlook';
  projectId: string;
  existingIntegration?: ProjectIntegration;
}

const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  provider,
  projectId,
  existingIntegration,
}) => {
  const [formData, setFormData] = useState({
    apiKey: existingIntegration?.api_key || '',
    refreshToken: existingIntegration?.refresh_token || '',
    config: JSON.stringify(existingIntegration?.config || {}, null, 2),
  });

  const createMutation = useCreateIntegration();
  const updateMutation = useUpdateIntegration();
  const testMutation = useTestIntegration();

  const isEditing = !!existingIntegration;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let config = {};
      if (formData.config.trim()) {
        config = JSON.parse(formData.config);
      }

      const integrationData = {
        project_id: projectId,
        provider,
        status: 'not_connected' as const,
        api_key: formData.apiKey || undefined,
        refresh_token: formData.refreshToken || undefined,
        config,
      };

      // Test the connection first
      const testResult = await testMutation.mutateAsync({
        provider,
        apiKey: formData.apiKey,
        refreshToken: formData.refreshToken,
        config,
      });

      if (!testResult.ok) {
        toast.error(`Connection test failed: ${testResult.error}`);
        return;
      }

      // If test passes, create/update the integration
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: existingIntegration.id,
          ...integrationData,
          status: 'connected',
        });
      } else {
        await createMutation.mutateAsync({
          ...integrationData,
          status: 'connected',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving integration:', error);
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON in configuration');
      } else {
        toast.error('Failed to save integration');
      }
    }
  };

  const handleTestConnection = async () => {
    try {
      let config = {};
      if (formData.config.trim()) {
        config = JSON.parse(formData.config);
      }

      await testMutation.mutateAsync({
        provider,
        apiKey: formData.apiKey,
        refreshToken: formData.refreshToken,
        config,
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON in configuration');
      }
    }
  };

  const getProviderName = () => {
    const names = {
      procore: 'Procore',
      primavera: 'Primavera P6',
      onedrive: 'OneDrive',
      iot_sensors: 'IoT Sensors',
      smartsheet: 'Smartsheet',
      green_badger: 'Green Badger',
      billy: 'Billy',
      clearstory: 'Clearstory',
      track3d: 'Track3D',
      bim360: 'BIM 360',
      microsoft_teams: 'Microsoft Teams',
      zoom: 'Zoom',
      outlook: 'Outlook',
    };
    return names[provider];
  };

  const getProviderInstructions = () => {
    const instructions = {
      procore: 'Enter your Procore API credentials. You can find these in your Procore account settings under API Keys.',
      primavera: 'Enter your Primavera P6 API key and server configuration.',
      onedrive: 'Configure OneDrive integration using OAuth authentication for cloud file access.',
      iot_sensors: 'Enter your IoT sensor API credentials and endpoint configuration.',
      smartsheet: 'Enter your Smartsheet API token. You can generate this in your Smartsheet account settings.',
      green_badger: 'Enter your Green Badger API key. You can find this in your Green Badger account settings under API Access.',
      billy: 'Enter your Billy API credentials. Access these through your Billy dashboard under API Settings.',
      clearstory: 'Configure Clearstory integration using OAuth authentication. You\'ll need to authorize access to your Clearstory data.',
      track3d: 'Enter your Track3D API key and project configuration. Find your API credentials in the Track3D dashboard.',
      bim360: 'Enter your Autodesk BIM 360 API credentials. You can find these in your Autodesk Developer Console.',
      microsoft_teams: 'Configure Microsoft Teams integration using OAuth authentication for team collaboration.',
      zoom: 'Enter your Zoom API credentials. You can generate these in your Zoom Marketplace developer account.',
      outlook: 'Configure Outlook integration using OAuth authentication for email and calendar access.',
    };
    return instructions[provider];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Configure' : 'Connect'} {getProviderName()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {getProviderInstructions()}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="credentials" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter your API key"
                  />
                </div>

                {provider === 'procore' && (
                  <div className="space-y-2">
                    <Label htmlFor="refreshToken">Refresh Token (Optional)</Label>
                    <Input
                      id="refreshToken"
                      type="password"
                      value={formData.refreshToken}
                      onChange={(e) => setFormData(prev => ({ ...prev, refreshToken: e.target.value }))}
                      placeholder="Enter refresh token for OAuth"
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="config" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="config">Configuration (JSON)</Label>
                  <Textarea
                    id="config"
                    value={formData.config}
                    onChange={(e) => setFormData(prev => ({ ...prev, config: e.target.value }))}
                    placeholder='{"endpoint": "https://api.example.com", "version": "v1"}'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional provider-specific configuration in JSON format
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testMutation.isPending || !formData.apiKey}
                className="flex-1"
              >
                {testMutation.isPending ? 'Testing...' : 'Test Connection'}
              </Button>
              
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending || !formData.apiKey}
                className="flex-1"
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? 'Saving...' 
                  : isEditing ? 'Update' : 'Connect'
                }
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationModal;

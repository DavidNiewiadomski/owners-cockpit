
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectIntegrations } from '@/hooks/useProjectIntegrations';
import IntegrationCard from '@/components/integrations/IntegrationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const AVAILABLE_PROVIDERS = ['procore', 'primavera', 'box', 'iot_sensors', 'smartsheet'] as const;

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  projectId
}) => {
  const queryClient = useQueryClient();
  
  // Handle portfolio case - don't load integrations for portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const actualProjectId = isPortfolioView ? '' : (projectId || '');
  
  const { data: integrations, isLoading, error } = useProjectIntegrations(actualProjectId);

  // Set up realtime subscription for live updates (only for actual projects)
  useEffect(() => {
    if (!actualProjectId || isPortfolioView || !isOpen) return;

    console.log('🔄 Setting up realtime subscription for integrations');

    const channel = supabase
      .channel('integrations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_integrations',
          filter: `project_id=eq.${actualProjectId}`
        },
        (payload) => {
          console.log('📡 Integration realtime update:', payload);
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['project-integrations', actualProjectId] });
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [actualProjectId, queryClient, isPortfolioView, isOpen]);

  const renderContent = () => {
    if (isPortfolioView) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Management</CardTitle>
              <CardDescription>
                Integrations are managed at the project level. Please navigate to a specific project to view and configure integrations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    if (!projectId) {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>No project selected</span>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
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
      );
    }

    // Create a map of existing integrations by provider
    const integrationMap = new Map(
      (integrations || []).map(integration => [integration.provider, integration])
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_PROVIDERS.map(provider => (
          <IntegrationCard
            key={provider}
            provider={provider}
            projectId={actualProjectId}
            integration={integrationMap.get(provider)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isPortfolioView ? 'Portfolio Integrations' : 'Integrations'}
          </DialogTitle>
          <p className="text-muted-foreground">
            {isPortfolioView 
              ? 'Select a specific project to view and manage integrations for that project.'
              : 'Connect external data sources to sync project information automatically.'
            }
          </p>
        </DialogHeader>
        
        <div className="mt-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationsModal;

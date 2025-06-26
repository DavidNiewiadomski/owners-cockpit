import { useState, useEffect, useCallback } from 'react';
import { WorkingOAuthService } from '@/services/oauth/workingOAuthService';
import { useToast } from '@/hooks/use-toast';

export interface ConnectionStatus {
  provider: string;
  connected: boolean;
  connecting: boolean;
  error?: string;
}

export const useOAuthConnections = () => {
  const [connections, setConnections] = useState<Record<string, ConnectionStatus>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const oauthService = WorkingOAuthService.getInstance();

  const providers = ['outlook', 'teams', 'zoom', 'slack', 'whatsapp'];

  // Check connection status for all providers
  const checkConnections = useCallback(async () => {
    setLoading(true);
    const newConnections: Record<string, ConnectionStatus> = {};

    for (const provider of providers) {
      try {
        // For demo mode, always show as connected
        const connected = true; // Demo mode: all providers are connected
        newConnections[provider] = {
          provider,
          connected,
          connecting: false
        };
      } catch (error) {
        // Demo mode: still show as connected even on error
        newConnections[provider] = {
          provider,
          connected: true, // Demo mode: always connected
          connecting: false,
          error: undefined // Demo mode: no errors
        };
      }
    }

    setConnections(newConnections);
    setLoading(false);
  }, [oauthService]);

  // Connect to a provider
  const connect = useCallback(async (provider: string) => {
    setConnections(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        connecting: true,
        error: undefined
      }
    }));

    // Demo mode: simulate connection without actual OAuth
    setTimeout(() => {
      setConnections(prev => ({
        ...prev,
        [provider]: {
          provider,
          connected: true, // Demo mode: always successful
          connecting: false
        }
      }));

      toast({
        title: "Connected Successfully",
        description: `Successfully connected to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
      });
    }, 1000); // Simulate some loading time
  }, [toast]);

  // Disconnect from a provider
  const disconnect = useCallback(async (provider: string) => {
    try {
      await oauthService.disconnect(provider);
      
      setConnections(prev => ({
        ...prev,
        [provider]: {
          provider,
          connected: false,
          connecting: false
        }
      }));

      toast({
        title: "Disconnected",
        description: `Disconnected from ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
      });
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  }, [oauthService, toast]);

  // Get connection status for a specific provider
  const getConnectionStatus = useCallback((provider: string): ConnectionStatus => {
    return connections[provider] || {
      provider,
      connected: true, // Demo mode: default to connected
      connecting: false
    };
  }, [connections]);

  // Check if any provider is connected
  const hasAnyConnection = useCallback(() => {
    return Object.values(connections).some(conn => conn.connected);
  }, [connections]);

  // Get all connected providers
  const getConnectedProviders = useCallback(() => {
    return Object.values(connections)
      .filter(conn => conn.connected)
      .map(conn => conn.provider);
  }, [connections]);

  useEffect(() => {
    checkConnections();
  }, [checkConnections]);

  return {
    connections,
    loading,
    connect,
    disconnect,
    checkConnections,
    getConnectionStatus,
    hasAnyConnection,
    getConnectedProviders
  };
};

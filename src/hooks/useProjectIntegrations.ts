
import { useProjectIntegrationsQuery } from './integrations/useProjectIntegrationsQuery';
import { useIntegrationRealtime } from './integrations/useIntegrationRealtime';

export type { ProjectIntegration } from './integrations/useProjectIntegrationsQuery';
export { useCreateIntegration, useUpdateIntegration, useDeleteIntegration } from './integrations/useIntegrationMutations';
export { useTestIntegration, useSyncIntegration } from './integrations/useIntegrationActions';

export function useProjectIntegrations(projectId: string) {
  // Set up realtime subscription
  useIntegrationRealtime(projectId);
  
  // Return the query result
  return useProjectIntegrationsQuery(projectId);
}

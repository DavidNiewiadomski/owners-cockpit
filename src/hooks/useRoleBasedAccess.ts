
import { useRole } from '@/contexts/RoleContext';
import { useMemo } from 'react';

export function useRoleBasedAccess() {
  const { permissions, currentRole, getRoleConfig } = useRole();

  const access = useMemo(() => ({
    // Data access controls
    canViewBudgets: permissions.canViewBudgets,
    canViewTasks: permissions.canViewTasks,
    canViewDocuments: permissions.canViewDocuments,
    canViewMaintenance: permissions.canViewMaintenance,
    canViewSafety: permissions.canViewSafety,
    canViewContracts: permissions.canViewContracts,
    canViewReports: permissions.canViewReports,
    canManageUsers: permissions.canManageUsers,
    canEditData: permissions.canEditData,

    // Derived permissions
    canAccessFinancials: permissions.canViewBudgets || currentRole === 'Finance',
    canAccessOperations: permissions.canViewTasks || permissions.canViewMaintenance,
    canAccessCompliance: permissions.canViewSafety || permissions.canViewContracts,
    
    // Role-specific features
    showExecutiveDashboard: currentRole === 'Executive',
    showConstructionTools: currentRole === 'Construction',
    showFacilitiesTools: currentRole === 'Facilities',
    showSustainabilityMetrics: currentRole === 'Sustainability',
    showLegalDocuments: currentRole === 'Legal',
    showFinancialReports: currentRole === 'Finance',
    showPreconstructionPlanning: currentRole === 'Preconstruction',
  }), [permissions, currentRole]);

  const filterDataByRole = useMemo(() => {
    return (data: any[], dataType: string) => {
      switch (dataType) {
        case 'budget':
          return access.canViewBudgets ? data : [];
        case 'tasks':
          return access.canViewTasks ? data : [];
        case 'documents':
          return access.canViewDocuments ? data : [];
        case 'maintenance':
          return access.canViewMaintenance ? data : [];
        case 'safety':
          return access.canViewSafety ? data : [];
        case 'contracts':
          return access.canViewContracts ? data : [];
        default:
          return data;
      }
    };
  }, [access]);

  const getRoleContextualMessage = useMemo(() => {
    const roleConfig = getRoleConfig(currentRole);
    
    const contextMessages = {
      Executive: "You have access to high-level summaries and strategic insights.",
      Preconstruction: "You can view detailed planning data and pre-construction metrics.",
      Construction: "You have access to active construction data and safety information.",
      Facilities: "You can view detailed maintenance and operational data.",
      Sustainability: "You have access to environmental metrics and sustainability data.",
      Legal: "You can view contract and compliance information.",
      Finance: "You have access to financial data and budget information."
    };

    return contextMessages[currentRole] || "Role-based access applied.";
  }, [currentRole, getRoleConfig]);

  return {
    access,
    currentRole,
    filterDataByRole,
    getRoleContextualMessage,
    roleConfig: getRoleConfig(currentRole),
  };
}

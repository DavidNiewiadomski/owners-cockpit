
export type UserRole = 
  | 'Executive'
  | 'Preconstruction'
  | 'Construction'
  | 'Facilities'
  | 'Sustainability'
  | 'Legal'
  | 'Finance';

export interface RoleState {
  selectedProject?: string;
  filters?: Record<string, any>;
  activeView?: string;
  dashboardConfig?: Record<string, any>;
}

export interface RolePermissions {
  canViewBudgets: boolean;
  canViewTasks: boolean;
  canViewDocuments: boolean;
  canViewMaintenance: boolean;
  canViewSafety: boolean;
  canViewContracts: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canEditData: boolean;
}

export interface RoleConfig {
  name: UserRole;
  displayName: string;
  description: string;
  icon: string;
  permissions: RolePermissions;
  primaryColor: string;
  dashboardLayout: string[];
}

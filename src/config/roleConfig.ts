
import type { RoleConfig, UserRole } from '@/types/roles';

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  Executive: {
    name: 'Executive',
    displayName: 'Executive',
    description: 'High-level oversight and strategic decisions',
    icon: 'crown',
    primaryColor: 'purple',
    permissions: {
      canViewBudgets: true,
      canViewTasks: false,
      canViewDocuments: true,
      canViewMaintenance: false,
      canViewSafety: true,
      canViewContracts: true,
      canViewReports: true,
      canManageUsers: true,
      canEditData: false,
    },
    dashboardLayout: ['overview', 'budget-summary', 'project-status', 'key-metrics']
  },
  Preconstruction: {
    name: 'Preconstruction',
    displayName: 'Preconstruction Manager',
    description: 'Planning, design, and pre-construction activities',
    icon: 'clipboard-list',
    primaryColor: 'blue',
    permissions: {
      canViewBudgets: true,
      canViewTasks: true,
      canViewDocuments: true,
      canViewMaintenance: false,
      canViewSafety: true,
      canViewContracts: true,
      canViewReports: true,
      canManageUsers: false,
      canEditData: true,
    },
    dashboardLayout: ['project-timeline', 'budget-details', 'rfi-tracking', 'document-management']
  },
  Construction: {
    name: 'Construction',
    displayName: 'Construction Manager',
    description: 'Active construction oversight and management',
    icon: 'hard-hat',
    primaryColor: 'orange',
    permissions: {
      canViewBudgets: true,
      canViewTasks: true,
      canViewDocuments: true,
      canViewMaintenance: true,
      canViewSafety: true,
      canViewContracts: false,
      canViewReports: true,
      canManageUsers: false,
      canEditData: true,
    },
    dashboardLayout: ['daily-progress', 'task-management', 'safety-incidents', 'resource-tracking']
  },
  Facilities: {
    name: 'Facilities',
    displayName: 'Facilities Manager',
    description: 'Building operations and maintenance',
    icon: 'building',
    primaryColor: 'green',
    permissions: {
      canViewBudgets: false,
      canViewTasks: true,
      canViewDocuments: true,
      canViewMaintenance: true,
      canViewSafety: true,
      canViewContracts: false,
      canViewReports: true,
      canManageUsers: false,
      canEditData: true,
    },
    dashboardLayout: ['maintenance-schedule', 'facility-status', 'work-orders', 'asset-tracking']
  },
  Sustainability: {
    name: 'Sustainability',
    displayName: 'Sustainability Manager',
    description: 'Environmental impact and sustainability metrics',
    icon: 'leaf',
    primaryColor: 'emerald',
    permissions: {
      canViewBudgets: false,
      canViewTasks: true,
      canViewDocuments: true,
      canViewMaintenance: true,
      canViewSafety: false,
      canViewContracts: false,
      canViewReports: true,
      canManageUsers: false,
      canEditData: true,
    },
    dashboardLayout: ['sustainability-metrics', 'energy-usage', 'waste-tracking', 'compliance-status']
  },
  Legal: {
    name: 'Legal',
    displayName: 'Legal/Contracts',
    description: 'Legal compliance and contract management',
    icon: 'scale',
    primaryColor: 'slate',
    permissions: {
      canViewBudgets: true,
      canViewTasks: false,
      canViewDocuments: true,
      canViewMaintenance: false,
      canViewSafety: true,
      canViewContracts: true,
      canViewReports: true,
      canManageUsers: false,
      canEditData: false,
    },
    dashboardLayout: ['contract-overview', 'compliance-tracking', 'risk-assessment', 'legal-documents']
  },
  Finance: {
    name: 'Finance',
    displayName: 'Finance',
    description: 'Financial oversight and budget management',
    icon: 'dollar-sign',
    primaryColor: 'yellow',
    permissions: {
      canViewBudgets: true,
      canViewTasks: false,
      canViewDocuments: true,
      canViewMaintenance: false,
      canViewSafety: false,
      canViewContracts: true,
      canViewReports: true,
      canManageUsers: false,
      canEditData: true,
    },
    dashboardLayout: ['financial-overview', 'budget-analysis', 'cost-tracking', 'payment-status']
  }
};


export interface ProjectMetrics {
  overallProgress: number;
  budgetUtilization: number;
  workforceCount: number;
  safetyDays: number;
  activeRFIs: number;
  pendingSubmittals: number;
}

export interface SafetyIncident {
  date: string;
  type: string;
  severity: string;
  description: string;
}

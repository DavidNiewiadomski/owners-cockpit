import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for all metric types
export interface FinancialMetrics {
  total_budget: number;
  spent_to_date: number;
  forecasted_cost: number;
  contingency_used: number;
  contingency_remaining: number;
  roi: number;
  npv: number;
  irr: number;
  cost_per_sqft: number;
  market_value: number;
  leasing_projections: number;
}

export interface ConstructionMetrics {
  overall_progress: number;
  days_ahead_behind: number;
  total_workforce: number;
  active_subcontractors: number;
  completed_milestones: number;
  total_milestones: number;
  quality_score: number;
  safety_score: number;
  open_rfis: number;
  pending_submittals: number;
}

export interface ExecutiveMetrics {
  portfolio_value: number;
  stakeholders: number;
  risk_score: number;
  strategic_alignment: number;
  market_position: number;
}

export interface LegalMetrics {
  contracts_active: number;
  contracts_pending: number;
  compliance_score: number;
  permit_status: string;
  legal_risks: number;
  documentation_complete: number;
}

export interface DesignMetrics {
  design_progress: number;
  approved_drawings: number;
  total_drawings: number;
  revision_cycles: number;
  stakeholder_approvals: number;
  design_changes: number;
}

export interface SustainabilityMetrics {
  leed_target: string;
  current_score: number;
  energy_efficiency: number;
  carbon_reduction: number;
  sustainable_materials: number;
  certifications: string[];
}

export interface FacilitiesMetrics {
  operational_readiness: number;
  systems_commissioned: number;
  maintenance_planned: number;
  energy_performance: number;
  occupancy_readiness: number;
}

export interface PlanningMetrics {
  master_plan_approval: number;
  zoning_compliance: number;
  community_engagement: number;
  regulatory_approvals: number;
  feasibility_complete: number;
}

export interface PreconstructionMetrics {
  design_development: number;
  bidding_progress: number;
  contractor_selection: number;
  permit_submissions: number;
  value_engineering: number;
}

export interface MonthlySpend {
  month: string;
  budget: number;
  actual: number;
  forecast: number;
}

export interface CashFlow {
  month: string;
  inflow: number;
  outflow: number;
  cumulative: number;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface Transaction {
  id: string;
  transaction_date: string;
  description: string;
  vendor: string;
  amount: number;
  category: string;
  status: string;
}

export interface DailyProgress {
  progress_date: string;
  planned: number;
  actual: number;
  workforce: number;
}

export interface KPITrend {
  week: string;
  efficiency: number;
  quality: number;
  safety: number;
}

export interface ProjectInsights {
  summary: string;
  key_points: string[];
  recommendations: string[];
  alerts: string[];
}

export interface ProjectTimeline {
  phase: string;
  start_date: string;
  end_date: string;
  status: string;
  progress: number;
}

export interface ProjectTeam {
  project_manager: string;
  architect: string;
  contractor: string;
  owner: string;
}

// Hook for financial metrics
export function useFinancialMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['financial-metrics', projectId],
    queryFn: async (): Promise<FinancialMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_financial_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching financial metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for construction metrics
export function useConstructionMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['construction-metrics', projectId],
    queryFn: async (): Promise<ConstructionMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_construction_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching construction metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for executive metrics
export function useExecutiveMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['executive-metrics', projectId],
    queryFn: async (): Promise<ExecutiveMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_executive_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching executive metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for legal metrics
export function useLegalMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['legal-metrics', projectId],
    queryFn: async (): Promise<LegalMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_legal_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching legal metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for design metrics
export function useDesignMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['design-metrics', projectId],
    queryFn: async (): Promise<DesignMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_design_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching design metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for sustainability metrics
export function useSustainabilityMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['sustainability-metrics', projectId],
    queryFn: async (): Promise<SustainabilityMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_sustainability_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching sustainability metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for facilities metrics
export function useFacilitiesMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['facilities-metrics', projectId],
    queryFn: async (): Promise<FacilitiesMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_facilities_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching facilities metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for planning metrics
export function usePlanningMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['planning-metrics', projectId],
    queryFn: async (): Promise<PlanningMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_planning_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching planning metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for preconstruction metrics
export function usePreconstructionMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['preconstruction-metrics', projectId],
    queryFn: async (): Promise<PreconstructionMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_preconstruction_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching preconstruction metrics:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for monthly spend data
export function useMonthlySpend(projectId: string | null) {
  return useQuery({
    queryKey: ['monthly-spend', projectId],
    queryFn: async (): Promise<MonthlySpend[]> => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_monthly_spend')
        .select('*')
        .eq('project_id', projectId)
        .order('month');

      if (error) {
        console.error('Error fetching monthly spend:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

// Hook for cash flow data
export function useCashFlow(projectId: string | null) {
  return useQuery({
    queryKey: ['cash-flow', projectId],
    queryFn: async (): Promise<CashFlow[]> => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_cash_flow')
        .select('*')
        .eq('project_id', projectId)
        .order('month');

      if (error) {
        console.error('Error fetching cash flow:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

// Hook for cost breakdown data
export function useCostBreakdown(projectId: string | null) {
  return useQuery({
    queryKey: ['cost-breakdown', projectId],
    queryFn: async (): Promise<CostBreakdown[]> => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_cost_breakdown')
        .select('*')
        .eq('project_id', projectId)
        .order('percentage', { ascending: false });

      if (error) {
        console.error('Error fetching cost breakdown:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

// Hook for transactions data
export function useTransactions(projectId: string | null) {
  return useQuery({
    queryKey: ['transactions', projectId],
    queryFn: async (): Promise<Transaction[]> => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_transactions')
        .select('*')
        .eq('project_id', projectId)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

// Hook for daily progress data
export function useDailyProgress(projectId: string | null) {
  return useQuery({
    queryKey: ['daily-progress', projectId],
    queryFn: async (): Promise<DailyProgress[]> => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_daily_progress')
        .select('*')
        .eq('project_id', projectId)
        .order('progress_date', { ascending: false })
        .limit(7);

      if (error) {
        console.error('Error fetching daily progress:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

// Hook for KPI trends data
export function useKPITrends(projectId: string | null) {
  return useQuery({
    queryKey: ['kpi-trends', projectId],
    queryFn: async (): Promise<KPITrend[]> => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_kpi_trends')
        .select('*')
        .eq('project_id', projectId)
        .order('week');

      if (error) {
        console.error('Error fetching KPI trends:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

// Hook for project insights
export function useProjectInsights(projectId: string | null) {
  return useQuery({
    queryKey: ['project-insights', projectId],
    queryFn: async (): Promise<ProjectInsights | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_insights')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project insights:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Hook for project timeline
export function useProjectTimeline(projectId: string | null) {
  return useQuery({
    queryKey: ['project-timeline', projectId],
    queryFn: async (): Promise<ProjectTimeline[]> => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_timeline')
        .select('*')
        .eq('project_id', projectId)
        .order('start_date');

      if (error) {
        console.error('Error fetching project timeline:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

// Hook for project team
export function useProjectTeam(projectId: string | null) {
  return useQuery({
    queryKey: ['project-team', projectId],
    queryFn: async (): Promise<ProjectTeam | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('project_team')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project team:', error);
        return null;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

// Construction-specific data hooks
export function useConstructionDailyProgress(projectId: string | null) {
  return useQuery({
    queryKey: ['construction-daily-progress', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('construction_daily_progress')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching construction daily progress:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useConstructionTradeProgress(projectId: string | null) {
  return useQuery({
    queryKey: ['construction-trade-progress', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('construction_trade_progress')
        .select('*')
        .eq('project_id', projectId)
        .order('floor_level', { ascending: true });
      
      if (error) {
        console.error('Error fetching construction trade progress:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useConstructionActivities(projectId: string | null) {
  return useQuery({
    queryKey: ['construction-activities', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('construction_activities')
        .select('*')
        .eq('project_id', projectId)
        .order('activity_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching construction activities:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useConstructionQualityMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['construction-quality-metrics', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('construction_quality_metrics')
        .select('*')
        .eq('project_id', projectId)
        .order('week_ending', { ascending: true });
      
      if (error) {
        console.error('Error fetching construction quality metrics:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useMaterialDeliveries(projectId: string | null) {
  return useQuery({
    queryKey: ['material-deliveries', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('material_deliveries')
        .select('*')
        .eq('project_id', projectId)
        .order('scheduled_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching material deliveries:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useSafetyMetrics(projectId: string | null) {
  return useQuery({
    queryKey: ['safety-metrics', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('safety_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();
      
      if (error) {
        console.error('Error fetching safety metrics:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!projectId,
  });
}

export function useSafetyIncidents(projectId: string | null) {
  return useQuery({
    queryKey: ['safety-incidents', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('safety_incidents')
        .select('*')
        .eq('project_id', projectId)
        .order('incident_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching safety incidents:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useSafetyTraining(projectId: string | null) {
  return useQuery({
    queryKey: ['safety-training', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('safety_training')
        .select('*')
        .eq('project_id', projectId)
        .order('deadline', { ascending: true });
      
      if (error) {
        console.error('Error fetching safety training:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
  });
}

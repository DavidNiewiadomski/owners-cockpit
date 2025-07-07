import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateKPIData, UpdateKPIData, KPITemplate } from '@/lib/api/performance';
import { performanceAPI, PerformanceScorecard, PerformanceKPI } from '@/lib/api/performance';

// Query keys
const QUERY_KEYS = {
  scorecards: (period?: string) => ['performance', 'scorecards', period],
  companyScorecard: (companyId: string, period?: string) => ['performance', 'company', companyId, period],
  companyKPIs: (companyId: string, period?: string) => ['performance', 'kpis', 'company', companyId, period],
  projectKPIs: (projectId: string, period?: string) => ['performance', 'kpis', 'project', projectId, period],
  kpiTemplates: () => ['performance', 'templates'],
  periods: () => ['performance', 'periods'],
};

// Hook for all company scorecards
export function usePerformanceScorecards(period?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.scorecards(period),
    queryFn: () => performanceAPI.getAllCompanyScorecards(period),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for single company scorecard
export function useCompanyScorecard(companyId: string, period?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.companyScorecard(companyId, period),
    queryFn: () => performanceAPI.getCompanyScorecard(companyId, period),
    select: (data) => data.data,
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for company KPIs
export function useCompanyKPIs(companyId: string, period?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.companyKPIs(companyId, period),
    queryFn: () => performanceAPI.getCompanyKPIs(companyId, period),
    select: (data) => data.data,
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for project KPIs
export function useProjectKPIs(projectId: string, period?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.projectKPIs(projectId, period),
    queryFn: () => performanceAPI.getProjectKPIs(projectId, period),
    select: (data) => data.data,
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for KPI templates
export function useKPITemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.kpiTemplates(),
    queryFn: () => performanceAPI.getKPITemplates(),
    select: (data) => data.data,
    staleTime: 10 * 60 * 1000, // 10 minutes - templates don't change often
  });
}

// Hook for available periods
export function useAvailablePeriods() {
  return useQuery({
    queryKey: QUERY_KEYS.periods(),
    queryFn: () => performanceAPI.getAvailablePeriods(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for performance mutations
export function usePerformanceMutations() {
  const queryClient = useQueryClient();

  const createKPI = useMutation({
    mutationFn: (data: CreateKPIData) => performanceAPI.createKPI(data),
    onSuccess: (result, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['performance'] });
      
      // Update specific queries if possible
      if (variables.company_id) {
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.companyKPIs(variables.company_id, variables.period) 
        });
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.companyScorecard(variables.company_id, variables.period) 
        });
      }
      
      if (variables.project_id) {
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.projectKPIs(variables.project_id, variables.period) 
        });
      }
    },
  });

  const updateKPI = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateKPIData }) => 
      performanceAPI.updateKPI(id, updates),
    onSuccess: () => {
      // Invalidate all performance-related queries since we don't know which company/project
      queryClient.invalidateQueries({ queryKey: ['performance'] });
    },
  });

  const deleteKPI = useMutation({
    mutationFn: (id: string) => performanceAPI.deleteKPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance'] });
    },
  });

  const bulkCreateKPIs = useMutation({
    mutationFn: (kpis: CreateKPIData[]) => performanceAPI.bulkCreateKPIs(kpis),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance'] });
    },
  });

  const createKPITemplate = useMutation({
    mutationFn: (template: Omit<KPITemplate, 'created_at' | 'updated_at'>) => 
      performanceAPI.createKPITemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kpiTemplates() });
    },
  });

  const updateKPITemplate = useMutation({
    mutationFn: ({ metric, updates }: { metric: string; updates: Partial<KPITemplate> }) => 
      performanceAPI.updateKPITemplate(metric, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kpiTemplates() });
      // Also invalidate scorecards since template changes affect calculations
      queryClient.invalidateQueries({ queryKey: ['performance', 'scorecards'] });
    },
  });

  const deleteKPITemplate = useMutation({
    mutationFn: (metric: string) => performanceAPI.deleteKPITemplate(metric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kpiTemplates() });
    },
  });

  return {
    createKPI,
    updateKPI,
    deleteKPI,
    bulkCreateKPIs,
    createKPITemplate,
    updateKPITemplate,
    deleteKPITemplate,
  };
}

// Custom hook for managing performance scorecard state
export function usePerformanceScorecardManager() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Q4-2024');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  const { 
    data: scorecards, 
    isLoading: scorecardsLoading, 
    error: scorecardsError 
  } = usePerformanceScorecards(selectedPeriod);
  
  const { 
    data: periods, 
    isLoading: periodsLoading 
  } = useAvailablePeriods();
  
  const { 
    data: companyScorecard, 
    isLoading: companyLoading 
  } = useCompanyScorecard(selectedCompany || '', selectedPeriod);
  
  const { 
    data: templates, 
    isLoading: templatesLoading 
  } = useKPITemplates();

  const mutations = usePerformanceMutations();

  return {
    // State
    selectedPeriod,
    setSelectedPeriod,
    selectedCompany,
    setSelectedCompany,
    
    // Data
    scorecards: scorecards || [],
    periods: periods || [],
    companyScorecard,
    templates: templates || [],
    
    // Loading states
    isLoading: scorecardsLoading || periodsLoading,
    companyLoading,
    templatesLoading,
    
    // Errors
    error: scorecardsError,
    
    // Mutations
    ...mutations,
  };
}

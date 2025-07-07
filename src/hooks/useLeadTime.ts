import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { LeadTimeFilters, CreateLeadTimeData, UpdateLeadTimeData } from '@/lib/api/leadtime';
import { leadTimeAPI } from '@/lib/api/leadtime';

// Query keys
const QUERY_KEYS = {
  leadTimes: (filters?: LeadTimeFilters) => ['leadTimes', filters],
  leadTime: (id: string) => ['leadTime', id],
  summary: (rfpId?: string) => ['leadTimeSummary', rfpId],
  upcomingDeliveries: (days?: number) => ['upcomingDeliveries', days],
  criticalPath: (rfpId?: string) => ['criticalPath', rfpId],
  vendorLeadTimes: (vendorId: string) => ['vendorLeadTimes', vendorId],
};

// Hook for fetching all lead times with filters
export function useLeadTimes(filters?: LeadTimeFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.leadTimes(filters),
    queryFn: () => leadTimeAPI.getAllLeadTimes(filters),
    select: (data) => data.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for fetching single lead time
export function useLeadTime(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.leadTime(id),
    queryFn: () => leadTimeAPI.getLeadTimeById(id),
    select: (data) => data.data,
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for lead time summary
export function useLeadTimeSummary(rfpId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.summary(rfpId),
    queryFn: () => leadTimeAPI.getLeadTimeSummary(rfpId),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for upcoming deliveries
export function useUpcomingDeliveries(days: number = 30) {
  return useQuery({
    queryKey: QUERY_KEYS.upcomingDeliveries(days),
    queryFn: () => leadTimeAPI.getUpcomingDeliveries(days),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for critical path items
export function useCriticalPath(rfpId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.criticalPath(rfpId),
    queryFn: () => leadTimeAPI.getCriticalPath(rfpId),
    select: (data) => data.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for vendor lead times
export function useVendorLeadTimes(vendorId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.vendorLeadTimes(vendorId),
    queryFn: () => leadTimeAPI.getVendorLeadTimes(vendorId),
    select: (data) => data.data,
    enabled: !!vendorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for lead time mutations
export function useLeadTimeMutations() {
  const queryClient = useQueryClient();

  const createLeadTime = useMutation({
    mutationFn: (data: CreateLeadTimeData) => leadTimeAPI.createLeadTime(data),
    onSuccess: () => {
      // Invalidate and refetch lead times
      queryClient.invalidateQueries({ queryKey: ['leadTimes'] });
      queryClient.invalidateQueries({ queryKey: ['leadTimeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingDeliveries'] });
      queryClient.invalidateQueries({ queryKey: ['criticalPath'] });
    },
  });

  const updateLeadTime = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateLeadTimeData }) =>
      leadTimeAPI.updateLeadTime(id, updates),
    onSuccess: (result, { id }) => {
      // Update the specific lead time in cache
      queryClient.setQueryData(QUERY_KEYS.leadTime(id), { data: result.data });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['leadTimes'] });
      queryClient.invalidateQueries({ queryKey: ['leadTimeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingDeliveries'] });
      queryClient.invalidateQueries({ queryKey: ['criticalPath'] });
    },
  });

  const deleteLeadTime = useMutation({
    mutationFn: (id: string) => leadTimeAPI.deleteLeadTime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadTimes'] });
      queryClient.invalidateQueries({ queryKey: ['leadTimeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingDeliveries'] });
      queryClient.invalidateQueries({ queryKey: ['criticalPath'] });
    },
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      leadTimeAPI.bulkUpdateStatus(ids, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadTimes'] });
      queryClient.invalidateQueries({ queryKey: ['leadTimeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingDeliveries'] });
      queryClient.invalidateQueries({ queryKey: ['criticalPath'] });
    },
  });

  return {
    createLeadTime,
    updateLeadTime,
    deleteLeadTime,
    bulkUpdateStatus,
  };
}

// Custom hook for managing lead time filters
export function useLeadTimeFilters() {
  const [filters, setFilters] = useState<LeadTimeFilters>({});

  const updateFilter = (key: keyof LeadTimeFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const setRfpFilter = (rfpId: string) => {
    setFilters(prev => ({ ...prev, rfp_id: rfpId }));
  };

  const setStatusFilter = (statuses: string[]) => {
    setFilters(prev => ({ ...prev, status: statuses }));
  };

  const setPriorityFilter = (priorities: string[]) => {
    setFilters(prev => ({ ...prev, priority: priorities }));
  };

  const setVendorFilter = (vendorId: string) => {
    setFilters(prev => ({ ...prev, vendor_id: vendorId }));
  };

  const toggleOverdueOnly = () => {
    setFilters(prev => ({ ...prev, overdue_only: !prev.overdue_only }));
  };

  const toggleCriticalOnly = () => {
    setFilters(prev => ({ ...prev, critical_only: !prev.critical_only }));
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    setRfpFilter,
    setStatusFilter,
    setPriorityFilter,
    setVendorFilter,
    toggleOverdueOnly,
    toggleCriticalOnly,
  };
}

// Import useState for the filter hook
import { useState } from 'react';

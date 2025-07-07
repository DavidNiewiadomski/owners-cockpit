import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LevelingVendor {
  submissionId: string;
  vendorName: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  extended: number;
  isAllowance: boolean;
  isOutlier: boolean;
  outlierType: 'low' | 'high' | null;
  outlierSeverity: 'mild' | 'moderate' | 'severe' | null;
  deviationFromMedian: number;
  percentileRank: number;
}

export interface LevelingLineItem {
  groupKey: string;
  description: string;
  csiCode: string;
  itemCount: number;
  statistics: {
    mean: number;
    median: number;
    min: number;
    max: number;
    std: number;
    q1: number;
    q3: number;
    iqr: number;
  };
  vendors: LevelingVendor[];
  hasOutliers: boolean;
  outlierCount: number;
}

export interface LevelingSnapshot {
  id: string;
  rfpId: string;
  analysisDate: string;
  totalSubmissions: number;
  totalLineItems: number;
  matrixData: LevelingLineItem[];
  summaryStats: {
    totalLineItems: number;
    totalOutlierGroups: number;
    totalOutliers: number;
    outlierPercentage: number;
    vendorCount: number;
    baseBidStatistics: {
      mean: number;
      median: number;
      min: number;
      max: number;
      std: number;
    };
    averageItemsPerGroup: number;
  };
  outlierSummary: {
    totalOutliers: number;
    outliersByGroup: Record<string, number>;
    severityLevels: {
      mild: number;
      moderate: number;
      severe: number;
    };
  };
  processingTime: number;
}

export interface VendorBaseBid {
  submissionId: string;
  vendorName: string;
  baseTotal: number;
  allowanceTotal: number;
  adjustedTotal: number;
}

/**
 * Hook to fetch the latest leveling snapshot for an RFP
 */
export function useLevelingSnapshot(rfpId: string) {
  return useQuery({
    queryKey: ['leveling-snapshot', rfpId],
    queryFn: async (): Promise<LevelingSnapshot | null> => {
      if (!rfpId) {
        return null;
      }

      try {
        // First, try to get the latest snapshot from the database
        const { data, error } = await supabase
          .rpc('get_latest_leveling_snapshot', { p_rfp_id: rfpId });

        if (error) {
          console.error('Error fetching leveling snapshot:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('No leveling snapshot found for RFP:', rfpId);
          return null;
        }

        const snapshot = data[0];
        
        return {
          id: snapshot.snapshot_id,
          rfpId: rfpId,
          analysisDate: snapshot.analysis_date,
          totalSubmissions: snapshot.total_submissions,
          totalLineItems: snapshot.total_line_items,
          matrixData: snapshot.matrix_data || [],
          summaryStats: snapshot.summary_stats || {},
          outlierSummary: snapshot.outlier_summary || {},
          processingTime: 0
        };
      } catch (err) {
        console.error('Failed to fetch leveling snapshot:', err);
        throw err;
      }
    },
    enabled: !!rfpId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to trigger leveling analysis for an RFP
 */
export function useLevelingAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      rfpId,
      forceRefresh = false,
      outlierThreshold = 1.5,
      includeDetails = true
    }: {
      rfpId: string;
      forceRefresh?: boolean;
      outlierThreshold?: number;
      includeDetails?: boolean;
    }) => {
      // Call the leveling engine service
      const levelingServiceUrl = process.env.VITE_LEVELING_SERVICE_URL || 'http://localhost:3001';
      
      const response = await fetch(`${levelingServiceUrl}/api/rfp/${rfpId}/level`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          forceRefresh,
          outlierThreshold,
          options: {
            includeDetails
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Leveling analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.snapshot;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the leveling snapshot
      queryClient.invalidateQueries({ queryKey: ['leveling-snapshot', variables.rfpId] });
    },
  });
}

/**
 * Hook to get vendor base bid calculations
 */
export function useVendorBaseBids(matrixData: LevelingLineItem[]): VendorBaseBid[] {
  const vendorTotals: Record<string, VendorBaseBid> = {};

  // Calculate totals from matrix data
  matrixData.forEach(item => {
    item.vendors.forEach(vendor => {
      if (!vendorTotals[vendor.submissionId]) {
        vendorTotals[vendor.submissionId] = {
          submissionId: vendor.submissionId,
          vendorName: vendor.vendorName,
          baseTotal: 0,
          allowanceTotal: 0,
          adjustedTotal: 0
        };
      }

      if (vendor.isAllowance) {
        vendorTotals[vendor.submissionId].allowanceTotal += vendor.extended;
      } else {
        vendorTotals[vendor.submissionId].baseTotal += vendor.extended;
      }
    });
  });

  // Calculate adjusted totals
  Object.values(vendorTotals).forEach(vendor => {
    vendor.adjustedTotal = vendor.baseTotal - vendor.allowanceTotal;
  });

  return Object.values(vendorTotals);
}

/**
 * Hook to request clarifications via the clarification bot
 */
export function useClarificationRequest() {
  return useMutation({
    mutationFn: async ({
      rfpId,
      flaggedItems,
      requestType = 'outlier_clarification'
    }: {
      rfpId: string;
      flaggedItems: Array<{
        groupKey: string;
        description: string;
        vendors: Array<{
          vendorName: string;
          issue: string;
          amount: number;
        }>;
      }>;
      requestType?: string;
    }) => {
      // Call the clarification bot service
      const clarificationServiceUrl = process.env.VITE_CLARIFICATION_SERVICE_URL || 'http://localhost:3002';
      
      const response = await fetch(`${clarificationServiceUrl}/api/clarifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfpId,
          requestType,
          flaggedItems,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Clarification request failed: ${response.statusText}`);
      }

      return response.json();
    },
  });
}

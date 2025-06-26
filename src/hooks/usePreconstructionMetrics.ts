import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PreconstructionMetrics {
  project: {
    name: string;
    location: string;
    type: string;
    budget: number;
    status: string;
    startDate: string;
    estimatedCompletion: string;
  };
  keyMetrics: {
    budgetApproval: number;
    permitProgress: number;
    designCompletion: number;
    contractorSelection: number;
    feasibilityScore: number;
    timeline: string;
  };
  budgetBreakdown: Array<{
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentage: number;
  }>;
  permitStatus: Array<{
    permit: string;
    status: string;
    submittedDate: string;
    expectedApproval: string;
    priority: string;
  }>;
  biddingData: {
    totalBids: number;
    avgBidAmount: number;
    lowestBid: number;
    highestBid: number;
    recommendedContractor: string;
    bids: Array<{
      contractor: string;
      amount: number;
      score: number;
      timeline: string;
      status: string;
    }>;
  };
  scheduleMilestones: Array<{
    milestone: string;
    plannedDate: string;
    actualDate?: string;
    status: string;
    daysVariance: number;
  }>;
  costTrends: Array<{
    month: string;
    budget: number;
    forecast: number;
    actual: number;
  }>;
}

export const usePreconstructionMetrics = (projectId: string) => {
  const [data, setData] = useState<PreconstructionMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreconstructionMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch project data
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        // Fetch preconstruction metrics
        const { data: preconMetrics, error: preconError } = await supabase
          .from('preconstruction_metrics')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (preconError) throw preconError;

        // Fetch budget breakdown
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_breakdown')
          .select('*')
          .eq('project_id', projectId);

        if (budgetError) throw budgetError;

        // Fetch permit status
        const { data: permitData, error: permitError } = await supabase
          .from('permit_status')
          .select('*')
          .eq('project_id', projectId);

        if (permitError) throw permitError;

        // Fetch bidding data
        const { data: biddingData, error: biddingError } = await supabase
          .from('contractor_bids')
          .select('*')
          .eq('project_id', projectId);

        if (biddingError) throw biddingError;

        // Fetch milestones
        const { data: milestones, error: milestonesError } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('target_date', { ascending: true });

        if (milestonesError) throw milestonesError;

        // Fetch cost trends
        const { data: costTrends, error: costError } = await supabase
          .from('budget_tracking')
          .select('*')
          .eq('project_id', projectId)
          .order('month', { ascending: true });

        if (costError) throw costError;

        const metrics = preconMetrics?.[0];
        const totalBids = biddingData?.length || 0;
        const bidAmounts = biddingData?.map(b => b.bid_amount) || [];
        const avgBid = bidAmounts.length > 0 ? bidAmounts.reduce((a, b) => a + b, 0) / bidAmounts.length : 0;
        const lowestBid = bidAmounts.length > 0 ? Math.min(...bidAmounts) : 0;
        const highestBid = bidAmounts.length > 0 ? Math.max(...bidAmounts) : 0;

        // Transform the data
        const preconstructionMetrics: PreconstructionMetrics = {
          project: {
            name: project?.name || 'Unknown Project',
            location: project?.location || 'Unknown Location',
            type: project?.type || 'Unknown Type',
            budget: project?.budget || 0,
            status: project?.status || 'Unknown',
            startDate: project?.start_date || '',
            estimatedCompletion: project?.estimated_completion || ''
          },
          keyMetrics: {
            budgetApproval: metrics?.budget_approval || 0,
            permitProgress: metrics?.permit_progress || 0,
            designCompletion: metrics?.design_completion || 0,
            contractorSelection: metrics?.contractor_selection || 0,
            feasibilityScore: metrics?.feasibility_score || 0,
            timeline: metrics?.timeline_status || 'Unknown'
          },
          budgetBreakdown: budgetData?.map(item => ({
            category: item.category,
            allocated: item.allocated_amount,
            spent: item.spent_amount,
            remaining: item.allocated_amount - item.spent_amount,
            percentage: (item.spent_amount / item.allocated_amount) * 100
          })) || [],
          permitStatus: permitData?.map(item => ({
            permit: item.permit_type,
            status: item.status,
            submittedDate: item.submitted_date,
            expectedApproval: item.expected_approval,
            priority: item.priority
          })) || [],
          biddingData: {
            totalBids: totalBids,
            avgBidAmount: avgBid,
            lowestBid: lowestBid,
            highestBid: highestBid,
            recommendedContractor: biddingData?.find(b => b.recommended)?.contractor_name || 'TBD',
            bids: biddingData?.map(item => ({
              contractor: item.contractor_name,
              amount: item.bid_amount,
              score: item.evaluation_score,
              timeline: item.proposed_timeline,
              status: item.status
            })) || []
          },
          scheduleMilestones: milestones?.map(item => ({
            milestone: item.name,
            plannedDate: item.target_date,
            actualDate: item.actual_date,
            status: item.status,
            daysVariance: item.days_variance || 0
          })) || [],
          costTrends: costTrends?.map(item => ({
            month: item.month,
            budget: item.budgeted_amount,
            forecast: item.forecast_amount,
            actual: item.actual_amount
          })) || []
        };

        setData(preconstructionMetrics);
      } catch (err) {
        console.error('Error fetching preconstruction metrics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchPreconstructionMetrics();
    }
  }, [projectId]);

  return { data, error, loading };
};

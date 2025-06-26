import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExecutiveMetrics {
  portfolioValue: number;
  stakeholders: number;
  riskScore: number;
  strategicAlignment: number;
  marketPosition: number;
  financial: {
    totalBudget: number;
    spentToDate: number;
    roi: number;
    monthlySpend: Array<{
      month: string;
      budget: number;
      actual: number;
      forecast: number;
    }>;
  };
  kpiTrends: Array<{
    week: string;
    efficiency: number;
    quality: number;
    safety: number;
  }>;
  insights: {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
    alerts: string[];
  };
  timeline: Array<{
    phase: string;
    startDate: string;
    endDate: string;
    status: string;
    progress: number;
  }>;
  team: {
    projectManager: string;
    architect: string;
    contractor: string;
    owner: string;
  };
}

export const useExecutiveMetrics = (projectId: string) => {
  const [data, setData] = useState<ExecutiveMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutiveMetrics = async () => {
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

        // Fetch financial data
        const { data: financialData, error: financialError } = await supabase
          .from('financial_metrics')
          .select('*')
          .eq('project_id', projectId)
          .order('date', { ascending: false })
          .limit(1);

        if (financialError) throw financialError;

        // Fetch budget breakdown
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_breakdown')
          .select('*')
          .eq('project_id', projectId);

        if (budgetError) throw budgetError;

        // Fetch KPI trends
        const { data: kpiData, error: kpiError } = await supabase
          .from('project_kpis')
          .select('*')
          .eq('project_id', projectId)
          .order('week', { ascending: true })
          .limit(4);

        if (kpiError) throw kpiError;

        // Fetch team data
        const { data: teamData, error: teamError } = await supabase
          .from('project_team')
          .select('*')
          .eq('project_id', projectId);

        if (teamError) throw teamError;

        // Fetch milestones for timeline
        const { data: milestones, error: milestonesError } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('target_date', { ascending: true });

        if (milestonesError) throw milestonesError;

        // Fetch project insights
        const { data: insights, error: insightsError } = await supabase
          .from('project_insights')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (insightsError) throw insightsError;

        // Calculate budget totals from budget breakdown
        const totalBudget = budgetData?.reduce((sum, item) => sum + (item.allocated_amount || 0), 0) || 0;
        const totalSpent = budgetData?.reduce((sum, item) => sum + (item.spent_amount || 0), 0) || 0;
        const roi = totalBudget > 0 ? ((project?.total_value || 0) - totalBudget) / totalBudget * 100 : 0;

        // Transform the data
        const executiveMetrics: ExecutiveMetrics = {
          portfolioValue: project?.total_value || 0,
          stakeholders: teamData?.length || 0,
          riskScore: project?.risk_score || 0,
          strategicAlignment: project?.strategic_alignment || 0,
          marketPosition: project?.market_position || 0,
          financial: {
            totalBudget: totalBudget,
            spentToDate: totalSpent,
            roi: roi,
            monthlySpend: budgetData?.slice(0, 6).map((item, index) => ({
              month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index],
              budget: item.allocated_amount || 0,
              actual: item.spent_amount || 0,
              forecast: item.allocated_amount || 0
            })) || []
          },
          kpiTrends: kpiData?.map(item => ({
            week: item.week,
            efficiency: item.efficiency_score,
            quality: item.quality_score,
            safety: item.safety_score
          })) || [],
          insights: {
            summary: insights?.[0]?.summary || 'No insights available',
            keyPoints: insights?.[0]?.key_points || [],
            recommendations: insights?.[0]?.recommendations || [],
            alerts: insights?.[0]?.alerts || []
          },
          timeline: milestones?.map(milestone => ({
            phase: milestone.name,
            startDate: milestone.start_date,
            endDate: milestone.target_date,
            status: milestone.status,
            progress: milestone.completion_percentage
          })) || [],
          team: {
            projectManager: teamData?.find(t => t.role === 'project_manager')?.name || 'TBD',
            architect: teamData?.find(t => t.role === 'architect')?.name || 'TBD',
            contractor: teamData?.find(t => t.role === 'contractor')?.name || 'TBD',
            owner: teamData?.find(t => t.role === 'owner')?.name || 'TBD'
          }
        };

        setData(executiveMetrics);
      } catch (err) {
        console.error('Error fetching executive metrics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchExecutiveMetrics();
    }
  }, [projectId]);

  return { data, error, loading };
};

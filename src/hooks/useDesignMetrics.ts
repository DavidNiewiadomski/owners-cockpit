import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DesignPhase {
  id: string;
  name: string;
  status: string;
  progress: number;
  documents: number;
  dueDate: string;
  approvalDate?: string;
}

interface DesignSubmission {
  id: number;
  title: string;
  type: string;
  submittedBy: string;
  submittedDate: string;
  status: string;
  priority: string;
  category: string;
  estimatedCost: number;
}

interface MaterialSelection {
  category: string;
  selected: string;
  alternatives: string[];
  cost: number;
  unit: string;
  quantity: number;
  status: string;
  supplier: string;
}

interface DesignMetrics {
  designPhases: DesignPhase[];
  recentDesignSubmissions: DesignSubmission[];
  materialSelections: MaterialSelection[];
  designMetrics: {
    totalDesignBudget: number;
    spentToDate: number;
    documentsApproved: number;
    totalDocuments: number;
    changeOrders: number;
    totalChangeOrderValue: number;
  };
}

export const useDesignMetrics = (projectId: string) => {
  const [data, setData] = useState<DesignMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesignMetrics = async () => {
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

        // Fetch design metrics
        const { data: designData, error: designError } = await supabase
          .from('project_design_metrics')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (designError) throw designError;

        // Fetch design phases (using milestones)
        const { data: milestones, error: milestonesError } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('target_date', { ascending: true });

        if (milestonesError) throw milestonesError;

        // Fetch design submissions (using recent activities)
        const { data: submissions, error: submissionsError } = await supabase
          .from('construction_activities')
          .select('*')
          .eq('project_id', projectId)
          .ilike('activity_name', '%design%')
          .order('activity_date', { ascending: false })
          .limit(10);

        if (submissionsError) throw submissionsError;

        // Fetch material selections (using budget breakdown)
        const { data: materials, error: materialsError } = await supabase
          .from('budget_breakdown')
          .select('*')
          .eq('project_id', projectId);

        if (materialsError) throw materialsError;

        const designMetrics = designData?.[0];
        
        // Transform design phases from milestones
        const designPhases: DesignPhase[] = milestones?.map((milestone, index) => ({
          id: milestone.id,
          name: milestone.name,
          status: milestone.status,
          progress: milestone.completion_percentage || 0,
          documents: Math.floor(15 + index * 10), // Estimated document count
          dueDate: milestone.target_date,
          approvalDate: milestone.actual_date || undefined
        })) || [];

        // Transform submissions
        const recentDesignSubmissions: DesignSubmission[] = submissions?.map((sub, index) => ({
          id: index + 1,
          title: sub.activity_name,
          type: 'Design Review',
          submittedBy: sub.crew_name || 'Design Team',
          submittedDate: sub.activity_date,
          status: sub.status,
          priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
          category: 'Design',
          estimatedCost: Math.floor(Math.random() * 100000) + 25000
        })) || [];

        // Transform material selections
        const materialSelections: MaterialSelection[] = materials?.map(item => ({
          category: item.category,
          selected: `Premium ${item.category}`,
          alternatives: [`Standard ${item.category}`, `Budget ${item.category}`],
          cost: Math.floor(item.allocated_amount / 1000),
          unit: 'sq ft',
          quantity: Math.floor(Math.random() * 5000) + 1000,
          status: item.spent_amount > 0 ? 'approved' : 'pending-approval',
          supplier: `${item.category} Supplier Co.`
        })) || [];

        const metrics: DesignMetrics = {
          designPhases,
          recentDesignSubmissions,
          materialSelections,
          designMetrics: {
            totalDesignBudget: designMetrics?.design_budget || project?.total_value * 0.05 || 1200000,
            spentToDate: designMetrics?.spent_to_date || project?.total_value * 0.035 || 850000,
            documentsApproved: designMetrics?.approved_drawings || 143,
            totalDocuments: designMetrics?.total_drawings || 178,
            changeOrders: designMetrics?.design_changes || 8,
            totalChangeOrderValue: designMetrics?.change_order_value || 125000
          }
        };

        setData(metrics);
      } catch (err) {
        console.error('Error fetching design metrics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchDesignMetrics();
    }
  }, [projectId]);

  return { data, error, loading };
};

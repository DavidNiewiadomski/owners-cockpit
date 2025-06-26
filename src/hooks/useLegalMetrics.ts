import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LegalMetrics {
  contractsActive: number;
  contractsPending: number;
  complianceScore: number;
  permitStatus: string;
  legalRisks: number;
  documentationComplete: number;
  contracts: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    value: number;
    signedDate: string;
    expiryDate: string;
    parties: string[];
  }>;
  permits: Array<{
    id: string;
    type: string;
    status: string;
    applicationDate: string;
    approvalDate?: string;
    expiryDate?: string;
    authority: string;
    cost: number;
  }>;
  riskAssessments: Array<{
    id: string;
    category: string;
    riskLevel: string;
    description: string;
    mitigationPlan: string;
    owner: string;
    status: string;
  }>;
}

export const useLegalMetrics = (projectId: string) => {
  const [data, setData] = useState<LegalMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegalMetrics = async () => {
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

        // Fetch legal metrics
        const { data: legalData, error: legalError } = await supabase
          .from('project_legal_metrics')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (legalError) throw legalError;

        // Fetch contracts (using budget items as proxy)
        const { data: contractsData, error: contractsError } = await supabase
          .from('budget_items')
          .select('*')
          .eq('project_id', projectId)
          .limit(10);

        if (contractsError) throw contractsError;

        // Fetch permits
        const { data: permitsData, error: permitsError } = await supabase
          .from('permit_status')
          .select('*')
          .eq('project_id', projectId);

        if (permitsError) throw permitsError;

        // Fetch contractor bids as legal risks
        const { data: risksData, error: risksError } = await supabase
          .from('contractor_bids')
          .select('*')
          .eq('project_id', projectId)
          .eq('status', 'rejected'); // Rejected bids could represent risks

        if (risksError) throw risksError;

        const legal = legalData?.[0];

        // Transform contracts
        const contracts = contractsData?.map((item, index) => ({
          id: item.id,
          title: `${item.category} Contract`,
          type: item.category,
          status: item.actual_amount > 0 ? 'active' : 'pending',
          value: item.budgeted_amount || 0,
          signedDate: item.created_at.split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
          parties: ['Owner', item.category + ' Contractor']
        })) || [];

        // Transform permits
        const permits = permitsData?.map(permit => ({
          id: permit.id,
          type: permit.permit_type,
          status: permit.status,
          applicationDate: permit.submitted_date,
          approvalDate: permit.approved_date,
          expiryDate: permit.expected_approval,
          authority: 'Local Planning Authority',
          cost: permit.cost || 0
        })) || [];

        // Transform risk assessments
        const riskAssessments = risksData?.map((risk, index) => ({
          id: risk.id,
          category: 'Contractor Risk',
          riskLevel: risk.evaluation_score < 80 ? 'high' : risk.evaluation_score < 90 ? 'medium' : 'low',
          description: `Risk associated with ${risk.contractor_name} bid rejection`,
          mitigationPlan: 'Continue with selected contractor monitoring',
          owner: 'Legal Team',
          status: 'monitoring'
        })) || [];

        const legalMetrics: LegalMetrics = {
          contractsActive: legal?.contracts_active || contracts.filter(c => c.status === 'active').length,
          contractsPending: legal?.contracts_pending || contracts.filter(c => c.status === 'pending').length,
          complianceScore: legal?.compliance_score || 96,
          permitStatus: legal?.permit_status || permits.length > 0 ? 
            (permits.filter(p => p.status === 'approved').length === permits.length ? 'All Approved' : 'In Progress') : 'Pending',
          legalRisks: legal?.legal_risks || riskAssessments.filter(r => r.riskLevel === 'high').length,
          documentationComplete: legal?.documentation_complete || 94,
          contracts,
          permits,
          riskAssessments
        };

        setData(legalMetrics);
      } catch (err) {
        console.error('Error fetching legal metrics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchLegalMetrics();
    }
  }, [projectId]);

  return { data, error, loading };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Division1Section {
  id: string;
  project_id: string;
  section_number: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  due_date: string | null;
  docs_on_file: number;
  required_docs: number;
  priority: 'low' | 'medium' | 'high';
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Division1Issue {
  id: string;
  section_id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  assigned_to: string | null;
  resolved_date: string | null;
  notes: string | null;
}

export interface Division1Transaction {
  id: string;
  project_id: string;
  transaction_date: string;
  description: string;
  vendor: string;
  amount: number;
  category: string;
  status: string;
}

export interface Division1CashFlow {
  id: string;
  project_id: string;
  month: string;
  inflow: number;
  outflow: number;
  cumulative: number;
}

export interface Division1Summary {
  totalSections: number;
  completedSections: number;
  pendingSections: number;
  overdueSections: number;
  totalDocs: number;
  docsOnFile: number;
  missingDocs: number;
  overallCompliance: number;
  criticalIssues: number;
  totalBudget: number;
  actualSpent: number;
  remainingBudget: number;
  budgetVariance: number;
  nextDeadline: { sectionNumber: string; title: string; daysUntil: number } | null;
}

export const useDivision1Data = (projectId: string | null) => {
  const [sections, setSections] = useState<Division1Section[]>([]);
  const [issues, setIssues] = useState<Division1Issue[]>([]);
  const [transactions, setTransactions] = useState<Division1Transaction[]>([]);
  const [cashFlow, setCashFlow] = useState<Division1CashFlow[]>([]);
  const [summary, setSummary] = useState<Division1Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDivision1Data = async () => {
    if (!projectId || projectId === 'portfolio') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch Division 1 sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('division1_sections')
        .select('*')
        .eq('project_id', projectId)
        .order('section_number');

      if (sectionsError) throw sectionsError;

      // Fetch Division 1 issues
      const { data: issuesData, error: issuesError } = await supabase
        .from('division1_issues')
        .select(`
          *,
          division1_sections!inner(project_id)
        `)
        .eq('division1_sections.project_id', projectId);

      if (issuesError) throw issuesError;

      // Fetch Division 1 transactions (case insensitive)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('project_transactions')
        .select('*')
        .eq('project_id', projectId)
        .or('description.ilike.%division 1%,description.ilike.%Division 1%')
        .order('transaction_date', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch cash flow data
      const { data: cashFlowData, error: cashFlowError } = await supabase
        .from('project_cash_flow')
        .select('*')
        .eq('project_id', projectId)
        .order('month', { ascending: false })
        .limit(6);

      if (cashFlowError) throw cashFlowError;

      setSections(sectionsData || []);
      setIssues(issuesData || []);
      setTransactions(transactionsData || []);
      setCashFlow(cashFlowData || []);

      // Calculate summary metrics
      const totalSections = sectionsData?.length || 0;
      const completedSections = sectionsData?.filter(s => s.status === 'completed').length || 0;
      const pendingSections = sectionsData?.filter(s => s.status === 'pending').length || 0;
      const overdueSections = sectionsData?.filter(s => {
        if (!s.due_date) return false;
        const dueDate = new Date(s.due_date);
        const today = new Date();
        return dueDate < today && s.status !== 'completed';
      }).length || 0;

      const totalDocs = sectionsData?.reduce((sum, s) => sum + s.required_docs, 0) || 0;
      const docsOnFile = sectionsData?.reduce((sum, s) => sum + s.docs_on_file, 0) || 0;
      const missingDocs = totalDocs - docsOnFile;

      const overallCompliance = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
      const criticalIssues = issuesData?.filter(i => i.severity === 'high' && i.status !== 'resolved').length || 0;

      // Calculate budget metrics from transactions
      const totalInflow = transactionsData?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalOutflow = transactionsData?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
      const totalBudget = 1250000; // Fixed budget for Division 1 from seed data
      const actualSpent = totalOutflow;
      const remainingBudget = totalBudget - actualSpent;
      const budgetVariance = totalBudget > 0 ? ((actualSpent - totalBudget) / totalBudget) * 100 : 0;

      // Find next deadline
      const upcomingSections = sectionsData?.filter(s => {
        if (!s.due_date || s.status === 'completed') return false;
        const dueDate = new Date(s.due_date);
        const today = new Date();
        return dueDate >= today;
      }).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()) || [];

      const nextDeadline = upcomingSections.length > 0 ? {
        sectionNumber: upcomingSections[0].section_number,
        title: upcomingSections[0].title,
        daysUntil: Math.ceil((new Date(upcomingSections[0].due_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      } : null;

      setSummary({
        totalSections,
        completedSections,
        pendingSections,
        overdueSections,
        totalDocs,
        docsOnFile,
        missingDocs,
        overallCompliance,
        criticalIssues,
        totalBudget,
        actualSpent,
        remainingBudget,
        budgetVariance,
        nextDeadline
      });

    } catch (err) {
      console.error('Error fetching Division 1 data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Division 1 data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivision1Data();
  }, [projectId]);

  return {
    sections,
    issues,
    transactions,
    cashFlow,
    summary,
    loading,
    error,
    refetch: fetchDivision1Data
  };
};

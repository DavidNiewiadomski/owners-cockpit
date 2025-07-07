import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface RiskAnalysis {
  id: string;
  bid_id: string;
  submission_id: string;
  risk_category: 'financial' | 'technical' | 'legal' | 'operational' | 'reputational';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_description: string;
  likelihood: number; // 1-5 scale
  impact: number; // 1-5 scale
  risk_score: number; // likelihood * impact
  mitigation_strategy: string;
  mitigation_status: 'not_started' | 'in_progress' | 'implemented' | 'monitoring';
  identified_by: string;
  identified_at: string;
  review_date?: string;
  reviewed_by?: string;
  notes?: string;
  attachments?: any[];
  created_at: string;
  updated_at: string;
}

export interface RiskMatrix {
  bid_id: string;
  total_risks: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  category_breakdown: {
    financial: number;
    technical: number;
    legal: number;
    operational: number;
    reputational: number;
  };
  average_risk_score: number;
  mitigation_coverage: number; // percentage of risks with mitigation strategies
}

export interface UseRiskAnalysisReturn {
  risks: RiskAnalysis[];
  riskMatrix: RiskMatrix | null;
  loading: boolean;
  error: string | null;
  fetchRisks: (bidId?: string) => Promise<void>;
  fetchRiskMatrix: (bidId: string) => Promise<void>;
  createRisk: (risk: Omit<RiskAnalysis, 'id' | 'created_at' | 'updated_at' | 'risk_score'>) => Promise<RiskAnalysis | null>;
  updateRisk: (id: string, updates: Partial<RiskAnalysis>) => Promise<boolean>;
  deleteRisk: (id: string) => Promise<boolean>;
  generateRiskReport: (bidId: string) => Promise<string | null>;
  exportRiskRegister: (bidId: string, format: 'pdf' | 'excel') => Promise<string | null>;
}

export const useRiskAnalysis = (): UseRiskAnalysisReturn => {
  const [risks, setRisks] = useState<RiskAnalysis[]>([]);
  const [riskMatrix, setRiskMatrix] = useState<RiskMatrix | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRisks = useCallback(async (bidId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('risk_analysis')
        .select('*')
        .order('risk_score', { ascending: false });

      if (bidId) {
        query = query.eq('bid_id', bidId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRisks(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch risks';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRiskMatrix = useCallback(async (bidId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: risks, error } = await supabase
        .from('risk_analysis')
        .select('*')
        .eq('bid_id', bidId);

      if (error) throw error;

      if (risks && risks.length > 0) {
        // Calculate risk matrix metrics
        const matrix: RiskMatrix = {
          bid_id: bidId,
          total_risks: risks.length,
          risk_distribution: {
            low: risks.filter(r => r.risk_level === 'low').length,
            medium: risks.filter(r => r.risk_level === 'medium').length,
            high: risks.filter(r => r.risk_level === 'high').length,
            critical: risks.filter(r => r.risk_level === 'critical').length,
          },
          category_breakdown: {
            financial: risks.filter(r => r.risk_category === 'financial').length,
            technical: risks.filter(r => r.risk_category === 'technical').length,
            legal: risks.filter(r => r.risk_category === 'legal').length,
            operational: risks.filter(r => r.risk_category === 'operational').length,
            reputational: risks.filter(r => r.risk_category === 'reputational').length,
          },
          average_risk_score: risks.reduce((sum, r) => sum + r.risk_score, 0) / risks.length,
          mitigation_coverage: (risks.filter(r => r.mitigation_strategy && r.mitigation_strategy.length > 0).length / risks.length) * 100,
        };

        setRiskMatrix(matrix);
      } else {
        setRiskMatrix(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch risk matrix';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRisk = useCallback(async (risk: Omit<RiskAnalysis, 'id' | 'created_at' | 'updated_at' | 'risk_score'>) => {
    setLoading(true);
    setError(null);
    try {
      // Calculate risk score
      const risk_score = risk.likelihood * risk.impact;
      
      // Determine risk level based on score
      let risk_level: RiskAnalysis['risk_level'];
      if (risk_score <= 6) risk_level = 'low';
      else if (risk_score <= 12) risk_level = 'medium';
      else if (risk_score <= 20) risk_level = 'high';
      else risk_level = 'critical';

      const { data, error } = await supabase
        .from('risk_analysis')
        .insert([{ ...risk, risk_score, risk_level }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Risk analysis created successfully');
      await fetchRisks(risk.bid_id);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create risk analysis';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchRisks]);

  const updateRisk = useCallback(async (id: string, updates: Partial<RiskAnalysis>) => {
    setLoading(true);
    setError(null);
    try {
      // Recalculate risk score if likelihood or impact changed
      let updatedData = { ...updates };
      if (updates.likelihood !== undefined || updates.impact !== undefined) {
        const currentRisk = risks.find(r => r.id === id);
        if (currentRisk) {
          const likelihood = updates.likelihood ?? currentRisk.likelihood;
          const impact = updates.impact ?? currentRisk.impact;
          const risk_score = likelihood * impact;
          
          // Recalculate risk level
          let risk_level: RiskAnalysis['risk_level'];
          if (risk_score <= 6) risk_level = 'low';
          else if (risk_score <= 12) risk_level = 'medium';
          else if (risk_score <= 20) risk_level = 'high';
          else risk_level = 'critical';
          
          updatedData = { ...updatedData, risk_score, risk_level };
        }
      }

      const { error } = await supabase
        .from('risk_analysis')
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Risk analysis updated successfully');
      
      // Refresh the risks list
      const currentRisk = risks.find(r => r.id === id);
      if (currentRisk) {
        await fetchRisks(currentRisk.bid_id);
      }
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update risk analysis';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [risks, fetchRisks]);

  const deleteRisk = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('risk_analysis')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Risk analysis deleted successfully');
      
      // Remove from local state
      setRisks(prev => prev.filter(r => r.id !== id));
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete risk analysis';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateRiskReport = useCallback(async (bidId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Call Supabase Edge Function to generate risk report
      const { data, error } = await supabase.functions.invoke('generate-risk-report', {
        body: { bid_id: bidId }
      });

      if (error) throw error;

      toast.success('Risk report generated successfully');
      return data.report_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate risk report';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportRiskRegister = useCallback(async (bidId: string, format: 'pdf' | 'excel') => {
    setLoading(true);
    setError(null);
    try {
      // Call Supabase Edge Function to export risk register
      const { data, error } = await supabase.functions.invoke('export-risk-register', {
        body: { bid_id: bidId, format }
      });

      if (error) throw error;

      toast.success(`Risk register exported as ${format.toUpperCase()}`);
      return data.export_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export risk register';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    risks,
    riskMatrix,
    loading,
    error,
    fetchRisks,
    fetchRiskMatrix,
    createRisk,
    updateRisk,
    deleteRisk,
    generateRiskReport,
    exportRiskRegister,
  };
};

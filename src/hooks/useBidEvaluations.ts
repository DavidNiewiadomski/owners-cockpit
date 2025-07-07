import { useState, useCallback } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-toastify';

export interface BidEvaluation {
  id: string;
  bid_id: string;
  submission_id: string;
  evaluator_id: string;
  evaluation_phase: 'technical' | 'commercial' | 'combined';
  technical_scores: Record<string, number>;
  technical_total: number;
  technical_percentage: number;
  commercial_scores: Record<string, number>;
  commercial_total: number;
  commercial_percentage: number;
  weighted_technical_score: number;
  weighted_commercial_score: number;
  composite_score: number;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  is_complete: boolean;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UseBidEvaluationsReturn {
  evaluations: BidEvaluation[];
  loading: boolean;
  error: string | null;
  fetchEvaluations: (bidId: string) => Promise<void>;
  submitEvaluation: (evaluation: Omit<BidEvaluation, 'id' | 'created_at' | 'updated_at'>) => Promise<BidEvaluation | null>;
  updateEvaluation: (id: string, updates: Partial<BidEvaluation>) => Promise<boolean>;
  deleteEvaluation: (id: string) => Promise<boolean>;
  completeEvaluation: (id: string) => Promise<boolean>;
  calculateScores: (evaluation: Partial<BidEvaluation>) => Promise<BidEvaluation | null>;
}

export const useBidEvaluations = (): UseBidEvaluationsReturn => {
  const [evaluations, setEvaluations] = useState<BidEvaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async (bidId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('scorecards')
        .select('*')
        .eq('bid_id', bidId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch evaluations';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitEvaluation = useCallback(async (evaluation: Omit<BidEvaluation, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('scorecards')
        .insert([evaluation])
        .select()
        .single();

      if (error) throw error;
      setEvaluations((prev) => [...prev, data]);
      toast.success('Evaluation submitted successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit evaluation';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvaluation = useCallback(async (id: string, updates: Partial<BidEvaluation>) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('scorecards')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setEvaluations((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
      toast.success('Evaluation updated successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update evaluation';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvaluation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('scorecards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
      toast.success('Evaluation deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete evaluation';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeEvaluation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('scorecards')
        .update({ 
          is_complete: true,
          submitted_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setEvaluations((prev) => prev.map((e) => 
        e.id === id ? { ...e, is_complete: true, submitted_at: new Date().toISOString() } : e
      ));
      
      toast.success('Evaluation completed and submitted');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete evaluation';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateScores = useCallback(async (evaluation: Partial<BidEvaluation>) => {
    try {
      // Get bid weights from the database
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select('technical_weight, commercial_weight')
        .eq('id', evaluation.bid_id)
        .single();

      if (bidError) throw bidError;

      const technicalWeight = bidData?.technical_weight || 60;
      const commercialWeight = bidData?.commercial_weight || 40;

      // Calculate technical scores
      const technicalScores = evaluation.technical_scores || {};
      const technicalTotal = Object.values(technicalScores).reduce((sum, score) => sum + score, 0);
      const technicalMaxPossible = Object.keys(technicalScores).length * 100; // Assuming 100 max per criterion
      const technicalPercentage = technicalMaxPossible > 0 ? (technicalTotal / technicalMaxPossible) * 100 : 0;

      // Calculate commercial scores
      const commercialScores = evaluation.commercial_scores || {};
      const commercialTotal = Object.values(commercialScores).reduce((sum, score) => sum + score, 0);
      const commercialMaxPossible = Object.keys(commercialScores).length * 100;
      const commercialPercentage = commercialMaxPossible > 0 ? (commercialTotal / commercialMaxPossible) * 100 : 0;

      // Calculate weighted scores
      const weightedTechnicalScore = (technicalPercentage * technicalWeight) / 100;
      const weightedCommercialScore = (commercialPercentage * commercialWeight) / 100;
      const compositeScore = weightedTechnicalScore + weightedCommercialScore;

      const calculatedEvaluation: BidEvaluation = {
        ...evaluation as BidEvaluation,
        technical_total: technicalTotal,
        technical_percentage: technicalPercentage,
        commercial_total: commercialTotal,
        commercial_percentage: commercialPercentage,
        weighted_technical_score: weightedTechnicalScore,
        weighted_commercial_score: weightedCommercialScore,
        composite_score: compositeScore,
      };

      return calculatedEvaluation;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate scores';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  return {
    evaluations,
    loading,
    error,
    fetchEvaluations,
    submitEvaluation,
    updateEvaluation,
    deleteEvaluation,
    completeEvaluation,
    calculateScores,
  };
};


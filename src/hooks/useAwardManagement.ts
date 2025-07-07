import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AwardPackage {
  id: string;
  bid_id: string;
  winning_submission_id: string;
  contract_value: number;
  selection_rationale?: Record<string, any>;
  price_basis?: Record<string, any>;
  funding_source?: Record<string, any>;
  memo_content?: string;
  memo_url?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'executed' | 'cancelled';
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
}

export interface CreateAwardRequest {
  bid_id: string;
  winning_submission_id: string;
  contract_value: number;
  selection_rationale?: Record<string, any>;
  price_basis?: Record<string, any>;
  funding_source?: Record<string, any>;
  template_id?: string;
}

export interface UpdateAwardRequest {
  contract_value?: number;
  selection_rationale?: Record<string, any>;
  price_basis?: Record<string, any>;
  funding_source?: Record<string, any>;
  status?: 'draft' | 'pending_approval' | 'approved' | 'executed' | 'cancelled';
  memo_content?: string;
  memo_url?: string;
}

export interface AwardMemoData {
  bid_info: Record<string, any>;
  snapshot: Record<string, any>;
  scorecards: Record<string, any>;
  compliance: Record<string, any>;
}

export function useAwardManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to make authenticated API calls to award-center
  const awardCenterApiCall = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/award-center/${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, []);

  const createAwardPackage = useCallback(async (awardRequest: CreateAwardRequest): Promise<AwardPackage | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await awardCenterApiCall<{
        award_package_id: string;
        memo_url: string;
        message: string;
      }>(`rfp/${awardRequest.bid_id}/award`, {
        method: 'POST',
        body: JSON.stringify(awardRequest),
      });

      // Fetch the created award package details
      const { data: awardPackage, error: fetchError } = await supabase
        .from('award_packages')
        .select('*')
        .eq('id', result.award_package_id)
        .single();

      if (fetchError) throw fetchError;
      return awardPackage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [awardCenterApiCall]);

  const downloadAwardMemo = useCallback(async (bidId: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await awardCenterApiCall<{ memo_url: string }>(`rfp/${bidId}/memo`);
      return result.memo_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [awardCenterApiCall]);

  const regenerateAwardMemo = useCallback(async (bidId: string, updates?: Record<string, any>): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await awardCenterApiCall<{ memo_url: string }>(`rfp/${bidId}/regenerate-memo`, {
        method: 'POST',
        body: JSON.stringify(updates || {}),
      });

      return result.memo_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [awardCenterApiCall]);

  return {
    createAwardPackage,
    downloadAwardMemo,
    regenerateAwardMemo,
    loading,
    error,
  };
}

export function useAwardPackages(bidId?: string) {
  const [awardPackages, setAwardPackages] = useState<AwardPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAwardPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('award_packages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bidId) {
        query = query.eq('bid_id', bidId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setAwardPackages(data || []);
    } catch (err) {
      console.error('Error fetching award packages:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAwardPackages([]);
    } finally {
      setLoading(false);
    }
  }, [bidId]);

  useEffect(() => {
    fetchAwardPackages();
  }, [fetchAwardPackages]);

  return { awardPackages, loading, error, refetch: fetchAwardPackages };
}

export function useAwardPackage(awardPackageId: string) {
  const [awardPackage, setAwardPackage] = useState<AwardPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAwardPackage() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('award_packages')
          .select('*')
          .eq('id', awardPackageId)
          .single();

        if (error) throw error;
        setAwardPackage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (awardPackageId) {
      fetchAwardPackage();
    }
  }, [awardPackageId]);

  return { awardPackage, loading, error };
}

export function useAwardPackageMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAwardPackage = async (awardPackageId: string, request: UpdateAwardRequest): Promise<AwardPackage | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('award_packages')
        .update(request)
        .eq('id', awardPackageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const approveAwardPackage = async (awardPackageId: string): Promise<AwardPackage | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('award_packages')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', awardPackageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelAwardPackage = async (awardPackageId: string): Promise<AwardPackage | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('award_packages')
        .update({ status: 'cancelled' })
        .eq('id', awardPackageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateAwardPackage, approveAwardPackage, cancelAwardPackage, loading, error };
}

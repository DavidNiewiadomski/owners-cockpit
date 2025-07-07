import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  Rfp,
  TimelineEvent,
  ScopeItem,
  VendorSubmission,
  Question,
  RfpWithDetails,
  CreateRfpRequest,
  UpdateRfpRequest,
  CreateTimelineEventRequest,
  CreateScopeItemRequest,
  CreateVendorSubmissionRequest,
  UpdateVendorSubmissionRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest} from '@/types/rfp';
import {
  Addendum,
  CreateAddendumRequest
} from '@/types/rfp';

// RFP hooks
export function useRfps(facilityId?: string) {
  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRfps = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('bids').select('*').order('created_at', { ascending: false });
      
        if (facilityId) {
          query = query.eq('project_id', facilityId);
        }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setRfps(data || []);
    } catch (err) {
      console.error('Error fetching RFPs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRfps([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfps();
  }, [facilityId]);

  return { rfps, loading, error, refetch: fetchRfps };
}

export function useRfp(rfpId: string) {
  const [rfp, setRfp] = useState<RfpWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRfp() {
      try {
        setLoading(true);
        
        // Fetch RFP with all related data
        const [
          { data: rfpData, error: rfpError },
          { data: submissions, error: submissionsError }
        ] = await Promise.all([
          supabase.from('bids').select('*').eq('id', rfpId).single(),
          supabase.from('submissions').select('*').eq('bid_id', rfpId).order('submitted_at')
        ]);

        if (rfpError) throw rfpError;
        if (submissionsError) throw submissionsError;

        const rfpWithDetails: RfpWithDetails = {
          ...rfpData,
          timeline_events: [],
          scope_items: [],
          addenda: [],
          vendor_submissions: submissions || [],
          questions: []
        };

        setRfp(rfpWithDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (rfpId) {
      fetchRfp();
    }
  }, [rfpId]);

  return { rfp, loading, error, refetch: () => fetchRfp() };
}

// CRUD operations for RFP
export function useRfpMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRfp = async (request: CreateRfpRequest): Promise<Rfp | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bids')
        .insert([{ ...request, created_by: user.id }])
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

  const updateRfp = async (rfpId: string, request: UpdateRfpRequest): Promise<Rfp | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('bids')
        .update(request)
        .eq('id', rfpId)
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

  const deleteRfp = async (rfpId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('id', rfpId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createRfp, updateRfp, deleteRfp, loading, error };
}

// Timeline Event hooks
export function useTimelineEventMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTimelineEvent = async (request: CreateTimelineEventRequest): Promise<TimelineEvent | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('timeline_event')
        .insert([request])
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

  const updateTimelineEvent = async (eventId: string, updates: Partial<TimelineEvent>): Promise<TimelineEvent | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('timeline_event')
        .update(updates)
        .eq('id', eventId)
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

  const deleteTimelineEvent = async (eventId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('timeline_event')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createTimelineEvent, updateTimelineEvent, deleteTimelineEvent, loading, error };
}

// Scope Item hooks
export function useScopeItemMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createScopeItem = async (request: CreateScopeItemRequest): Promise<ScopeItem | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('scope_item')
        .insert([request])
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

  const updateScopeItem = async (itemId: string, updates: Partial<ScopeItem>): Promise<ScopeItem | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('scope_item')
        .update(updates)
        .eq('id', itemId)
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

  const deleteScopeItem = async (itemId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('scope_item')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createScopeItem, updateScopeItem, deleteScopeItem, loading, error };
}

// Vendor Submission hooks
export function useVendorSubmissionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVendorSubmission = async (request: CreateVendorSubmissionRequest): Promise<VendorSubmission | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('vendor_submission')
        .insert([request])
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

  const updateVendorSubmission = async (submissionId: string, updates: UpdateVendorSubmissionRequest): Promise<VendorSubmission | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('vendor_submission')
        .update(updates)
        .eq('id', submissionId)
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

  return { createVendorSubmission, updateVendorSubmission, loading, error };
}

// Question hooks
export function useQuestionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuestion = async (request: CreateQuestionRequest): Promise<Question | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('question')
        .insert([request])
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

  const updateQuestion = async (questionId: string, updates: UpdateQuestionRequest): Promise<Question | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('question')
        .update(updates)
        .eq('id', questionId)
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

  return { createQuestion, updateQuestion, loading, error };
}

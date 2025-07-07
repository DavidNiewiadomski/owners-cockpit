import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type {
  Bid,
  Submission,
  Leveling,
  Scorecard,
  BafoRequest,
  Award,
  BidEvent,
  CreateBidRequest,
  UpdateBidRequest,
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
  CreateLevelingRequest,
  UpdateLevelingRequest,
  CreateScorecardRequest,
  UpdateScorecardRequest,
  CreateBafoRequest,
  UpdateBafoRequest,
  CreateAwardRequest,
  UpdateAwardRequest,
  BidSummary,
  SubmissionSummary,
  EvaluationProgress
} from '../types/bid-core';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Base API URL for bid-core functions
const BID_CORE_API_URL = `${supabaseUrl}/functions/v1/bid-core-api`;
const BID_SNS_URL = `${supabaseUrl}/functions/v1/bid-sns-publisher`;

interface ApiError {
  message: string;
  code?: string;
}

interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

export function useBidCore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<Bid[]>([]);

  // Helper function to make authenticated API calls
  const apiCall = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${BID_CORE_API_URL}/${endpoint}`, {
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

  // Bid operations
  const getBids = useCallback(async (status?: string): Promise<Bid[]> => {
    const params = status ? `?status=${status}` : '';
    return apiCall<Bid[]>(`bids${params}`);
  }, [apiCall]);

  const getBid = useCallback(async (id: string): Promise<Bid> => {
    return apiCall<Bid>(`bids/${id}`);
  }, [apiCall]);

  const createBid = useCallback(async (bidData: CreateBidRequest): Promise<Bid> => {
    return apiCall<Bid>('bids', {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }, [apiCall]);

  const updateBid = useCallback(async (id: string, bidData: UpdateBidRequest): Promise<Bid> => {
    return apiCall<Bid>(`bids/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bidData),
    });
  }, [apiCall]);

  const deleteBid = useCallback(async (id: string): Promise<void> => {
    return apiCall<void>(`bids/${id}`, {
      method: 'DELETE',
    });
  }, [apiCall]);

  // Submission operations
  const getSubmissions = useCallback(async (bidId?: string): Promise<Submission[]> => {
    const params = bidId ? `?bid_id=${bidId}` : '';
    return apiCall<Submission[]>(`submissions${params}`);
  }, [apiCall]);

  const getSubmission = useCallback(async (id: string): Promise<Submission> => {
    return apiCall<Submission>(`submissions/${id}`);
  }, [apiCall]);

  const createSubmission = useCallback(async (submissionData: CreateSubmissionRequest): Promise<Submission> => {
    return apiCall<Submission>('submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  }, [apiCall]);

  const updateSubmission = useCallback(async (id: string, submissionData: UpdateSubmissionRequest): Promise<Submission> => {
    return apiCall<Submission>(`submissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(submissionData),
    });
  }, [apiCall]);

  // Leveling operations
  const getLeveling = useCallback(async (bidId?: string): Promise<Leveling[]> => {
    const params = bidId ? `?bid_id=${bidId}` : '';
    return apiCall<Leveling[]>(`leveling${params}`);
  }, [apiCall]);

  const createLeveling = useCallback(async (levelingData: CreateLevelingRequest): Promise<Leveling> => {
    return apiCall<Leveling>('leveling', {
      method: 'POST',
      body: JSON.stringify(levelingData),
    });
  }, [apiCall]);

  const updateLeveling = useCallback(async (id: string, levelingData: UpdateLevelingRequest): Promise<Leveling> => {
    return apiCall<Leveling>(`leveling/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(levelingData),
    });
  }, [apiCall]);

  // Scorecard operations
  const getScorecards = useCallback(async (bidId?: string, submissionId?: string): Promise<Scorecard[]> => {
    const params = new URLSearchParams();
    if (bidId) params.append('bid_id', bidId);
    if (submissionId) params.append('submission_id', submissionId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiCall<Scorecard[]>(`scorecards${queryString}`);
  }, [apiCall]);

  const createScorecard = useCallback(async (scorecardData: CreateScorecardRequest): Promise<Scorecard> => {
    return apiCall<Scorecard>('scorecards', {
      method: 'POST',
      body: JSON.stringify(scorecardData),
    });
  }, [apiCall]);

  const updateScorecard = useCallback(async (id: string, scorecardData: UpdateScorecardRequest): Promise<Scorecard> => {
    return apiCall<Scorecard>(`scorecards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(scorecardData),
    });
  }, [apiCall]);

  // BAFO operations
  const getBafoRequests = useCallback(async (bidId?: string): Promise<BafoRequest[]> => {
    const params = bidId ? `?bid_id=${bidId}` : '';
    return apiCall<BafoRequest[]>(`bafo-requests${params}`);
  }, [apiCall]);

  const createBafoRequest = useCallback(async (bafoData: CreateBafoRequest): Promise<BafoRequest> => {
    return apiCall<BafoRequest>('bafo-requests', {
      method: 'POST',
      body: JSON.stringify(bafoData),
    });
  }, [apiCall]);

  const updateBafoRequest = useCallback(async (id: string, bafoData: UpdateBafoRequest): Promise<BafoRequest> => {
    return apiCall<BafoRequest>(`bafo-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bafoData),
    });
  }, [apiCall]);

  // Award operations
  const getAwards = useCallback(async (bidId?: string): Promise<Award[]> => {
    const params = bidId ? `?bid_id=${bidId}` : '';
    return apiCall<Award[]>(`awards${params}`);
  }, [apiCall]);

  const createAward = useCallback(async (awardData: CreateAwardRequest): Promise<Award> => {
    return apiCall<Award>('awards', {
      method: 'POST',
      body: JSON.stringify(awardData),
    });
  }, [apiCall]);

  const updateAward = useCallback(async (id: string, awardData: UpdateAwardRequest): Promise<Award> => {
    return apiCall<Award>(`awards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(awardData),
    });
  }, [apiCall]);

  // Event operations
  const getBidEvents = useCallback(async (bidId?: string, eventType?: string): Promise<BidEvent[]> => {
    const params = new URLSearchParams();
    if (bidId) params.append('bid_id', bidId);
    if (eventType) params.append('event_type', eventType);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiCall<BidEvent[]>(`events${queryString}`);
  }, [apiCall]);

  // SNS publishing
  const publishBidEvent = useCallback(async (eventType: string, bidId: string, eventData: any = {}): Promise<{ messageId: string }> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(BID_SNS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        bid_id: bidId,
        event_data: eventData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadBids = async () => {
      try {
        setLoading(true);
        const bids = await getBids();
        setData(bids);
      } catch (err) {
        setError({ message: err instanceof Error ? err.message : 'Failed to load bids' });
      } finally {
        setLoading(false);
      }
    };
    
    loadBids();
  }, []);

  return {
    data,
    loading,
    error,
    setError,
    
    // Bid operations
    getBids,
    getBid,
    createBid,
    updateBid,
    deleteBid,
    
    // Submission operations
    getSubmissions,
    getSubmission,
    createSubmission,
    updateSubmission,
    
    // Leveling operations
    getLeveling,
    createLeveling,
    updateLeveling,
    
    // Scorecard operations
    getScorecards,
    createScorecard,
    updateScorecard,
    
    // BAFO operations
    getBafoRequests,
    createBafoRequest,
    updateBafoRequest,
    
    // Award operations
    getAwards,
    createAward,
    updateAward,
    
    // Event operations
    getBidEvents,
    publishBidEvent,
  };
}

// Individual hooks for specific entities
export function useBids(status?: string): ApiResponse<Bid[]> {
  const [data, setData] = useState<Bid[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const { getBids } = useBidCore();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        setError(null);
        const bids = await getBids(status);
        setData(bids);
      } catch (err) {
        setError({ message: err instanceof Error ? err.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [getBids, status]);

  return { data, loading, error };
}

export function useBid(id: string | null): ApiResponse<Bid> {
  const [data, setData] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { getBid } = useBidCore();

  useEffect(() => {
    if (!id) return;

    const fetchBid = async () => {
      try {
        setLoading(true);
        setError(null);
        const bid = await getBid(id);
        setData(bid);
      } catch (err) {
        setError({ message: err instanceof Error ? err.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    fetchBid();
  }, [getBid, id]);

  return { data, loading, error };
}

export function useSubmissions(bidId?: string): ApiResponse<Submission[]> {
  const [data, setData] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const { getSubmissions } = useBidCore();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const submissions = await getSubmissions(bidId);
        setData(submissions);
      } catch (err) {
        setError({ message: err instanceof Error ? err.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [getSubmissions, bidId]);

  return { data, loading, error };
}

export function useBidEvents(bidId?: string, eventType?: string): ApiResponse<BidEvent[]> {
  const [data, setData] = useState<BidEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const { getBidEvents } = useBidCore();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const events = await getBidEvents(bidId, eventType);
        setData(events);
      } catch (err) {
        setError({ message: err instanceof Error ? err.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [getBidEvents, bidId, eventType]);

  return { data, loading, error };
}

// Real-time subscription hooks
export function useBidSubscription(bidId: string) {
  const [events, setEvents] = useState<BidEvent[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel(`bid_events:bid_id=eq.${bidId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bid_events',
          filter: `bid_id=eq.${bidId}`,
        },
        (payload) => {
          setEvents((current) => [payload.new as BidEvent, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bidId]);

  return events;
}

export function useSubmissionSubscription(submissionId: string) {
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`submissions:id=eq.${submissionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'submissions',
          filter: `id=eq.${submissionId}`,
        },
        (payload) => {
          setSubmission(payload.new as Submission);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [submissionId]);

  return submission;
}

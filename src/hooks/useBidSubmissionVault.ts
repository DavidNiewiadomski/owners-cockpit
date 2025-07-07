import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for bid submission vault
export interface BidSubmission {
  id: string;
  rfp_id: string;
  vendor_submission_id: string;
  submission_type: 'technical' | 'commercial';
  s3_bucket: string;
  s3_key: string;
  s3_etag?: string;
  file_name: string;
  file_size?: number;
  content_type?: string;
  sealed: boolean;
  sealed_at?: string;
  upload_initiated_at: string;
  upload_completed_at?: string;
  opened_at?: string;
  opened_by?: string;
  upload_metadata: Record<string, any>;
  access_log: AccessLogEntry[];
  created_at: string;
  updated_at: string;
}

export interface AccessLogEntry {
  timestamp: string;
  action: string;
  user_id?: string;
  metadata: Record<string, any>;
}

export interface PresignedUploadToken {
  id: string;
  rfp_id: string;
  vendor_id: string;
  submission_type: 'technical' | 'commercial';
  s3_key: string;
  presigned_url: string;
  expires_at: string;
  used: boolean;
  used_at?: string;
  created_by: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UploadUrlResponse {
  url: string;
  expiry: number;
  s3_key: string;
  expires_at: string;
}

export interface DownloadUrlResponse {
  download_url: string;
  expires_in: number;
  file_name: string;
  file_size: number;
  submission_type: 'technical' | 'commercial';
  uploaded_at: string;
  sealed_at: string;
  opened_at?: string;
  s3_key: string;
  metadata: {
    rfp_id: string;
    proposal_deadline_passed: boolean;
    deadline_passed_at: string;
    accessed_by: string;
    accessed_at: string;
  };
}

export interface SubmissionStatus {
  submission?: BidSubmission;
  status: 'pending' | 'uploading' | 'uploaded' | 'sealed' | 'awaiting_deadline' | 'opened';
  can_upload: boolean;
  can_access: boolean;
  deadline_passed: boolean;
  proposal_due: string;
}

export interface UploadProgress {
  progress: number;
  fileName: string;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// Main hook for bid submission vault operations
export function useBidSubmissionVault() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get presigned upload URL
  const getUploadUrl = useCallback(async (
    rfpId: string,
    submissionType: 'technical' | 'commercial',
    fileName: string
  ): Promise<UploadUrlResponse> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/rfp-upload-url/${rfpId}/upload-url?type=${submissionType}&filename=${encodeURIComponent(fileName)}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  // Get download URL for bid submission (admin only, after deadline)
  const getDownloadUrl = useCallback(async (submissionId: string): Promise<DownloadUrlResponse> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/bid-download/${submissionId}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload file to S3 using presigned URL
  const uploadFile = useCallback(async (
    file: File,
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress?.(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }, []);

  // Get submission status
  const getSubmissionStatus = useCallback(async (
    rfpId: string,
    submissionType: 'technical' | 'commercial'
  ): Promise<SubmissionStatus> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/rfp-upload-url/status?rfp_id=${rfpId}&type=${submissionType}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all submissions for an RFP (admin only)
  const getRfpSubmissions = useCallback(async (rfpId: string): Promise<BidSubmission[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('bid_submissions')
        .select('*')
        .eq('rfp_id', rfpId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setError,
    getUploadUrl,
    getDownloadUrl,
    uploadFile,
    getSubmissionStatus,
    getRfpSubmissions,
  };
}

// Hook for real-time submission status updates
export function useSubmissionStatusUpdates(rfpId: string, submissionType: 'technical' | 'commercial') {
  const [status, setStatus] = useState<SubmissionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { getSubmissionStatus } = useBidSubmissionVault();

  // Load initial status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        setLoading(true);
        const statusData = await getSubmissionStatus(rfpId, submissionType);
        setStatus(statusData);
      } catch (error) {
        console.error('Error loading submission status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [rfpId, submissionType, getSubmissionStatus]);

  // Set up real-time subscription for bid_submissions table
  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser();
    
    if (!user) return;

    const channel = supabase
      .channel(`bid_submissions:rfp_${rfpId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bid_submissions',
          filter: `rfp_id=eq.${rfpId}`,
        },
        (payload) => {
          // Update status when submission changes
          if (payload.new && 
              (payload.new as any).submission_type === submissionType) {
            setStatus(prevStatus => {
              if (!prevStatus) return prevStatus;
              
              const submission = payload.new as BidSubmission;
              let newStatus: SubmissionStatus['status'] = 'pending';
              
              if (submission.opened_at) {
                newStatus = 'opened';
              } else if (submission.sealed && prevStatus.deadline_passed) {
                newStatus = 'awaiting_deadline';
              } else if (submission.sealed) {
                newStatus = 'sealed';
              } else if (submission.upload_completed_at) {
                newStatus = 'uploaded';
              }
              
              return {
                ...prevStatus,
                submission,
                status: newStatus,
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rfpId, submissionType]);

  return { status, loading };
}

// Hook for upload progress tracking
export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const { getUploadUrl, uploadFile } = useBidSubmissionVault();

  const startUpload = useCallback(async (
    file: File,
    rfpId: string,
    submissionType: 'technical' | 'commercial'
  ) => {
    try {
      setUploadProgress({
        progress: 0,
        fileName: file.name,
        status: 'uploading',
      });

      // Get upload URL
      const { url, s3_key } = await getUploadUrl(rfpId, submissionType, file.name);

      // Upload file with progress tracking
      await uploadFile(file, url, (progress) => {
        setUploadProgress(prev => prev ? { ...prev, progress } : null);
      });

      setUploadProgress(prev => prev ? { ...prev, status: 'completed' } : null);
      
      return { s3_key };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadProgress(prev => prev ? { 
        ...prev, 
        status: 'error', 
        error: errorMessage 
      } : null);
      throw error;
    }
  }, [getUploadUrl, uploadFile]);

  const cancelUpload = useCallback(() => {
    setUploadProgress(null);
  }, []);

  return {
    uploadProgress,
    startUpload,
    cancelUpload,
  };
}

// Hook for bid submission access (admin only)
export function useBidSubmissionAccess() {
  const [submissions, setSubmissions] = useState<BidSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const { getRfpSubmissions, getDownloadUrl } = useBidSubmissionVault();

  const loadSubmissions = useCallback(async (rfpId: string) => {
    setLoading(true);
    try {
      const data = await getRfpSubmissions(rfpId);
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [getRfpSubmissions]);

  const downloadSubmission = useCallback(async (submissionId: string) => {
    try {
      const { download_url } = await getDownloadUrl(submissionId);
      
      // Open download in new tab
      window.open(download_url, '_blank');
    } catch (error) {
      console.error('Error downloading submission:', error);
      throw error;
    }
  }, [getDownloadUrl]);

  return {
    submissions,
    loading,
    loadSubmissions,
    downloadSubmission,
  };
}

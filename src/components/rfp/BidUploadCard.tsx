import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, FileText, CheckCircle, Clock, Lock, X, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface BidUploadCardProps {
  rfpId: string;
  submissionType: 'technical' | 'commercial';
  title: string;
  proposalDue: string;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  onUploadComplete?: (s3Key: string) => void;
  onUploadError?: (error: string) => void;
}

interface UploadStatus {
  status: 'pending' | 'uploading' | 'uploaded' | 'awaiting_deadline' | 'opened' | 'error';
  progress: number;
  fileName?: string;
  uploadedAt?: string;
  s3Key?: string;
  error?: string;
}

const BidUploadCard: React.FC<BidUploadCardProps> = ({
  rfpId,
  submissionType,
  title,
  proposalDue,
  maxFileSize = 10, // 10MB default
  acceptedFileTypes = ['.pdf', '.doc', '.docx'],
  onUploadComplete,
  onUploadError,
}) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'pending',
    progress: 0,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if deadline has passed
  useEffect(() => {
    const checkDeadline = () => {
      const deadline = new Date(proposalDue);
      const now = new Date();
      setIsDeadlinePassed(now > deadline);
    };

    checkDeadline();
    const interval = setInterval(checkDeadline, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [proposalDue]);

  // Load existing submission status
  useEffect(() => {
    loadSubmissionStatus();
  }, [rfpId, submissionType]);

  const loadSubmissionStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/rfp-upload-url/status?rfp_id=${rfpId}&type=${submissionType}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const statusData = await response.json();
        if (statusData.submission) {
          setUploadStatus({
            status: getStatusFromSubmission(statusData.submission),
            progress: 100,
            fileName: statusData.submission.file_name,
            uploadedAt: statusData.submission.upload_completed_at,
            s3Key: statusData.submission.s3_key,
          });
        }
      }
    } catch (error) {
      console.error('Error loading submission status:', error);
    }
  }, [rfpId, submissionType]);

  const getStatusFromSubmission = (submission: any): UploadStatus['status'] => {
    if (submission.opened_at) return 'opened';
    if (submission.sealed && isDeadlinePassed) return 'awaiting_deadline';
    if (submission.sealed) return 'uploaded';
    return 'pending';
  };

  const getUploadUrl = useCallback(async (fileName: string) => {
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

    return response.json();
  }, [rfpId, submissionType]);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setUploadStatus({
        status: 'uploading',
        progress: 0,
        fileName: file.name,
      });

      // Validate file
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        throw new Error(`File type not accepted. Allowed types: ${acceptedFileTypes.join(', ')}`);
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxFileSize}MB limit`);
      }

      // Get presigned URL
      const { url, s3_key } = await getUploadUrl(file.name);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Upload to S3 with progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadStatus(prev => ({
              ...prev,
              progress,
            }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            setUploadStatus(prev => ({
              ...prev,
              status: 'uploaded',
              progress: 100,
              s3Key: s3_key,
              uploadedAt: new Date().toISOString(),
            }));
            onUploadComplete?.(s3_key);
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        // Set up abort signal
        if (abortControllerRef.current) {
          abortControllerRef.current.signal.addEventListener('abort', () => {
            xhr.abort();
          });
        }

        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadStatus({
        status: 'error',
        progress: 0,
        error: errorMessage,
      });
      onUploadError?.(errorMessage);
    }
  }, [acceptedFileTypes, maxFileSize, getUploadUrl, onUploadComplete, onUploadError]);

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const file = files[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (uploadStatus.status === 'uploading') return;
    if (isDeadlinePassed) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [uploadStatus.status, isDeadlinePassed, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (uploadStatus.status !== 'uploading' && !isDeadlinePassed) {
      setIsDragOver(true);
    }
  }, [uploadStatus.status, isDeadlinePassed]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  }, [handleFileSelect]);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploadStatus({
        status: 'pending',
        progress: 0,
      });
    }
  }, []);

  const getStatusPill = () => {
    switch (uploadStatus.status) {
      case 'uploaded':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Uploaded</Badge>;
      case 'awaiting_deadline':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Awaiting Deadline</Badge>;
      case 'opened':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Lock className="w-3 h-3 mr-1" />Opened</Badge>;
      case 'uploading':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Uploading...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const canUpload = uploadStatus.status === 'pending' || uploadStatus.status === 'error';
  const showDropZone = canUpload && !isDeadlinePassed;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          {getStatusPill()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <AnimatePresence mode="wait">
          {showDropZone ? (
            <motion.div
              key="drop-zone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                Drag & drop your {submissionType} proposal here
              </p>
              <p className="text-xs text-gray-500">
                or <span className="text-blue-600 underline">browse files</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Max {maxFileSize}MB • {acceptedFileTypes.join(', ')}
              </p>
            </motion.div>
          ) : uploadStatus.status === 'uploading' ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700 truncate">{uploadStatus.fileName}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelUpload}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <Progress value={uploadStatus.progress} className="w-full" />
              <p className="text-xs text-gray-500 text-center">
                {uploadStatus.progress}% uploaded
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">{uploadStatus.fileName}</span>
              </div>
              {uploadStatus.uploadedAt && (
                <p className="text-xs text-gray-500">
                  Uploaded {new Date(uploadStatus.uploadedAt).toLocaleString()}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {uploadStatus.status === 'error' && uploadStatus.error && (
          <Alert variant="destructive">
            <AlertDescription>{uploadStatus.error}</AlertDescription>
          </Alert>
        )}

        {/* Deadline Info */}
        <div className="text-xs text-gray-500 text-center">
          Deadline: {new Date(proposalDue).toLocaleString()}
          {isDeadlinePassed && (
            <span className="block text-red-600 mt-1">Deadline has passed</span>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Action Buttons */}
        {uploadStatus.status === 'error' && (
          <Button 
            onClick={() => setUploadStatus({ status: 'pending', progress: 0 })}
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BidUploadCard;

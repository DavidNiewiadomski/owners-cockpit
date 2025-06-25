
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadDropzoneProps {
  projectId: string | null;
  onClose: () => void;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ projectId, onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    if (!projectId) return;

    const _uploadId = Date.now() + Math.random();
    const newUpload: UploadProgress = {
      file,
      progress: 0,
      status: 'uploading'
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project_id', projectId);

      // Simulate upload progress
      const updateProgress = (progress: number) => {
        setUploads(prev => prev.map(upload => 
          upload.file === file ? { ...upload, progress } : upload
        ));
      };

      // Simulate progress updates
      for (let i = 0; i <= 90; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(i);
      }

      const response = await fetch('/functions/v1/ingestUpload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase-token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { 
              ...upload, 
              progress: 100, 
              status: 'success',
              message: `${result.chunks_saved || 0} chunks processed`
            } 
          : upload
      ));

    } catch (error) {
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { 
              ...upload, 
              status: 'error',
              message: error instanceof Error ? error.message : 'Upload failed'
            } 
          : upload
      ));
    }
  }, [projectId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
  }, [uploadFile]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="neumorphic-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Upload Documents</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!projectId ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Please select a project first
            </p>
          </div>
        ) : (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Supports PDF, Word, Excel, Images (PNG, JPG)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline" className="neumorphic-button">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
            </div>

            {uploads.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Upload Progress</h4>
                {uploads.map((upload, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {upload.file.name}
                      </p>
                      {upload.status === 'uploading' && (
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      )}
                      {upload.message && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {upload.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {upload.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {upload.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default UploadDropzone;

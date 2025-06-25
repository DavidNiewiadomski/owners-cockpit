
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { FileText, Image, Loader2 } from 'lucide-react';
import type { Citation } from '@/hooks/useChatRag';
import DocumentViewer from './DocumentViewer';
import DocumentMetadata from './DocumentMetadata';
import CitationContent from './CitationContent';

interface SourceModalProps {
  citation: Citation | null;
  sourceId?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentData {
  file_path: string;
  title: string;
  mime_type: string;
  file_size: number;
}

const SourceModal: React.FC<SourceModalProps> = ({ 
  citation, 
  sourceId, 
  isOpen, 
  onClose 
}) => {
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Supabase environment variables are available
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const hasSupabaseConfig = supabaseUrl && supabaseAnonKey;

  // Initialize Supabase client only if credentials are available
  const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;

  const fetchDocumentData = useCallback(async () => {
    if (!sourceId) return;

    // If no Supabase configuration, show error
    if (!hasSupabaseConfig || !supabase) {
      setError('Supabase configuration is not available. Please connect to Supabase to view documents.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch document metadata from database
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('file_path, title, mime_type, file_size')
        .eq('id', sourceId)
        .single();

      if (docError) throw docError;

      setDocumentData(doc);

      // Get signed URL for the file
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 3600); // 1 hour expiry

      if (urlError) throw urlError;

      setFileUrl(urlData.signedUrl);
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document');
    } finally {
      setIsLoading(false);
    }
  }, [sourceId, hasSupabaseConfig, supabase]);

  useEffect(() => {
    if (isOpen && sourceId) {
      fetchDocumentData();
    }
  }, [isOpen, sourceId, fetchDocumentData]);

  const getSourceIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="w-4 h-4" />;
    
    if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    
    return <FileText className="w-4 h-4" />;
  };

  if (!citation && !sourceId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] neumorphic-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSourceIcon(documentData?.mime_type || citation?.source)}
            {documentData?.title || 'Source Document'}
          </DialogTitle>
          <DialogDescription>
            {sourceId ? 'Document viewer and source information' : 'Document excerpt and source information'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading document...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <p className="text-destructive text-sm">{error}</p>
              {!hasSupabaseConfig && (
                <p className="text-muted-foreground text-xs mt-2">
                  To enable document viewing, please connect your project to Supabase.
                </p>
              )}
            </Card>
          )}

          {/* Document Metadata */}
          <DocumentMetadata
            documentData={documentData}
            citation={citation}
            sourceId={sourceId}
          />

          {/* Document Viewer */}
          {fileUrl && documentData && !isLoading && (
            <DocumentViewer
              fileUrl={fileUrl}
              mimeType={documentData.mime_type}
              title={documentData.title}
            />
          )}

          {/* Citation Content */}
          {citation && (
            <CitationContent citation={citation} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SourceModal;

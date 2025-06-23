import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Citation } from '@/hooks/useChatRag';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Supabase environment variables are available
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const hasSupabaseConfig = supabaseUrl && supabaseAnonKey;

  // Initialize Supabase client only if credentials are available
  const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;

  useEffect(() => {
    if (isOpen && sourceId) {
      fetchDocumentData();
    }
  }, [isOpen, sourceId]);

  const fetchDocumentData = async () => {
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

      // If it's a PDF, initialize PDF.js
      if (doc.mime_type === 'application/pdf') {
        loadPdf(urlData.signedUrl);
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPdf = async (url: string) => {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF document');
    }
  };

  const renderPdfPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const context = canvasRef.getContext('2d');

      canvasRef.height = viewport.height;
      canvasRef.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering PDF page:', err);
    }
  };

  useEffect(() => {
    if (pdfDoc && canvasRef && currentPage) {
      renderPdfPage(currentPage);
    }
  }, [pdfDoc, canvasRef, currentPage]);

  const getSourceIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="w-4 h-4" />;
    
    if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    
    return <FileText className="w-4 h-4" />;
  };

  const isPdf = documentData?.mime_type === 'application/pdf';
  const isImage = documentData?.mime_type?.startsWith('image/');

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

          {/* Document Info */}
          {documentData && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">
                {documentData.file_path.split('/').pop()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {(documentData.file_size / 1024).toFixed(1)} KB
              </Badge>
              <Badge variant="outline" className="text-xs">
                {documentData.mime_type}
              </Badge>
            </div>
          )}

          {/* Citation Source Info (fallback) */}
          {citation && !documentData && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {citation.source}
              </Badge>
              {citation.page && (
                <Badge variant="secondary" className="text-xs">
                  Page {citation.page}
                </Badge>
              )}
            </div>
          )}

          {/* PDF Viewer */}
          {isPdf && fileUrl && !isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Card className="p-4 bg-muted/30 border-border/40">
                <div className="flex justify-center">
                  <canvas
                    ref={setCanvasRef}
                    className="max-w-full border border-border/20 rounded"
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Image Viewer */}
          {isImage && fileUrl && !isLoading && (
            <Card className="p-4 bg-muted/30 border-border/40">
              <div className="flex justify-center">
                <img
                  src={fileUrl}
                  alt={documentData?.title || 'Document image'}
                  className="max-w-full max-h-96 object-contain rounded border border-border/20"
                />
              </div>
            </Card>
          )}

          {/* Citation Content (fallback or additional info) */}
          {citation?.snippet && (
            <Card className="p-4 bg-muted/30 border-border/40">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
                  {citation.snippet}
                </p>
              </div>
            </Card>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Referenced in conversation</span>
            </div>
            {(citation?.id || sourceId) && (
              <Badge variant="outline" className="text-xs">
                ID: {(citation?.id || sourceId)?.slice(0, 8)}...
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SourceModal;

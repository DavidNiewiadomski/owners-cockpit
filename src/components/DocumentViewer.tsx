
import React, { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  fileUrl: string;
  mimeType: string;
  title?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileUrl, mimeType, title }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPdf = mimeType === 'application/pdf';
  const isImage = mimeType?.startsWith('image/');

  useEffect(() => {
    if (isPdf && fileUrl) {
      loadPdf(fileUrl);
    }
  }, [isPdf, fileUrl]);

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

  const renderPdfPage = useCallback(async (pageNum: number) => {
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
  }, [pdfDoc, canvasRef]);

  useEffect(() => {
    if (pdfDoc && canvasRef && currentPage) {
      renderPdfPage(currentPage);
    }
  }, [pdfDoc, canvasRef, currentPage, renderPdfPage]);

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 border-destructive/20">
        <p className="text-destructive text-sm">{error}</p>
      </Card>
    );
  }

  if (isPdf) {
    return (
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
    );
  }

  if (isImage) {
    return (
      <Card className="p-4 bg-muted/30 border-border/40">
        <div className="flex justify-center">
          <img
            src={fileUrl}
            alt={title || 'Document image'}
            className="max-w-full max-h-96 object-contain rounded border border-border/20"
          />
        </div>
      </Card>
    );
  }

  return null;
};

export default DocumentViewer;

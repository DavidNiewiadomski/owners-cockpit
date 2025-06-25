
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import type { Citation } from '@/hooks/useChatRag';

interface DocumentData {
  file_path: string;
  title: string;
  mime_type: string;
  file_size: number;
}

interface DocumentMetadataProps {
  documentData?: DocumentData | null;
  citation?: Citation | null;
  sourceId?: string;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ 
  documentData, 
  citation, 
  sourceId 
}) => {
  return (
    <div className="space-y-4">
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
  );
};

export default DocumentMetadata;

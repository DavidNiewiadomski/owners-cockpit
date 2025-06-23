
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FileText, Image, Calendar } from 'lucide-react';
import { Citation } from '@/hooks/useChatRag';

interface SourceModalProps {
  citation: Citation | null;
  isOpen: boolean;
  onClose: () => void;
}

const SourceModal: React.FC<SourceModalProps> = ({ citation, isOpen, onClose }) => {
  if (!citation) return null;

  const getSourceIcon = (source?: string) => {
    if (!source) return <FileText className="w-4 h-4" />;
    
    if (source.includes('image') || source.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image className="w-4 h-4" />;
    }
    
    return <FileText className="w-4 h-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl neumorphic-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSourceIcon(citation.source)}
            Source Document
          </DialogTitle>
          <DialogDescription>
            Document excerpt and source information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Source Info */}
          {citation.source && (
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

          {/* Content */}
          <Card className="p-4 bg-muted/30 border-border/40">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
                {citation.snippet}
              </p>
            </div>
          </Card>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Referenced in conversation</span>
            </div>
            <Badge variant="outline" className="text-xs">
              ID: {citation.id.slice(0, 8)}...
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SourceModal;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink } from 'lucide-react';
import { Citation } from '@/hooks/useChatRag';

interface CitationChipProps {
  citation: Citation;
  index: number;
  onClick: (citation: Citation) => void;
}

const CitationChip: React.FC<CitationChipProps> = ({ citation, index, onClick }) => {
  return (
    <Badge
      variant="outline"
      className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 text-xs gap-1 neumorphic-button"
      onClick={() => onClick(citation)}
    >
      <FileText className="w-3 h-3" />
      <span>{index + 1}</span>
      <ExternalLink className="w-2 h-2 opacity-60" />
    </Badge>
  );
};

export default CitationChip;

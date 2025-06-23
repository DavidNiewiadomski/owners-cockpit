
import React from 'react';
import { Card } from '@/components/ui/card';
import { Citation } from '@/hooks/useChatRag';

interface CitationContentProps {
  citation: Citation;
}

const CitationContent: React.FC<CitationContentProps> = ({ citation }) => {
  if (!citation.snippet) {
    return null;
  }

  return (
    <Card className="p-4 bg-muted/30 border-border/40">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
          {citation.snippet}
        </p>
      </div>
    </Card>
  );
};

export default CitationContent;

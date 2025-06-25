
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, Check, X } from 'lucide-react';
import type { ThemeSuggestion } from '@/types/theme';
import { useThemeController } from '@/hooks/useThemeController';

interface ThemeSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: ThemeSuggestion[];
  onApplySuggestion: (suggestion: ThemeSuggestion) => Promise<void>;
}

export const ThemeSuggestionModal: React.FC<ThemeSuggestionModalProps> = ({
  isOpen,
  onClose,
  suggestions,
  onApplySuggestion
}) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const { previewChanges, clearPreview } = useThemeController();

  const handlePreview = async (suggestion: ThemeSuggestion) => {
    await previewChanges(suggestion.changes);
  };

  const handleApply = async (suggestion: ThemeSuggestion) => {
    setIsApplying(suggestion.id);
    try {
      await onApplySuggestion(suggestion);
      setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    } finally {
      setIsApplying(null);
    }
  };

  const getSuggestionIcon = (type: ThemeSuggestion['type']) => {
    switch (type) {
      case 'theme_switch':
        return '🌓';
      case 'widget_highlight':
        return '🎯';
      case 'color_adjustment':
        return '🎨';
      case 'layout_change':
        return '📐';
      default:
        return '✨';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Theme Suggestions
          </DialogTitle>
          <DialogDescription>
            AI has analyzed your dashboard and suggests these theme improvements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No theme suggestions available at this time.</p>
                <p className="text-sm">Your current setup looks great!</p>
              </CardContent>
            </Card>
          ) : (
            suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="relative">
                {appliedSuggestions.has(suggestion.id) && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Applied
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                    {suggestion.title}
                  </CardTitle>
                  <CardDescription>{suggestion.description}</CardDescription>
                  
                  {suggestion.context && (
                    <Badge variant="outline" className="w-fit text-xs">
                      {suggestion.context}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(suggestion)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleApply(suggestion)}
                      disabled={appliedSuggestions.has(suggestion.id) || isApplying === suggestion.id}
                      className="flex items-center gap-1"
                    >
                      {isApplying === suggestion.id ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : appliedSuggestions.has(suggestion.id) ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {appliedSuggestions.has(suggestion.id) ? 'Applied' : 'Apply'}
                    </Button>
                  </div>

                  {suggestion.changes.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        View technical changes ({suggestion.changes.length})
                      </summary>
                      <div className="mt-2 space-y-1">
                        {suggestion.changes.map((change, index) => (
                          <div key={index} className="text-xs bg-muted p-2 rounded font-mono">
                            <span className="text-blue-600 dark:text-blue-400">{change.type}</span>
                            {' → '}
                            <span className="text-green-600 dark:text-green-400">{change.target}</span>
                            {' = '}
                            <span className="text-orange-600 dark:text-orange-400">{change.value}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={clearPreview}>
            Clear Preview
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-1" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette } from 'lucide-react';
import { ThemeSuggestionModal } from './ThemeSuggestionModal';
import { useAIThemeAssistant } from '@/hooks/useAIThemeAssistant';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AIThemeAssistantProps {
  activeWidgets?: string[];
  context?: {
    activity?: string;
    timeOfDay?: string;
  };
}

export const AIThemeAssistant: React.FC<AIThemeAssistantProps> = ({
  activeWidgets = [],
  context
}) => {
  const {
    suggestions,
    isGenerating,
    showSuggestions,
    generateSuggestions,
    applySuggestion,
    dismissSuggestions,
    setShowSuggestions
  } = useAIThemeAssistant();

  // Memoize activeWidgets string to avoid unnecessary re-renders
  const activeWidgetsKey = useMemo(() => activeWidgets.join(','), [activeWidgets]);
  
  // Auto-generate suggestions when widgets change significantly
  useEffect(() => {
    if (activeWidgets.length > 0) {
      const timer = setTimeout(() => {
        generateSuggestions({ activeWidgets, ...context });
      }, 2000); // Delay to avoid too frequent generations

      return () => clearTimeout(timer);
    }
  }, [activeWidgetsKey, activeWidgets, generateSuggestions, context]);

  return (
    <>
      {/* Floating suggestion notification */}
      <AnimatePresence>
        {suggestions.length > 0 && !showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <Button
              onClick={() => setShowSuggestions(true)}
              className="relative shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              AI Theme Suggestions
              <Badge 
                variant="secondary" 
                className="ml-2 bg-white/20 text-white border-white/30"
              >
                {suggestions.length}
              </Badge>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual trigger button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateSuggestions({ activeWidgets, ...context })}
        disabled={isGenerating}
        className="fixed bottom-4 right-4 z-40 shadow-md"
      >
        {isGenerating ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Palette className="w-4 h-4" />
        )}
        <span className="ml-2 hidden sm:inline">
          {isGenerating ? 'Analyzing...' : 'Theme AI'}
        </span>
      </Button>

      {/* Suggestions modal */}
      <ThemeSuggestionModal
        isOpen={showSuggestions}
        onClose={dismissSuggestions}
        suggestions={suggestions}
        onApplySuggestion={applySuggestion}
      />
    </>
  );
};

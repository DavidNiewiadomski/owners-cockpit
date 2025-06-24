
import { useState, useCallback } from 'react';
import { ThemeSuggestion } from '@/types/theme';
import { ThemeAIService } from '@/services/themeAI';
import { useThemeController } from './useThemeController';
import { useTheme } from '@/components/ThemeProvider';

export const useAIThemeAssistant = () => {
  const [suggestions, setSuggestions] = useState<ThemeSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { applyChanges } = useThemeController();
  const { theme } = useTheme();

  const generateSuggestions = useCallback(async (context?: {
    activeWidgets?: string[];
    activity?: string;
    timeOfDay?: string;
  }) => {
    setIsGenerating(true);
    
    try {
      const aiService = ThemeAIService.getInstance();
      const currentTime = new Date().getHours();
      const timeOfDay = currentTime < 12 ? 'morning' : currentTime < 18 ? 'afternoon' : 'evening';
      
      const suggestions = await aiService.generateSuggestions({
        currentTheme: theme,
        activeWidgets: context?.activeWidgets || [],
        timeOfDay: context?.timeOfDay || timeOfDay,
        activity: context?.activity
      });
      
      setSuggestions(suggestions);
      
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to generate theme suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [theme]);

  const applySuggestion = useCallback(async (suggestion: ThemeSuggestion) => {
    await applyChanges(suggestion.changes);
    
    // Remove applied suggestion from the list
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  }, [applyChanges]);

  const dismissSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isGenerating,
    showSuggestions,
    generateSuggestions,
    applySuggestion,
    dismissSuggestions,
    setShowSuggestions
  };
};

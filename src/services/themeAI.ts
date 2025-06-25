
import type { ThemeSuggestion } from '@/types/theme';

export class ThemeAIService {
  private static instance: ThemeAIService;
  
  static getInstance(): ThemeAIService {
    if (!ThemeAIService.instance) {
      ThemeAIService.instance = new ThemeAIService();
    }
    return ThemeAIService.instance;
  }

  async generateSuggestions(context: {
    currentTheme: string;
    activeWidgets: string[];
    timeOfDay?: string;
    activity?: string;
  }): Promise<ThemeSuggestion[]> {
    // Simulate AI analysis and generate contextual suggestions
    const suggestions: ThemeSuggestion[] = [];

    // Time-based suggestions
    if (context.timeOfDay === 'morning' && context.currentTheme === 'dark') {
      suggestions.push({
        id: 'morning-light-mode',
        type: 'theme_switch',
        title: 'Switch to Light Mode',
        description: 'Light mode is easier on the eyes during morning work sessions',
        changes: [{
          type: 'theme_mode',
          target: 'theme',
          value: 'light'
        }],
        context: 'Time-based optimization'
      });
    }

    // Activity-based suggestions
    if (context.activity === 'printing') {
      suggestions.push({
        id: 'print-friendly-theme',
        type: 'theme_switch',
        title: 'Enable Print-Friendly Mode',
        description: 'Optimize colors and contrast for better printing results',
        changes: [
          {
            type: 'css_variable',
            target: '--background',
            value: '0 0% 100%'
          },
          {
            type: 'css_variable',
            target: '--foreground',
            value: '222.2 84% 4.9%'
          }
        ],
        context: 'Print optimization'
      });
    }

    // Widget-specific suggestions
    if (context.activeWidgets.includes('construction-progress')) {
      suggestions.push({
        id: 'highlight-progress-widget',
        type: 'widget_highlight',
        title: 'Highlight Construction Progress',
        description: 'Add accent border to emphasize the construction progress widget',
        changes: [{
          type: 'widget_accent',
          target: 'construction-progress',
          value: 'border-l-4 border-l-blue-500 shadow-lg'
        }],
        context: 'Widget focus enhancement'
      });
    }

    // Budget widget highlighting
    if (context.activeWidgets.includes('budget-kpi')) {
      suggestions.push({
        id: 'highlight-budget-widget',
        type: 'widget_highlight',
        title: 'Highlight Budget Widget',
        description: 'Make budget information more prominent with accent styling',
        changes: [{
          type: 'widget_accent',
          target: 'budget-kpi',
          value: 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-950'
        }],
        context: 'Budget focus'
      });
    }

    return suggestions;
  }

  async analyzeDashboard(widgetIds: string[]): Promise<ThemeSuggestion[]> {
    // Analyze current dashboard composition and suggest improvements
    const contextualSuggestions: ThemeSuggestion[] = [];
    
    // If many widgets are present, suggest compact mode
    if (widgetIds.length > 6) {
      contextualSuggestions.push({
        id: 'compact-dashboard',
        type: 'layout_change',
        title: 'Enable Compact Mode',
        description: 'Reduce spacing between widgets for better overview of many items',
        changes: [{
          type: 'css_variable',
          target: '--dashboard-gap',
          value: '0.5rem'
        }],
        context: 'Dashboard density optimization'
      });
    }

    return contextualSuggestions;
  }
}

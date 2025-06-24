
export interface ThemeSuggestion {
  id: string;
  type: 'theme_switch' | 'widget_highlight' | 'color_adjustment' | 'layout_change';
  title: string;
  description: string;
  preview?: string;
  changes: ThemeChange[];
  context?: string;
}

export interface ThemeChange {
  type: 'css_variable' | 'widget_accent' | 'theme_mode' | 'layout_setting';
  target: string;
  value: string;
  original?: string;
}

export interface UserThemePreferences {
  applied_suggestions: string[];
  custom_overrides: Record<string, string>;
  theme_mode?: 'light' | 'dark' | 'system';
  widget_accents?: Record<string, string>;
  last_updated: string;
}

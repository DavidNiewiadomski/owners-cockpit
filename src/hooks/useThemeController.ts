
import { useState, useCallback } from 'react';
import { ThemeChange, UserThemePreferences } from '@/types/theme';
import { useTheme } from '@/components/ThemeProvider';

export const useThemeController = () => {
  const { theme, setTheme } = useTheme();
  const [previewActive, setPreviewActive] = useState(false);
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});

  const applyThemeChange = useCallback((change: ThemeChange) => {
    switch (change.type) {
      case 'theme_mode':
        setTheme(change.value as 'light' | 'dark' | 'system');
        break;
        
      case 'css_variable':
        const root = document.documentElement;
        const currentValue = getComputedStyle(root).getPropertyValue(change.target);
        
        // Store original value for potential rollback
        if (!originalValues[change.target]) {
          setOriginalValues(prev => ({
            ...prev,
            [change.target]: currentValue
          }));
        }
        
        root.style.setProperty(change.target, change.value);
        break;
        
      case 'widget_accent':
        // Apply widget-specific accent classes
        const widgets = document.querySelectorAll(`[data-widget-id="${change.target}"]`);
        widgets.forEach(widget => {
          if (widget instanceof HTMLElement) {
            // Store original classes
            const originalClass = widget.getAttribute('data-original-class') || widget.className;
            widget.setAttribute('data-original-class', originalClass);
            
            // Apply new classes
            widget.className = `${originalClass} ${change.value}`;
          }
        });
        break;
        
      case 'layout_setting':
        // Apply layout-specific changes
        document.documentElement.style.setProperty(change.target, change.value);
        break;
    }
  }, [originalValues, setTheme]);

  const previewChanges = useCallback(async (changes: ThemeChange[]) => {
    setPreviewActive(true);
    
    changes.forEach(change => {
      applyThemeChange(change);
    });
    
    // Auto-clear preview after 10 seconds
    setTimeout(() => {
      if (previewActive) {
        clearPreview();
      }
    }, 10000);
  }, [applyThemeChange, previewActive]);

  const clearPreview = useCallback(() => {
    if (!previewActive) return;
    
    // Restore original CSS variables
    const root = document.documentElement;
    Object.entries(originalValues).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Restore original widget classes
    const widgets = document.querySelectorAll('[data-original-class]');
    widgets.forEach(widget => {
      if (widget instanceof HTMLElement) {
        const originalClass = widget.getAttribute('data-original-class');
        if (originalClass) {
          widget.className = originalClass;
          widget.removeAttribute('data-original-class');
        }
      }
    });
    
    setPreviewActive(false);
    setOriginalValues({});
  }, [originalValues, previewActive]);

  const applyChanges = useCallback(async (changes: ThemeChange[]) => {
    changes.forEach(change => {
      applyThemeChange(change);
    });
    
    // Save to user preferences
    const preferences: UserThemePreferences = {
      applied_suggestions: [],
      custom_overrides: originalValues,
      theme_mode: theme,
      last_updated: new Date().toISOString()
    };
    
    localStorage.setItem('user_theme_preferences', JSON.stringify(preferences));
    
    // Clear preview state since changes are now permanent
    setPreviewActive(false);
    setOriginalValues({});
  }, [applyThemeChange, originalValues, theme]);

  return {
    previewChanges,
    clearPreview,
    applyChanges,
    previewActive
  };
};

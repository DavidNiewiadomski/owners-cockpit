
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="neumorphic-button relative overflow-hidden transition-transform hover:scale-105"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </Button>
  );
};

export default ThemeToggle;

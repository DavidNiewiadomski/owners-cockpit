
import { useEffect } from 'react';
import type { ActiveView } from './useAppState';

interface UseKeyboardShortcutsProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const useKeyboardShortcuts = ({ activeView, setActiveView }: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'c':
            if (activeView !== 'communications') {
              event.preventDefault();
              setActiveView('communications');
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, setActiveView]);
};

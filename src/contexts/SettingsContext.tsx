
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/lib/i18n';

interface SettingsContextType {
  language: string;
  timezone: string;
  setLanguage: (lang: string) => void;
  setTimezone: (tz: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  
  const [timezone, setTimezoneState] = useState(() => {
    return localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
  };

  const setTimezone = (tz: string) => {
    setTimezoneState(tz);
    localStorage.setItem('timezone', tz);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <SettingsContext.Provider value={{
      language,
      timezone,
      setLanguage,
      setTimezone
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

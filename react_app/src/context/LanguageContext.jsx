import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = ['en', 'es'];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Get initial language from localStorage if available, defaulting to 'en'
    const savedLang = window.localStorage.getItem('preferredLanguage');
    return SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en';
  });

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    // Safely store language preference
    try {
      window.localStorage.setItem('preferredLanguage', newLang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, [language]);

  const t = useCallback((key) => {
    try {
      // Validate language
      if (!SUPPORTED_LANGUAGES.includes(language)) {
        console.error(`Unsupported language: ${language}`);
        return translations.en[key] || key;
      }
      
      // Validate translation key
      if (!translations[language][key]) {
        console.error(`Missing translation key: ${key}`);
        return key;
      }
      
      return translations[language][key];
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  }, [language]);

  const value = {
    language,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
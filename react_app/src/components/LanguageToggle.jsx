import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 bg-rose-gold text-white px-4 py-2 rounded-md hover:bg-rose-gold-dark transition-colors duration-200 shadow-md"
    >
      {language === 'en' ? 'Español' : 'English'}
    </button>
  );
}

export default LanguageToggle; 
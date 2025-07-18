import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Navigation() {
  const { t, toggleLanguage, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-rose-gold hover:text-rose-gold-dark focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:space-x-8">
            <Link to="/" className="nav-link flex items-center">
              {t('home')}
            </Link>
            <Link to="/our-story" className="nav-link flex items-center">
              {t('ourStory')}
            </Link>
            <Link to="/event-details" className="nav-link flex items-center">
              {t('eventDetails')}
            </Link>
            <Link to="/travel" className="nav-link flex items-center">
              {t('travel')}
            </Link>
            <Link to="/rsvp" className="nav-link flex items-center">
              {t('rsvp')}
            </Link>
          </div>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 text-rose-gold hover:text-rose-gold-dark transition-colors duration-200"
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-4 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-rose-gold hover:bg-rose-gold/5"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              to="/our-story"
              className="block px-3 py-2 text-base font-medium text-rose-gold hover:bg-rose-gold/5"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('ourStory')}
            </Link>
            <Link
              to="/event-details"
              className="block px-3 py-2 text-base font-medium text-rose-gold hover:bg-rose-gold/5"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('eventDetails')}
            </Link>
            <Link
              to="/travel"
              className="block px-3 py-2 text-base font-medium text-rose-gold hover:bg-rose-gold/5"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('travel')}
            </Link>
            <Link
              to="/rsvp"
              className="block px-3 py-2 text-base font-medium text-rose-gold hover:bg-rose-gold/5"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('rsvp')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 
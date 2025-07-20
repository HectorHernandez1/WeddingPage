import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RoseCorner, DraperyCurtain, FloralCornerDecoration } from '../components/DecorativeElements';

function Home() {
  const { t } = useLanguage();

  return (
    <div className="page-container relative min-h-[80vh] flex items-center justify-center">
      <DraperyCurtain />
      <RoseCorner position="top-left" />
      <RoseCorner position="top-right" />
      <RoseCorner position="bottom-left" />
      <RoseCorner position="bottom-right" />
      
      <div className="text-center max-w-4xl mx-auto card p-12 relative z-10 bg-white/95">
        <FloralCornerDecoration className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
        <FloralCornerDecoration className="top-0 right-0 translate-x-1/2 -translate-y-1/2 rotate-90" />
        <FloralCornerDecoration className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2 -rotate-90" />
        <FloralCornerDecoration className="bottom-0 right-0 translate-x-1/2 translate-y-1/2 rotate-180" />
        
        <div className="relative">
          <h1 className="couple-names decorative-border inline-block px-8 py-4">
            {t('coupleNames')}
          </h1>
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-rose-gold/30"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-rose-gold/30"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-rose-gold/30"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-rose-gold/30"></div>
        </div>
        
        <div className="romantic-text mb-4">
          {t('gettingMarried')}
        </div>
        <div className="date-display mb-8">
          August 8, 2026
        </div>
        <div className="max-w-2xl mx-auto relative">
          <div className="detail-text mb-4">
            {t('joinUs')}
          </div>
          <div className="elegant-heading mb-2">
            Durango, DGO Mexico
          </div>
          {/*<div className="detail-text">
            <br />123 Elegant Avenue
            Durango Mexico<br />
          </div>*/}
        </div>
      </div>
    </div>
  );
}

export default Home; 
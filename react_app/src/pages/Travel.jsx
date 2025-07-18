import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FloralCornerDecoration, FloralDivider } from '../components/DecorativeElements';

function Travel() {
  const { t } = useLanguage();

  return (
    <div className="page-container relative">
      <FloralCornerDecoration className="top-0 right-0" />
      <FloralCornerDecoration className="bottom-0 left-0 rotate-180" />
      
      <h1 className="section-title relative">
        {t('travelTitle')}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
      </h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hotel Block */}
        <section className="card p-8 relative group">
          <FloralCornerDecoration className="top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h2 className="text-2xl text-rose-gold mb-6 font-light">{t('hotelAccommodations')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl text-rose-gold-dark mb-2 font-medium">The Grand Hotel</h3>
                <p className="text-gray-600">[Venue Address]</p>
                <div className="mt-6 card p-6 bg-white/50 backdrop-blur-sm">
                  <p className="font-medium text-rose-gold mb-3">{t('roomBlock')}:</p>
                  <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                    <li>Rate: $250/night</li>
                    <li>Block Code: SMITH2024</li>
                    <li>Cut-off Date: August 15, 2024</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FloralDivider />

        {/* Transportation */}
        <section className="card p-8 relative group">
          <FloralCornerDecoration className="top-0 left-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h2 className="text-2xl text-rose-gold mb-6 font-light">{t('transportation')}</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl text-rose-gold-dark mb-3 font-medium">{t('fromAirport')}</h3>
                <p className="text-gray-600 mb-4">{t('airportInfo')}</p>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                  <li>Taxi service available at all terminals</li>
                  <li>Uber/Lyft pickup at designated areas</li>
                  <li>Hotel shuttle service available (reservation required)</li>
                </ul>
              </div>
              
              <div className="border-t border-rose-gold/10 pt-6">
                <h3 className="text-xl text-rose-gold-dark mb-3 font-medium">{t('parking')}</h3>
                <p className="text-gray-600">{t('parkingDetails')}</p>
              </div>
            </div>
          </div>
        </section>

        <FloralDivider />

        {/* Local Attractions */}
        <section className="card p-8 relative group">
          <FloralCornerDecoration className="bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h2 className="text-2xl text-rose-gold mb-6 font-light">{t('localAttractions')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-6 bg-white/50 backdrop-blur-sm">
                <h3 className="text-xl text-rose-gold-dark mb-4 font-medium">{t('dining')}</h3>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                  <li>The Italian Place (0.2 miles)</li>
                  <li>Ocean Fresh Seafood (0.5 miles)</li>
                  <li>The Steakhouse (0.3 miles)</li>
                </ul>
              </div>
              <div className="card p-6 bg-white/50 backdrop-blur-sm">
                <h3 className="text-xl text-rose-gold-dark mb-4 font-medium">{t('activities')}</h3>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                  <li>Central Park (1 mile)</li>
                  <li>Metropolitan Museum (1.5 miles)</li>
                  <li>Broadway Shows (0.8 miles)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Travel; 
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RoseCorner, FloralCornerDecoration } from '../components/DecorativeElements';

function EventDetails() {
  const { t } = useLanguage();

  const events = [
    {
      titleKey: 'ceremony',
      time: '3:00 PM - 4:00 PM',
      location: 'The Grand Hotel - Garden Terrace',
      detailsKey: 'ceremonyDetails',
      dressCodeKey: 'dressCode'
    },
    {
      titleKey: 'cocktailHour',
      time: '4:00 PM - 5:00 PM',
      location: 'The Grand Hotel - Sunset Lounge',
      detailsKey: 'cocktailDetails',
      dressCodeKey: 'dressCode'
    },
    {
      titleKey: 'reception',
      time: '5:00 PM - 11:00 PM',
      location: 'The Grand Hotel - Crystal Ballroom',
      detailsKey: 'receptionDetails',
      dressCodeKey: 'dressCode'
    }
  ];

  return (
    <div className="page-container relative">
      <RoseCorner position="top-right" />
      <RoseCorner position="bottom-left" />
      
      <h1 className="section-title relative">
        {t('eventDetailsTitle')}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
      </h1>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="grid gap-8 md:grid-cols-3">
          {events.map((event, index) => (
            <div key={index} className="event-card relative group">
              <FloralCornerDecoration className="top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <h3 className="text-xl text-rose-gold mb-4 font-medium">{t(event.titleKey)}</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium text-rose-gold-dark">{t('time')}:</span>
                    <br className="md:hidden" /> {event.time}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-rose-gold-dark">{t('location')}:</span>
                    <br className="md:hidden" /> {event.location}
                  </p>
                  <p className="text-gray-600 mt-4 leading-relaxed">{t(event.detailsKey)}</p>
                  <p className="text-rose-gold mt-4 text-sm font-medium">{t(event.dressCodeKey)}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetails; 
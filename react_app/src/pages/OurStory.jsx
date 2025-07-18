import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FloralDivider, FloralCornerDecoration } from '../components/DecorativeElements';

function OurStory() {
  const { t } = useLanguage();

  const timeline = [
    {
      date: 'June 2020',
      titleKey: 'firstMeeting',
      descriptionKey: 'firstMeetingDesc'
    },
    {
      date: 'December 2020',
      titleKey: 'firstDate',
      descriptionKey: 'firstDateDesc'
    },
    {
      date: 'August 2022',
      titleKey: 'proposal',
      descriptionKey: 'proposalDesc'
    }
  ];

  return (
    <div className="page-container relative">
      <FloralCornerDecoration className="top-0 right-0" />
      <FloralCornerDecoration className="bottom-0 left-0 rotate-180" />
      
      <h1 className="section-title relative">
        {t('ourStoryTitle')}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
      </h1>
      
      <div className="max-w-3xl mx-auto card p-8 relative">
        <div className="space-y-8">
          {timeline.map((event, index) => (
            <React.Fragment key={index}>
              <div className="timeline-card relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-rose-gold/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-rose-gold rounded-full"></div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="md:w-1/3">
                    <div className="text-rose-gold-dark font-medium">{event.date}</div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl text-rose-gold mb-2 font-medium">{t(event.titleKey)}</h3>
                    <p className="text-gray-600 leading-relaxed">{t(event.descriptionKey)}</p>
                  </div>
                </div>
              </div>
              {index < timeline.length - 1 && <FloralDivider />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OurStory; 
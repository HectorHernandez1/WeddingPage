import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import EventDetails from './pages/EventDetails';
import Travel from './pages/Travel';
import RSVP from './pages/RSVP';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-rose-gold-light/10 to-rose-gold/5 flex flex-col">
          {/* Safe area padding for iOS */}
          <div className="safe-area-top" />
          <Navigation />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-safe">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/event-details" element={<EventDetails />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/rsvp" element={<RSVP />} />
            </Routes>
          </main>
          {/* Safe area padding for iOS */}
          <div className="safe-area-bottom" />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App; 
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RoseCorner, FloralCornerDecoration } from '../components/DecorativeElements';

function RSVP() {
  const { t, language } = useLanguage();
  const defaultCountryCode = language === 'en' ? '+1' : '+52';
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    countryCode: defaultCountryCode,
    relationship: 'friend',
    householdCount: '1',
    foodAllergies: '',
    isVisitingVenue: false,
    arrivalDate: '',
    additionalNotes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);

  // Input validation functions
  const validateFullName = (name) => {
    return name.length >= 2 && name.length <= 100 && /^[a-zA-ZÀ-ÿ\s'.-]+$/i.test(name);
  };

  const validatePhoneNumber = (phone, countryCode) => {
    const fullNumber = `${countryCode}${phone}`;
    return /^\+\d{1,4}[\d\s()-]{10,}$/.test(fullNumber);
  };

  const validateHouseholdCount = (count) => {
    const num = parseInt(count);
    return !isNaN(num) && num >= 1 && num <= 10;
  };

  const validateDate = (date) => {
    if (!date) return true; // Optional field
    const selectedDate = new Date(date);
    const today = new Date();
    const weddingDate = new Date('2026-02-28');
    return selectedDate >= today && selectedDate <= weddingDate;
  };

  // Sanitize input
  const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '').trim();
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    let sanitizedValue = type === 'checkbox' ? checked : sanitizeInput(value);
    
    setFormData(prevData => ({
      ...prevData,
      [name]: sanitizedValue
    }));
    
    // Only clear error if the field being changed is the one that caused the error
    if (name === 'fullName' && error === t('invalidName') ||
        name === 'phoneNumber' && error === t('invalidPhone') ||
        name === 'householdCount' && error === t('invalidHouseholdCount') ||
        name === 'arrivalDate' && error === t('invalidDate')) {
      setError('');
    }
  }, [error, t]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < 1000) { // 1 second cooldown
      setError(t('pleaseWait'));
      return;
    }
    if (submitCount >= 5) { // Max 5 submissions
      setError(t('tooManySubmissions'));
      return;
    }

    // Validate inputs
    if (!validateFullName(formData.fullName)) {
      setError(t('invalidName'));
      return;
    }
    if (!validatePhoneNumber(formData.phoneNumber, formData.countryCode)) {
      setError(t('invalidPhone'));
      return;
    }
    if (!validateHouseholdCount(formData.householdCount)) {
      setError(t('invalidHouseholdCount'));
      return;
    }
    if (!validateDate(formData.arrivalDate)) {
      setError(t('invalidDate'));
      return;
    }

    try {
      const requestData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber.replace(/[^\d]/g, ''), // Remove non-digits
        countryCode: formData.countryCode,
        guest_relationship: formData.relationship,
        householdCount: parseInt(formData.householdCount, 10), // Convert to integer
        foodAllergies: formData.foodAllergies || null,
        isVisitingVenue: formData.isVisitingVenue,
        arrivalDate: formData.arrivalDate || null,
        additionalNotes: formData.additionalNotes || null
      };

      const response = await fetch('/api/rsvp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        throw new Error(t('submissionError'));
      }

      if (!response.ok) {
        const errorMessage = responseData?.detail?.message || responseData?.detail || t('submissionError');
        throw new Error(errorMessage);
      }

      // Check if this was an update or new submission
      setIsUpdate(responseData.wasUpdated || false);
      setSubmitCount(prev => prev + 1);
      setLastSubmitTime(now);
      setSubmitted(true);
      
      // Clear sensitive data after submission
      setFormData({
        fullName: '',
        phoneNumber: '',
        countryCode: language === 'en' ? '+1' : '+52',
        relationship: 'friend',
        householdCount: '1',
        foodAllergies: '',
        isVisitingVenue: false,
        arrivalDate: '',
        additionalNotes: ''
      });
    } catch (err) {
      setError(err.message || t('submissionError'));
    }
  }, [formData, lastSubmitTime, submitCount, t, language]);

  if (submitted) {
    return (
      <div className="page-container">
        <div className="card p-8 text-center">
          <h2 className="romantic-text text-3xl mb-4">{t('thankYou')}</h2>
          <p className="detail-text mb-4">
            {isUpdate ? t('rsvpUpdated') : t('rsvpConfirmation')}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setError('');
              setIsUpdate(false);
            }}
            className="bg-rose-gold text-white px-6 py-2 rounded-lg hover:bg-rose-gold-dark transition-colors duration-200"
          >
            {t('submitAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container relative">
      <RoseCorner position="top-left" />
      <RoseCorner position="bottom-right" />
      
      <div className="max-w-2xl mx-auto">
        <h1 className="section-title mb-8">{t('rsvpTitle')}</h1>
        
        <form onSubmit={handleSubmit} className="card p-8 relative">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          <FloralCornerDecoration className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
          <FloralCornerDecoration className="bottom-0 right-0 translate-x-1/2 translate-y-1/2 rotate-180" />
          
          {/* Full Name */}
          <div className="mb-6">
            <label htmlFor="fullName" className="elegant-heading block mb-2">
              {t('fullName')}
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="elegant-heading block mb-2">
              {t('phoneNumber')}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-full sm:w-auto px-3 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold"
              >
                {language === 'en' ? (
                  <>
                    <option value="+1">🇺🇸 USA +1</option>
                    <option value="+1">🇨🇦 Canada +1</option>
                    <option value="+52">🇲🇽 Mexico +52</option>
                    <option value="+91">🇮🇳 India +91</option>
                    <option value="+44">🇬🇧 UK +44</option>
                    <option value="+34">🇪🇸 Spain +34</option>
                    <option value="+33">🇫🇷 France +33</option>
                  </>
                ) : (
                  <>
                    <option value="+52">🇲🇽 México +52</option>
                    <option value="+1">🇺🇸 EE.UU. +1</option>
                    <option value="+1">🇨🇦 Canadá +1</option>
                    <option value="+91">🇮🇳 India +91</option>
                    <option value="+44">🇬🇧 Reino Unido +44</option>
                    <option value="+34">🇪🇸 España +34</option>
                    <option value="+33">🇫🇷 Francia +33</option>
                  </>
                )}
              </select>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                className="w-full px-4 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('phoneNumberHelp')}</p>
          </div>

          {/* Household Count */}
          <div className="mb-6">
            <label htmlFor="householdCount" className="elegant-heading block mb-2">
              {t('householdCount')}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="number"
                  id="householdCount"
                  name="householdCount"
                  min="1"
                  max="10"
                  required
                  value={formData.householdCount}
                  onChange={handleChange}
                  className="w-20 sm:w-24 px-3 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold appearance-none"
                  style={{
                    "-moz-appearance": "textfield",
                    "appearance": "textfield"
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex flex-col border-l border-rose-gold/30">
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.min(parseInt(formData.householdCount) + 1, 10);
                      handleChange({ target: { name: 'householdCount', value: newValue.toString() } });
                    }}
                    className="flex-1 px-2 hover:bg-rose-gold/5 text-rose-gold"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(parseInt(formData.householdCount) - 1, 1);
                      handleChange({ target: { name: 'householdCount', value: newValue.toString() } });
                    }}
                    className="flex-1 px-2 hover:bg-rose-gold/5 text-rose-gold border-t border-rose-gold/30"
                  >
                    ▼
                  </button>
                </div>
              </div>
              <span className="detail-text flex-grow">{t('peopleInHousehold')}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('householdCountHelp')}</p>
          </div>

          {/* Relationship */}
          <div className="mb-6">
            <label htmlFor="relationship" className="elegant-heading block mb-2">
              {t('relationship')}
            </label>
            <select
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold"
            >
              <option value="bride">{t('knowsBride')}</option>
              <option value="groom">{t('knowsGroom')}</option>
              <option value="friend">{t('friend')}</option>
            </select>
          </div>

          {/* Food Allergies */}
          <div className="mb-6">
            <label htmlFor="foodAllergies" className="elegant-heading block mb-2">
              {t('foodAllergies')}
            </label>
            <textarea
              id="foodAllergies"
              name="foodAllergies"
              value={formData.foodAllergies}
              onChange={handleChange}
              placeholder={t('foodAllergiesPlaceholder')}
              className="w-full px-4 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold h-24"
            />
          </div>

          {/* Visiting Venue */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isVisitingVenue"
                  name="isVisitingVenue"
                  checked={formData.isVisitingVenue}
                  onChange={handleChange}
                  className="appearance-none h-6 w-6 border-2 border-rose-gold rounded checked:bg-rose-gold checked:border-rose-gold focus:ring-2 focus:ring-rose-gold/50 focus:outline-none transition-colors duration-200"
                />
                <svg
                  className={`absolute inset-0 w-6 h-6 pointer-events-none text-white ${
                    formData.isVisitingVenue ? 'opacity-100' : 'opacity-0'
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <label htmlFor="isVisitingVenue" className="elegant-heading text-lg cursor-pointer">
                {t('visitingVenue')}
              </label>
            </div>

            {formData.isVisitingVenue && (
              <div className="mt-4 ml-10">
                <label htmlFor="arrivalDate" className="elegant-heading block mb-2">
                  {t('arrivalDate')}
                </label>
                <input
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold"
                />
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label htmlFor="additionalNotes" className="elegant-heading block mb-2">
              {t('additionalNotes')}
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder={t('additionalNotesPlaceholder')}
              className="w-full px-4 py-2 border border-rose-gold/30 rounded-lg focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold h-24"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-rose-gold text-white px-8 py-3 rounded-lg hover:bg-rose-gold-dark transition-colors duration-200 text-lg"
              disabled={!!error}
            >
              {t('submitRSVP')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RSVP; 
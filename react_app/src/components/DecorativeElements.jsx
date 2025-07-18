import React from 'react';

export function RoseCorner({ position = 'top-left' }) {
  const positionClasses = {
    'top-left': 'top-0 left-0 rotate-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180'
  };

  return (
    <div className={`absolute w-64 h-64 ${positionClasses[position]} pointer-events-none opacity-50`}>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-gold-light/30 via-rose-gold/20 to-transparent rounded-full blur-lg"></div>
      <div className="absolute inset-0 bg-[url('/roses-corner.png')] bg-contain bg-no-repeat"></div>
    </div>
  );
}

export function FloralDivider() {
  return (
    <div className="relative py-8">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center">
        <div className="w-8 h-8 text-rose-gold">
          {/* Simple rose icon */}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,4C7.58,4 4,7.58 4,12C4,16.42 7.58,20 12,20C16.42,20 20,16.42 20,12C20,7.58 16.42,4 12,4M12,6C15.31,6 18,8.69 18,12C18,15.31 15.31,18 12,18C8.69,18 6,15.31 6,12C6,8.69 8.69,6 12,6M12,8C9.79,8 8,9.79 8,12C8,14.21 9.79,16 12,16C14.21,16 16,14.21 16,12C16,9.79 14.21,8 12,8Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function DraperyCurtain() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/80 to-transparent"></div>
      <div className="absolute inset-x-0 top-0 h-60">
        <div className="relative h-full">
          <div className="absolute inset-0 bg-[url('/drapery.png')] bg-repeat-x opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-rose-gold-light/10 via-rose-gold/5 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export function FloralCornerDecoration({ className = '' }) {
  return (
    <div className={`absolute w-40 h-40 pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-gold-light/20 via-rose-gold/10 to-transparent rounded-full blur-lg"></div>
      <div className="absolute inset-0 bg-[url('/floral-corner.png')] bg-contain bg-no-repeat transform rotate-45"></div>
    </div>
  );
} 
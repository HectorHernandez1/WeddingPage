/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#b76e79',
        'rose-gold-light': '#d4a5a5',
        'rose-gold-dark': '#8e4e57',
      },
      fontFamily: {
        'great-vibes': ['"Great Vibes"', 'cursive'],
        'playfair': ['"Playfair Display"', 'serif'],
        'cormorant': ['"Cormorant Garamond"', 'serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      minHeight: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      screens: {
        'xs': '375px',
        'touch': {'raw': '(pointer: coarse)'},
      },
      touchAction: {
        'manipulation': 'manipulation',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.safe-area-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.tap-highlight-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.prevent-text-size-adjust': {
          '-webkit-text-size-adjust': 'none',
          'text-size-adjust': 'none',
        },
      });
    },
  ],
} 
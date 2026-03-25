/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OKX Color System
        okx: {
          // Buy/Long - Always Green
          buy: '#25A750',
          'buy-hover': '#1E8A42',
          'buy-light': 'rgba(37, 167, 80, 0.1)',
          
          // Sell/Short - Always Red
          sell: '#CA3F64',
          'sell-hover': '#B03556',
          'sell-light': 'rgba(202, 63, 100, 0.1)',
          
          // Dark Theme
          dark: {
            bg: '#000000',
            'bg-secondary': '#141414',
            'bg-tertiary': '#1a1a1a',
            'bg-hover': '#2a2a2a',
            'bg-input': '#2a2a2a',
            border: '#2a2a2a',
            'border-hover': '#3a3a3a',
          },
          
          // Light Theme
          light: {
            bg: '#FFFFFF',
            'bg-secondary': '#F5F5F5',
            'bg-tertiary': '#F0F0F0',
            'bg-hover': '#E8E8E8',
            'bg-input': '#F5F5F5',
            border: '#E5E5E5',
            'border-hover': '#D4D4D4',
          },
          
          // Text Colors
          'text-primary-dark': '#FFFFFF',
          'text-secondary-dark': '#808080',
          'text-tertiary-dark': '#666666',
          
          'text-primary-light': '#000000',
          'text-secondary-light': '#666666',
          'text-tertiary-light': '#999999',
          
          // Accent
          accent: '#00D4AA',
        }
      },
      fontFamily: {
        sans: ['HarmonyOS Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'okx': '8px',
        'okx-lg': '12px',
        'okx-xl': '16px',
      },
      fontSize: {
        'xs': ['11px', '14px'],
        'sm': ['12px', '16px'],
        'base': ['14px', '20px'],
        'lg': ['16px', '24px'],
        'xl': ['18px', '26px'],
        '2xl': ['20px', '28px'],
        '3xl': ['24px', '32px'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}

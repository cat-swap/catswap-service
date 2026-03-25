/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic colors mapped to CSS variables
        background: {
          DEFAULT: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        foreground: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          muted: 'var(--text-muted)',
        },
        border: {
          DEFAULT: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
          hover: 'var(--border-hover)',
        },
        // Buy/Sell colors - semantic naming
        success: {
          DEFAULT: 'var(--color-buy)',
          hover: 'var(--color-buy-hover)',
          light: 'var(--color-buy-light)',
        },
        danger: {
          DEFAULT: 'var(--color-sell)',
          hover: 'var(--color-sell-hover)',
          light: 'var(--color-sell-light)',
        },
        // OKX reference colors (use success/danger instead)
        // Deprecated: will be removed in future versions
        okx: {
          buy: '#25A750',
          'buy-hover': '#1E8A42',
          'buy-light': 'rgba(37, 167, 80, 0.1)',
          sell: '#CA3F64',
          'sell-hover': '#B03556',
          'sell-light': 'rgba(202, 63, 100, 0.1)',
        },
      },
      fontFamily: {
        sans: [
          'HarmonyOS Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      fontSize: {
        xs: ['0.6875rem', '0.875rem'], // 11px / 14px
        sm: ['0.75rem', '1rem'], // 12px / 16px
        base: ['0.875rem', '1.25rem'], // 14px / 20px
        lg: ['1rem', '1.5rem'], // 16px / 24px
        xl: ['1.125rem', '1.625rem'], // 18px / 26px
        '2xl': ['1.25rem', '1.75rem'], // 20px / 28px
        '3xl': ['1.5rem', '2rem'], // 24px / 32px
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      transitionDuration: {
        200: '200ms',
      },
    },
  },
  plugins: [],
};

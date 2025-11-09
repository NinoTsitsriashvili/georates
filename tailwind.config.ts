import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4169E1',      // Royal Blue
          dark: '#3158c0',         // Darker for hover
          light: '#5B7FFF',        // Lighter variant
        },
        success: {
          DEFAULT: '#22C55E',      // Emerald Green
        },
        danger: {
          DEFAULT: '#EF4444',      // Coral Red
        },
        neutral: {
          light: '#F3F4F6',
          dark: '#6B7280',
        },
        card: {
          bg: 'var(--color-card-bg)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans Georgian', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'display': ['32px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.5px' }],
        'h1': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        'base': '200ms',
        'hover': '300ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
export default config


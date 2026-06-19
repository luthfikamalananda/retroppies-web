/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#E9C140',
          light:   '#F5D76E',
          dark:    '#C9A022',
          muted:   '#B8951F',
          pale:    '#F9EBB2',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          surface: '#111111',
          card:    '#1A1A1A',
          elevated:'#222222',
          border:  '#2A2A2A',
        },
      },
      fontFamily: {
        gaming: ['"RetroGaming"', 'regular'],
        body:   ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        mobile: '448px',
      },
      borderRadius: {
        pill: '9999px',
        card: '1rem',
      },
      boxShadow: {
        gold: '0 4px 20px rgba(233, 193, 64, 0.3), 0 0 40px rgba(233, 193, 64, 0.1)',
        card: '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}

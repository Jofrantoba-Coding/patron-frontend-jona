/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // Compila también las clases de los componentes uijona (heredan la marca)
    '../uijona/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Marca Develtrex — cian (#3BBCD9) como primary, magenta (#BF46C1) como accent
        primary: {
          50: '#edfafc',
          100: '#d2f3f8',
          200: '#ace8f1',
          300: '#74d5e7',
          400: '#3bbcd9', // color de marca (cian del logo)
          500: '#20a1c0',
          600: '#1c82a0',
          700: '#1d6883',
          800: '#1f566c',
          900: '#1e485b',
        },
        accent: {
          50: '#fcf1fc',
          100: '#f8ddf8',
          200: '#f1bdf2',
          300: '#e78fe8',
          400: '#d763d9',
          500: '#bf46c1', // color de marca (magenta del logo)
          600: '#a132a2',
          700: '#7f2780',
          800: '#692069',
          900: '#571d57',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Escalas que usan algunos componentes uijona (para que rendericen ok)
        danger: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
        success: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
        warning: { 400: '#fbbf24', 500: '#eab308', 600: '#ca8a04', 700: '#a16207' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      keyframes: {
        'word-in': {
          from: { opacity: '0', transform: 'translateY(0.4em)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'word-in': 'word-in 0.5s cubic-bezier(0.22,1,0.36,1)',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};

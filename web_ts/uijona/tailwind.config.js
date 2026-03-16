/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'rgb(var(--jona-primary-50) / <alpha-value>)',
          100: 'rgb(var(--jona-primary-100) / <alpha-value>)',
          200: 'rgb(var(--jona-primary-200) / <alpha-value>)',
          300: 'rgb(var(--jona-primary-300) / <alpha-value>)',
          400: 'rgb(var(--jona-primary-400) / <alpha-value>)',
          500: 'rgb(var(--jona-primary-500) / <alpha-value>)',
          600: 'rgb(var(--jona-primary-600) / <alpha-value>)',
          700: 'rgb(var(--jona-primary-700) / <alpha-value>)',
          800: 'rgb(var(--jona-primary-800) / <alpha-value>)',
          900: 'rgb(var(--jona-primary-900) / <alpha-value>)',
        },
        neutral: {
          50:  'rgb(var(--jona-neutral-50) / <alpha-value>)',
          100: 'rgb(var(--jona-neutral-100) / <alpha-value>)',
          200: 'rgb(var(--jona-neutral-200) / <alpha-value>)',
          300: 'rgb(var(--jona-neutral-300) / <alpha-value>)',
          400: 'rgb(var(--jona-neutral-400) / <alpha-value>)',
          500: 'rgb(var(--jona-neutral-500) / <alpha-value>)',
          600: 'rgb(var(--jona-neutral-600) / <alpha-value>)',
          700: 'rgb(var(--jona-neutral-700) / <alpha-value>)',
          800: 'rgb(var(--jona-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--jona-neutral-900) / <alpha-value>)',
        },
        danger: {
          400: 'rgb(var(--jona-danger-400) / <alpha-value>)',
          500: 'rgb(var(--jona-danger-500) / <alpha-value>)',
          600: 'rgb(var(--jona-danger-600) / <alpha-value>)',
        },
        success: {
          400: 'rgb(var(--jona-success-400) / <alpha-value>)',
          500: 'rgb(var(--jona-success-500) / <alpha-value>)',
          600: 'rgb(var(--jona-success-600) / <alpha-value>)',
        },
        warning: {
          400: 'rgb(var(--jona-warning-400) / <alpha-value>)',
          500: 'rgb(var(--jona-warning-500) / <alpha-value>)',
          600: 'rgb(var(--jona-warning-600) / <alpha-value>)',
        },
      },
      borderRadius: {
        sm:      'var(--jona-radius-sm)',
        DEFAULT: 'var(--jona-radius)',
        md:      'var(--jona-radius-md)',
        lg:      'var(--jona-radius-lg)',
        full:    'var(--jona-radius-full)',
      },
    },
  },
  plugins: [],
};

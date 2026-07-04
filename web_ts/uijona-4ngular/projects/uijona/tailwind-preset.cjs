/**
 * JONA UI — Tailwind preset (Angular).
 *
 * Los consumidores que usan Tailwind pueden extender este preset para obtener
 * la misma paleta y radios que la libreria, mapeados a variables CSS (`tokens.css`).
 *
 *   // tailwind.config.js del consumidor
 *   module.exports = {
 *     presets: [require('uijona-4ngular/tailwind-preset')],
 *     content: [
 *       './src/**\/*.{html,ts}',
 *       './node_modules/uijona-4ngular/**\/*.mjs',
 *     ],
 *   };
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: shade('primary'),
        accent: shade('accent'),
        neutral: shade('neutral'),
        danger: shade('danger', ['400', '500', '600']),
        success: shade('success', ['400', '500', '600']),
        warning: shade('warning', ['400', '500', '600']),
      },
      borderRadius: {
        sm: 'var(--jona-radius-sm)',
        DEFAULT: 'var(--jona-radius)',
        md: 'var(--jona-radius-md)',
        lg: 'var(--jona-radius-lg)',
        full: 'var(--jona-radius-full)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
};

function shade(name, steps) {
  const scale = steps ?? ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  return Object.fromEntries(
    scale.map((s) => [s, `rgb(var(--jona-${name}-${s}) / <alpha-value>)`])
  );
}

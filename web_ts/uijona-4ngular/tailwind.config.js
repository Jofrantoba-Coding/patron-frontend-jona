/**
 * Tailwind config del workspace. Se usa para:
 *  - compilar la hoja de estilos distribuible (`styles/uijona.css`) escaneando
 *    los templates de la libreria, y
 *  - dar IntelliSense de clases durante el desarrollo.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  presets: [require('./projects/uijona/tailwind-preset.cjs')],
  content: ['./projects/uijona/src/**/*.{html,ts}'],
  plugins: [],
};

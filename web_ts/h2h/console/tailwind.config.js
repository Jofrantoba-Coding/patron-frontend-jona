/**
 * Tailwind de la app H2H console. Usa el preset de uijona-4ngular (paleta + radios
 * mapeados a los tokens --jona-*) y escanea los templates de la app para generar
 * las utilidades propias. El reset base y el CSS de componentes vienen de
 * `uijona-4ngular/styles/uijona.css` (importado en styles.css).
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  presets: [require('uijona-4ngular/tailwind-preset')],
  content: ['./src/**/*.{html,ts}'],
  plugins: [],
};

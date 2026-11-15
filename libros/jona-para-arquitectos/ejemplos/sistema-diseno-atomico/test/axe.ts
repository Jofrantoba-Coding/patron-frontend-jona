import axe from 'axe-core';

/**
 * Violaciones graves y críticas de axe-core. `color-contrast` va apagada porque jsdom no
 * calcula estilos: el contraste lo prueba contraste.test.ts sobre los tokens.
 */
export async function violacionesGraves(contenedor: Element): Promise<string[]> {
  const resultado = await axe.run(contenedor, {
    resultTypes: ['violations'],
    rules: { 'color-contrast': { enabled: false } },
  });
  return resultado.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => v.id);
}

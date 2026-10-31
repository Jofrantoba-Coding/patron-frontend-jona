/**
 * Accesibilidad en dos niveles: el contrato (tipos) impide un botón solo icono
 * sin nombre, y axe-core audita el DOM renderizado en jsdom.
 */
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { JButton, JCheckbox } from '../src/index';

/**
 * Violaciones graves y críticas. `color-contrast` va apagada porque jsdom no
 * calcula estilos ni diseño: el contraste lo prueba contraste.test.ts sobre los tokens.
 */
async function violacionesGraves(contenedor: Element): Promise<string[]> {
  const resultado = await axe.run(contenedor, {
    resultTypes: ['violations'],
    rules: { 'color-contrast': { enabled: false } },
  });
  return resultado.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => v.id);
}

const Icono = () => <span aria-hidden="true">×</span>;

describe('accesibilidad de los átomos (axe-core)', () => {
  it('JButton con texto no tiene violaciones graves', async () => {
    const { container } = render(<JButton>Guardar</JButton>);

    expect(await violacionesGraves(container)).toEqual([]);
  });

  it('JButton solo icono con aria-label no tiene violaciones graves', async () => {
    const { container } = render(<JButton icon={<Icono />} aria-label="Cerrar" />);

    expect(await violacionesGraves(container)).toEqual([]);
  });

  it('JCheckbox con su etiqueta no tiene violaciones graves', async () => {
    const { container } = render(<JCheckbox label="Recordarme" />);

    expect(await violacionesGraves(container)).toEqual([]);
  });

  it('un botón solo icono sin aria-label no compila, y axe lo detecta si se fuerza', async () => {
    // @ts-expect-error -- InterJButtonSoloIcono exige aria-label cuando no hay texto visible.
    const { container } = render(<JButton icon={<Icono />} />);

    expect(await violacionesGraves(container)).toEqual(['button-name']);
  });
});

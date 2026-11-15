// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { archivosFuente, verificarNiveles, type Regla } from './reglas';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const arbol = (nombre: string) => fileURLToPath(new URL(`../fixtures/${nombre}/src`, import.meta.url));

describe('Niveles: Atomic Design entre unidades, JONA dentro de cada una', () => {
  it('analiza el código de src/ (la prueba no pasa por no encontrar archivos)', () => {
    const archivos = archivosFuente(SRC);

    expect(archivos).toContain('atomos/jbutton/JButtonView.tsx');
    expect(archivos).toContain('moleculas/jfield/JFieldImpl.tsx');
    expect(archivos).toContain('organismos/jtable/InterJTable.ts');
    expect(archivos).toContain('disposiciones/jpagelayout/JPageLayoutView.tsx');
  });

  it('src/ cumple las cuatro reglas', () => {
    expect(verificarNiveles(SRC)).toEqual([]);
  });
});

/** Cada árbol de test/fixtures contiene exactamente una violación: [árbol, regla que la detecta, archivo]. */
const CASOS: Array<[string, Regla, string]> = [
  ['nivel-invertido', 1, 'atomos/jtext/JTextView.tsx'],
  ['nivel-hermano', 1, 'moleculas/jsearchbox/JSearchBoxView.tsx'],
  ['importa-interior', 2, 'moleculas/jfield/JFieldView.tsx'],
  ['organismo-con-red', 3, 'organismos/jtable/JTableImpl.tsx'],
  ['paquete-externo', 3, 'organismos/jconfirmdialog/JConfirmDialogImpl.tsx'],
  ['contrato-heredado', 4, 'moleculas/jfield/InterJField.ts'],
];

describe('Cada regla detecta lo que dice detectar (una regla que nunca falla no prueba nada)', () => {
  it('toda regla tiene al menos un árbol con una violación', () => {
    expect(new Set(CASOS.map(([, regla]) => regla))).toEqual(new Set([1, 2, 3, 4]));
  });

  it.each(CASOS)('%s: la regla %i señala %s', (nombre, regla, archivo) => {
    const violaciones = verificarNiveles(arbol(nombre));

    expect(violaciones).toHaveLength(1);
    expect(violaciones[0]).toMatchObject({ regla, archivo });
    expect(violaciones[0].mensaje).not.toBe('');
  });
});

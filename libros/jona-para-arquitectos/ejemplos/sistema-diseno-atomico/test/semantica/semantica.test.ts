// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { verificarSemantica, vistasDe, type Regla } from './reglas';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const arbol = (nombre: string) => fileURLToPath(new URL(`../fixtures/${nombre}/src`, import.meta.url));

describe('Semántica: lo que el HTML del sistema de diseño dice de la página', () => {
  it('analiza las vistas de src/ (la prueba no pasa por no encontrar archivos)', () => {
    const vistas = vistasDe(SRC);

    expect(vistas).toHaveLength(11);
    expect(vistas).toContain('atomos/jheading/JHeadingView.tsx');
    expect(vistas).toContain('atomos/jlink/JLinkView.tsx');
    expect(vistas).toContain('disposiciones/jpagelayout/JPageLayoutView.tsx');
  });

  it('src/ cumple las reglas 5 y 6', () => {
    expect(verificarSemantica(SRC)).toEqual([]);
  });
});

/** Cada árbol de test/fixtures contiene exactamente una violación: [árbol, regla que la detecta, archivo, parte del mensaje]. */
const CASOS: Array<[string, Regla, string, string]> = [
  ['titulo-a-mano', 5, 'organismos/jconfirmdialog/JConfirmDialogView.tsx', 'dibuja <h2> a mano'],
  ['titulo-con-jtext', 5, 'disposiciones/jpagelayout/JPageLayoutView.tsx', '<JText as="h1">'],
  ['enlace-sin-href', 6, 'atomos/jlink/JLinkView.tsx', '<a> sin href'],
  ['enlace-a-ninguna-parte', 6, 'atomos/jlink/JLinkView.tsx', '<a href="#"> no lleva a ningún lado'],
  ['fila-con-onclick', 6, 'organismos/jtable/JTableView.tsx', '<tr> con onClick'],
];

describe('Cada regla detecta lo que dice detectar (una regla que nunca falla no prueba nada)', () => {
  it('toda regla tiene al menos un árbol con una violación', () => {
    expect(new Set(CASOS.map(([, regla]) => regla))).toEqual(new Set([5, 6]));
  });

  it.each(CASOS)('%s: la regla %i señala %s', (nombre, regla, archivo, mensaje) => {
    const violaciones = verificarSemantica(arbol(nombre));

    expect(violaciones).toHaveLength(1);
    expect(violaciones[0]).toMatchObject({ regla, archivo });
    expect(violaciones[0].mensaje).toContain(mensaje);
  });
});

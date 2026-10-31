// @vitest-environment node
/**
 * Lint de tokens: las Vistas pintan solo con las constantes de clasesToken.
 * Ni colores literales, ni tokens (primitivos o semánticos) escritos a mano,
 * ni nombres de clase en cadenas sueltas.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as clasesToken from '../src/tema/clasesToken';

const PRIMITIVO = /--ds-(primary|neutral)-\d+/;

const REGLAS: [RegExp, string][] = [
  [/#[0-9a-fA-F]{3,8}\b/, 'color hexadecimal'],
  [/\b(rgba?|hsla?)\(/, 'función de color'],
  [PRIMITIVO, 'token primitivo'],
  [/var\(--/, 'token escrito a mano'],
  [/className\s*=\s*(["'`]|\{\s*["'`])/, 'clase en cadena literal'],
  [/["'`][^"'`]*\bds-[\w-]+/, 'clase de token escrita a mano'],
];

/** Problemas de una Vista, uno por regla incumplida. */
function problemasDeVista(texto: string): string[] {
  const problemas = REGLAS.filter(([patron]) => patron.test(texto)).map(([, nombre]) => nombre);
  if (!/from\s+['"][./]+tema\/clasesToken['"]/.test(texto)) problemas.push('no importa clasesToken');
  return problemas;
}

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const vistas = (readdirSync(SRC, { recursive: true }) as string[])
  .map((ruta) => ruta.replaceAll('\\', '/'))
  .filter((ruta) => ruta.endsWith('View.tsx'));

describe('lint de tokens en las Vistas', () => {
  it('encuentra las Vistas de src/atomos', () => {
    expect(vistas).toEqual(['atomos/jbutton/JButtonView.tsx', 'atomos/jcheckbox/JCheckboxView.tsx']);
  });

  it.each(vistas)('%s pinta solo con clasesToken', (ruta) => {
    expect(problemasDeVista(readFileSync(SRC + ruta, 'utf8'))).toEqual([]);
  });

  it('no es una prueba vacía: una Vista con colores y tokens a mano se reporta', () => {
    const fixture = readFileSync(new URL('./fixtures/VistaConColores.tsx', import.meta.url), 'utf8');

    expect(problemasDeVista(fixture)).toEqual([
      'color hexadecimal',
      'función de color',
      'token primitivo',
      'token escrito a mano',
      'clase en cadena literal',
      'clase de token escrita a mano',
      'no importa clasesToken',
    ]);
  });
});

describe('clasesToken y tokens.css', () => {
  const css = readFileSync(new URL('../src/tema/tokens.css', import.meta.url), 'utf8');

  it.each(Object.entries(clasesToken))('%s tiene su regla y solo lee tokens semánticos', (_nombre, clase) => {
    const regla = new RegExp(`\\.${clase}(:[\\w-]+)?\\s*\\{([^}]*)\\}`).exec(css);

    expect(regla, `falta la regla .${clase}`).not.toBeNull();
    expect(regla![2]).toMatch(/var\(--ds-/);
    expect(regla![2]).not.toMatch(PRIMITIVO);
  });
});

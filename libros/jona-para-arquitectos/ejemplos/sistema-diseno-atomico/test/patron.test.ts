// @vitest-environment node
/**
 * Anatomía JONA de cada unidad, en todos los niveles: contrato Inter, Implementación,
 * Vista, Entrada e índice; y DEFAULTS sin claves de estado. El tamaño cambia; la anatomía no.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/** Claves de estado: si viven en DEFAULTS, toda instancia nace controlada con un valor fijo. */
const CLAVE_DE_ESTADO = /^(value|open|rows|busy|selected.*|checked.*)$/;

/** Claves de cada `export const *_DEFAULTS = { ... }` de un archivo, leídas con el compilador. */
function clavesDeDefaults(texto: string): Record<string, string[]> {
  const fuente = ts.createSourceFile('Inter.ts', texto, ts.ScriptTarget.Latest, true);
  const desenvolver = (nodo: ts.Expression): ts.Expression =>
    ts.isAsExpression(nodo) || ts.isSatisfiesExpression(nodo) || ts.isParenthesizedExpression(nodo)
      ? desenvolver(nodo.expression)
      : nodo;
  const encontradas: Record<string, string[]> = {};
  for (const sentencia of fuente.statements) {
    if (!ts.isVariableStatement(sentencia)) continue;
    for (const declaracion of sentencia.declarationList.declarations) {
      const nombre = declaracion.name.getText(fuente);
      if (!nombre.endsWith('_DEFAULTS') || !declaracion.initializer) continue;
      const objeto = desenvolver(declaracion.initializer);
      if (!ts.isObjectLiteralExpression(objeto)) continue;
      encontradas[nombre] = objeto.properties.map((p) => p.name?.getText(fuente).replace(/['"]/g, '') ?? '');
    }
  }
  return encontradas;
}

/** Unidades de un árbol: `nivel/unidad` para cada carpeta de cada nivel. */
const unidades = (raiz: string) =>
  ['atomos', 'moleculas', 'organismos', 'disposiciones']
    .filter((nivel) => existsSync(join(raiz, nivel)))
    .flatMap((nivel) => readdirSync(join(raiz, nivel)).map((carpeta) => `${nivel}/${carpeta}`));

/** Archivos JONA que le faltan a cada unidad. */
function archivosFaltantes(raiz: string): string[] {
  return unidades(raiz).flatMap((unidad) => {
    const dir = join(raiz, unidad);
    const contrato = readdirSync(dir).find((f) => /^Inter\w+\.ts$/.test(f));
    if (!contrato) return [`${unidad}/Inter*.ts`];
    const nombre = contrato.slice('Inter'.length, -'.ts'.length);
    return [`${nombre}Impl.tsx`, `${nombre}View.tsx`, `${nombre}.tsx`, 'index.ts']
      .filter((archivo) => !existsSync(join(dir, archivo)))
      .map((archivo) => `${unidad}/${archivo}`);
  });
}

/** `NOMBRE_DEFAULTS.clave` de cada clave de estado en los contratos de un árbol. */
function clavesDeEstadoEnDefaults(raiz: string): string[] {
  return unidades(raiz).flatMap((unidad) =>
    readdirSync(join(raiz, unidad))
      .filter((f) => /^Inter\w+\.ts$/.test(f))
      .flatMap((f) => Object.entries(clavesDeDefaults(readFileSync(join(raiz, unidad, f), 'utf8'))))
      .flatMap(([nombre, claves]) => claves.filter((c) => CLAVE_DE_ESTADO.test(c)).map((c) => `${nombre}.${c}`)),
  );
}

const SRC = resolve(process.cwd(), 'src');
const INCOMPLETO = resolve(process.cwd(), 'test/fixtures/anatomia-incompleta');

describe('anatomía JONA en todos los niveles', () => {
  it('encuentra las unidades de los cuatro niveles', () => {
    expect(unidades(SRC)).toEqual([
      'atomos/jbutton', 'atomos/jinput', 'atomos/jtext',
      'moleculas/jfield', 'moleculas/jsearchbox',
      'organismos/jconfirmdialog', 'organismos/jtable',
      'disposiciones/jpagelayout',
    ]);
  });

  it('cada unidad tiene Inter, Impl, View, Entrada e índice', () => {
    expect(archivosFaltantes(SRC)).toEqual([]);
  });

  it('ningún *_DEFAULTS guarda estado (value, open, rows, busy, selected*, checked*)', () => {
    expect(clavesDeEstadoEnDefaults(SRC)).toEqual([]);
  });

  it('no es una prueba vacía: una unidad incompleta y con estado en DEFAULTS se reporta', () => {
    expect(archivosFaltantes(INCOMPLETO)).toEqual(['moleculas/jselect/JSelectView.tsx', 'moleculas/jselect/index.ts']);
    expect(clavesDeEstadoEnDefaults(INCOMPLETO)).toEqual(['JSELECT_DEFAULTS.value', 'JSELECT_DEFAULTS.open']);
  });
});

// @vitest-environment node
/**
 * Patrón JONA de cada unidad del sistema de diseño: contrato Inter, Implementación,
 * Vista, Entrada e índice; y DEFAULTS sin claves de estado.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/** Claves de estado: si viven en DEFAULTS, toda instancia nace controlada con un valor fijo. */
const CLAVE_DE_ESTADO = /^(value|open|selected.*|checked.*)$/;

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
    if (!sentencia.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
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

const archivosTs = (dir: string) =>
  (readdirSync(dir, { recursive: true }) as string[]).filter((r) => /\.tsx?$/.test(r)).map((r) => join(dir, r));

/** `NOMBRE_DEFAULTS.clave` de cada clave de estado bajo un directorio. */
function clavesDeEstadoEnDefaults(dir: string): string[] {
  return archivosTs(dir).flatMap((archivo) =>
    Object.entries(clavesDeDefaults(readFileSync(archivo, 'utf8'))).flatMap(([nombre, claves]) =>
      claves.filter((clave) => CLAVE_DE_ESTADO.test(clave)).map((clave) => `${nombre}.${clave}`),
    ),
  );
}

/** Archivos JONA que le faltan a cada unidad de un directorio de átomos. */
function archivosFaltantes(dirAtomos: string): string[] {
  return readdirSync(dirAtomos).flatMap((carpeta) => {
    const dir = join(dirAtomos, carpeta);
    const contrato = readdirSync(dir).find((f) => /^Inter\w+\.ts$/.test(f));
    if (!contrato) return [`${carpeta}/Inter*.ts`];
    const unidad = contrato.slice('Inter'.length, -'.ts'.length);
    return [`${unidad}Impl.tsx`, `${unidad}View.tsx`, `${unidad}.tsx`, 'index.ts']
      .filter((archivo) => !existsSync(join(dir, archivo)))
      .map((archivo) => `${carpeta}/${archivo}`);
  });
}

const SRC = resolve(process.cwd(), 'src');
const FIXTURE = resolve(process.cwd(), 'test/fixtures/atomos-incompletos');

describe('patrón JONA de las unidades', () => {
  it('lee las claves de los DEFAULTS con el compilador de TypeScript', () => {
    expect(clavesDeDefaults("export const X_DEFAULTS = { a: 1, 'b': 2 } as const satisfies object;")).toEqual({
      X_DEFAULTS: ['a', 'b'],
    });
  });

  it('cada unidad de src/atomos tiene Inter, Impl, View, Entrada e índice', () => {
    expect(readdirSync(join(SRC, 'atomos'))).toEqual(['jbutton', 'jcheckbox']);
    expect(archivosFaltantes(join(SRC, 'atomos'))).toEqual([]);
  });

  it('ningún *_DEFAULTS de src guarda estado (value, open, selected*, checked*)', () => {
    expect(clavesDeEstadoEnDefaults(SRC)).toEqual([]);
  });

  it('no es una prueba vacía: una unidad incompleta y con estado en DEFAULTS se reporta', () => {
    expect(archivosFaltantes(FIXTURE)).toEqual(['jinterruptor/JInterruptorView.tsx', 'jinterruptor/index.ts']);
    expect(clavesDeEstadoEnDefaults(FIXTURE)).toEqual([
      'JINTERRUPTOR_DEFAULTS.checked',
      'JINTERRUPTOR_DEFAULTS.selectedLabel',
    ]);
  });
});

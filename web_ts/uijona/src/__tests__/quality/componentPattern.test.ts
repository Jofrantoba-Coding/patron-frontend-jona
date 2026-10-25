/**
 * JONA component pattern of the 1.6.0 pieces (R-FND-9, S-FND-22).
 *
 * Every new folder holds the Inter contract, the Impl, the pure View, the
 * public entry, the barrel, a story and a test; its DEFAULTS hold no state
 * value; and it is exported from the root entry and the package export map.
 * Each lib slice appends the folders it adds.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

interface Piece {
  layer: 'atoms' | 'molecules' | 'layouts' | 'organisms' | 'hooks';
  name: string;
  /** File prefix of the JONA layers when it differs from the name (hooks: `UseConfirm`). */
  unit?: string;
  /** DEFAULTS export when it differs from `<NAME>_DEFAULTS`. */
  defaults?: string;
}

const PIECES_160: Piece[] = [
  { layer: 'molecules', name: 'JField' },
  { layer: 'layouts', name: 'JFieldGrid' },
  { layer: 'molecules', name: 'JFormSection' },
  { layer: 'molecules', name: 'JErrorSummary' },
  { layer: 'hooks', name: 'useConfirm', unit: 'UseConfirm', defaults: 'CONFIRM_DEFAULTS' },
  { layer: 'molecules', name: 'JToolbar' },
  { layer: 'molecules', name: 'JPageHeader' },
  { layer: 'molecules', name: 'JInputGroup' },
  { layer: 'molecules', name: 'JDataGrid' },
  { layer: 'molecules', name: 'JTreeNav' },
  { layer: 'layouts', name: 'JAppShell' },
];

const SRC = resolve(process.cwd(), 'src');
const STATE_KEY = /^(value|open|selected.*|checked.*)$/;

const expectedFiles = ({ layer, name, unit = name }: Piece): string[] => [
  `${layer}/${name}/Inter${unit}.ts`,
  `${layer}/${name}/${unit}Impl.tsx`,
  `${layer}/${name}/${unit}View.tsx`,
  `${layer}/${name}/${name}.${layer === 'hooks' ? 'ts' : 'tsx'}`,
  `${layer}/${name}/index.ts`,
  `${layer}/${name}/${name}.stories.tsx`,
  `${layer}/__tests__/${name}.test.tsx`,
];

/** The keys of every `*_DEFAULTS` object literal exported by a source text. */
function defaultsKeys(text: string): Record<string, string[]> {
  const source = ts.createSourceFile('Inter.ts', text, ts.ScriptTarget.Latest, true);
  const found: Record<string, string[]> = {};
  const unwrap = (node: ts.Expression): ts.Expression =>
    ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)
      ? unwrap(node.expression)
      : node;
  source.statements.forEach((statement) => {
    if (!ts.isVariableStatement(statement)) return;
    statement.declarationList.declarations.forEach((declaration) => {
      if (!ts.isIdentifier(declaration.name) || !/_DEFAULTS$/.test(declaration.name.text)) return;
      const initializer = declaration.initializer && unwrap(declaration.initializer);
      if (!initializer || !ts.isObjectLiteralExpression(initializer)) return;
      found[declaration.name.text] = initializer.properties
        .map((property) => property.name?.getText(source).replace(/['"]/g, ''))
        .filter((key): key is string => Boolean(key));
    });
  });
  return found;
}

const stateKeys = (defaults: Record<string, string[]>): string[] =>
  Object.entries(defaults).flatMap(([name, keys]) =>
    keys.filter((key) => STATE_KEY.test(key)).map((key) => `${name}.${key}`),
  );

describe('component pattern (S-FND-22)', () => {
  const indexSource = readFileSync(resolve(SRC, 'index.ts'), 'utf8');
  const packageExports = (JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
    exports: Record<string, unknown>;
  }).exports;

  it.each(PIECES_160)('$layer/$name has the JONA files, a story and a test', (piece) => {
    const missing = expectedFiles(piece).filter((file) => !existsSync(resolve(SRC, file)));

    expect(missing).toEqual([]);
  });

  it.each(PIECES_160)('$layer/$name has DEFAULTS without state values', (piece) => {
    const path = resolve(SRC, `${piece.layer}/${piece.name}/Inter${piece.unit ?? piece.name}.ts`);
    const defaults = existsSync(path) ? defaultsKeys(readFileSync(path, 'utf8')) : {};

    expect(Object.keys(defaults)).toContain(piece.defaults ?? `${piece.name.toUpperCase()}_DEFAULTS`);
    expect(stateKeys(defaults)).toEqual([]);
  });

  it.each(PIECES_160)('$layer/$name is exported from the root entry and the export map', ({ layer, name }) => {
    expect(indexSource).toContain(`export * from './${layer}/${name}';`);
    expect(packageExports).toHaveProperty([`./${layer}/${name}`]);
  });

  it('flags state keys in a DEFAULTS literal', () => {
    const fixture = [
      "export const JX_DEFAULTS = { open: false, size: 'md', selectedId: null } as const;",
      "export const JY_DEFAULTS: Required<Pick<A, 'checked'>> = { 'checked': false };",
      'export const OTHER = { value: 1 };',
    ].join('\n');

    expect(stateKeys(defaultsKeys(fixture))).toEqual(['JX_DEFAULTS.open', 'JX_DEFAULTS.selectedId', 'JY_DEFAULTS.checked']);
  });
});

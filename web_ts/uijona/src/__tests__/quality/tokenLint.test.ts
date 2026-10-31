/**
 * Token lint (R-FND-3, D5; S-FND-8): lib source paints colors through the
 * semantic tokens. No raw white/black/neutral/gray/slate/zinc color utility and
 * no hex/rgb/hsl literal in the source strings, and no hard-coded color in
 * index.css. Exceptions live only in darkModeAllowlist.ts, which only shrinks.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import postcss from 'postcss';
import ts from 'typescript';
import { DARK_MODE_ALLOWLIST } from './darkModeAllowlist';

const SRC = resolve(process.cwd(), 'src');

const RAW_UTILITY =
  /(?<![\w\-[])(?:[\w-]+:)*(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|divide|fill|stroke|placeholder|from|via|to)-(?:white|black|neutral|gray|slate|zinc)(?:-\d{2,3})?(?:\/\d+)?(?![\w-])/g;
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const FUNCTION_COLOR = /\b(?:rgba?|hsla?)\((?!\s*var\(--jona-)[^)]*\)/g;
const CSS_KEYWORD = /(?<![\w-])(?:white|black)(?![\w-])/g;

const matches = (text: string, ...patterns: RegExp[]): string[] =>
  patterns.flatMap((pattern) => Array.from(text.matchAll(pattern), (match) => match[0].replace(/\s+/g, ' ')));

/** Color violations in the string literals and template parts of a TS/TSX source. */
export function sourceViolations(path: string, text: string): string[] {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      found.push(...matches(node.text, RAW_UTILITY, HEX, FUNCTION_COLOR));
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return Array.from(new Set(found)).sort();
}

/** Hard-coded colors in the declaration values of a stylesheet. */
export function cssViolations(text: string): string[] {
  const found: string[] = [];
  postcss.parse(text).walkDecls((decl) => {
    found.push(...matches(decl.value, HEX, FUNCTION_COLOR, CSS_KEYWORD).map((value) => `${decl.prop}: ${value}`));
  });
  return Array.from(new Set(found)).sort();
}

/** Lib source: everything under src/ except tests, test helpers, stories and the token constants. */
function libSources(dir: string = SRC): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' || name === 'test' ? [] : libSources(path);
    if (!/\.tsx?$/.test(name) || /\.(test|stories)\.tsx?$/.test(name)) return [];
    return relative(SRC, path).replace(/\\/g, '/') === 'theme/tokenClasses.ts' ? [] : [path];
  });
}

function currentViolations(): Record<string, string[]> {
  return Object.fromEntries(
    libSources()
      .map((path) => [relative(SRC, path).replace(/\\/g, '/'), sourceViolations(path, readFileSync(path, 'utf8'))] as const)
      .filter(([, found]) => found.length > 0),
  );
}

describe('token lint (S-FND-8)', () => {
  const current = currentViolations();

  it('no lib source outside the allowlist uses a raw neutral color utility or a color literal', () => {
    const outside = Object.entries(current).flatMap(([file, found]) =>
      found.filter((token) => !(DARK_MODE_ALLOWLIST[file] ?? []).includes(token)).map((token) => `${file}: ${token}`),
    );

    expect(outside).toEqual([]);
  });

  it('the allowlist only shrinks: every entry still exists and still violates', () => {
    const stale = Object.entries(DARK_MODE_ALLOWLIST).flatMap(([file, tokens]) =>
      tokens.filter((token) => !(current[file] ?? []).includes(token)).map((token) => `${file}: ${token}`),
    );

    expect(stale).toEqual([]);
  });

  it('index.css has no hard-coded color', () => {
    expect(cssViolations(readFileSync(resolve(SRC, 'styles/index.css'), 'utf8'))).toEqual([]);
  });

  it('flags raw utilities and literals, and accepts token classes and brand palettes', () => {
    const fixture = [
      "const a = 'bg-white hover:text-neutral-500 border-t-slate-200/50 ring-offset-white';",
      "const b = `p-2 ${x} text-gray-700`;",
      "const c = { color: '#fff', background: 'rgb(0 0 0 / 0.5)', fill: '#1A2B3C' };",
      "const ok = 'bg-[rgb(var(--jona-surface))] text-primary-600 bg-danger-500 neutral-text white-space';",
      "const href = '#section';",
    ].join('\n');

    expect(sourceViolations('Fixture.tsx', fixture)).toEqual(
      ['#1A2B3C', '#fff', 'bg-white', 'border-t-slate-200/50', 'hover:text-neutral-500', 'rgb(0 0 0 / 0.5)', 'ring-offset-white', 'text-gray-700'].sort(),
    );
    expect(cssViolations('a { color: #6b7280; box-shadow: 0 0 0 2px white; white-space: nowrap; b: rgb(var(--jona-fg)); c: rgb(var(--jona-white) / 0.4); }')).toEqual([
      'box-shadow: white',
      'color: #6b7280',
    ]);
  });
});

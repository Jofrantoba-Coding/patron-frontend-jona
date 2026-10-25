/**
 * Semantic light/dark tokens, type scale and density tokens of the shipped
 * stylesheet (R-FND-3, R-FND-4, R-FND-5, R-FND-6; D5-D8).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.js';
import { resolveRootTokens, tokenRules, type TokenRule } from '../../__tests__/css/tokenCascade';

const SEMANTIC = [
  'surface',
  'surface-muted',
  'surface-raised',
  'fg',
  'fg-muted',
  'line',
  'line-strong',
  'focus',
  'selection',
  'on-primary',
].map((name) => `--jona-${name}`);
const TINTS = ['danger', 'success', 'warning'].flatMap((tone) => [50, 100, 700].map((step) => `--jona-${tone}-${step}`));
const MODE_TOKENS = [...SEMANTIC, ...TINTS];

const DARK = ":root[data-theme-mode='dark']";
const DARK_SCOPE = ":root[data-theme-mode='dark'] [data-jona-scope]";
const SYSTEM = ":root[data-theme-mode='system']";
const SYSTEM_SCOPE = ":root[data-theme-mode='system'] [data-jona-scope]";

async function compileStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), {
    from,
  });
  return result.root;
}

const declaring = (rules: TokenRule[], prop: string): TokenRule[] => rules.filter((rule) => rule.decls.has(prop));
const pick = (tokens: Map<string, string>, props: string[]): Record<string, string | undefined> =>
  Object.fromEntries(props.map((prop) => [prop, tokens.get(prop)]));

describe('semantic tokens (S-FND-6, S-FND-25)', () => {
  let css: Root;
  let rules: TokenRule[];

  beforeAll(async () => {
    css = await compileStylesheet();
    rules = tokenRules(css);
  }, 60_000);

  it('S-FND-6: every semantic token has a light value that references the palette on :root and scopes', () => {
    const light = rules.find((rule) => rule.media === null && rule.selectors.join(', ') === ':root, [data-jona-scope]');

    expect(light).toBeDefined();
    SEMANTIC.forEach((prop) => {
      expect([prop, light!.decls.get(prop)]).toEqual([prop, expect.stringMatching(/^var\(--jona-[a-z]+(?:-\d+)?\)$/)]);
    });
  });

  it('S-FND-6: every status tint is a palette step on :root', () => {
    const palette = resolveRootTokens(css);

    TINTS.forEach((prop) => {
      expect([prop, palette.get(prop)]).toEqual([prop, expect.stringMatching(/^\d+\s+\d+\s+\d+$/)]);
    });
  });

  it('S-FND-6: every semantic token and tint has a dark value, only under the data-theme-mode selectors', () => {
    const explicit = rules.find((rule) => rule.media === null && rule.selectors.includes(DARK));
    const system = rules.find((rule) => rule.media === '(prefers-color-scheme: dark)' && rule.selectors.includes(SYSTEM));

    expect(explicit?.selectors).toEqual([DARK, DARK_SCOPE]);
    expect(system?.selectors).toEqual([SYSTEM, SYSTEM_SCOPE]);
    expect(explicit!.decls.get('color-scheme')).toBe('dark');
    expect(Object.fromEntries(system!.decls)).toEqual(Object.fromEntries(explicit!.decls));
    MODE_TOKENS.forEach((prop) => expect([prop, explicit!.decls.has(prop)]).toEqual([prop, true]));

    MODE_TOKENS.forEach((prop) => {
      const outsideMode = declaring(rules, prop)
        .flatMap((rule) => rule.selectors.map((selector) => `${rule.media ?? ''} ${selector}`.trim()))
        .filter((selector) => !/\[data-theme-mode='(?:dark|system)'\]/.test(selector));
      const lightHome = TINTS.includes(prop) ? [':root'] : [':root', '[data-jona-scope]'];
      expect([prop, outsideMode]).toEqual([prop, lightHome]);
    });
  });

  it('S-FND-6: the dark values apply for dark, and for system when the OS prefers dark', () => {
    const light = pick(resolveRootTokens(css), MODE_TOKENS);
    const dark = pick(resolveRootTokens(css, { attrs: { 'data-theme-mode': 'dark' } }), MODE_TOKENS);

    expect(dark).not.toEqual(light);
    expect(pick(resolveRootTokens(css, { attrs: { 'data-theme-mode': 'system' }, osDark: true }), MODE_TOKENS)).toEqual(dark);
    expect(pick(resolveRootTokens(css, { attrs: { 'data-theme-mode': 'system' }, osDark: false }), MODE_TOKENS)).toEqual(light);
    expect(pick(resolveRootTokens(css, { attrs: { 'data-theme-mode': 'light' }, osDark: true }), MODE_TOKENS)).toEqual(light);
  });

  it('S-FND-25: without data-theme-mode the component tokens stay light and only the chart tokens follow the OS', () => {
    const osLight = resolveRootTokens(css, { osDark: false });
    const osDark = resolveRootTokens(css, { osDark: true });
    const switched = [...osDark.keys()].filter((prop) => osDark.get(prop) !== osLight.get(prop));

    expect(pick(osDark, MODE_TOKENS)).toEqual(pick(osLight, MODE_TOKENS));
    expect(switched.length).toBeGreaterThan(0);
    expect(switched.filter((prop) => !prop.startsWith('--jona-chart-'))).toEqual([]);
  });

  it('S-FND-25: the chart tokens keep their 1.5.1 selectors', () => {
    const chartSelectors = declaring(rules, '--jona-chart-1')
      .flatMap((rule) => rule.selectors.map((selector) => `${rule.media ?? ''} ${selector}`.trim()))
      .sort();

    expect(chartSelectors).toEqual([
      '(prefers-color-scheme: dark) :root:not([data-theme=\'light\'])',
      ':root',
      ":root[data-theme='dark']",
    ]);
  });
});

describe('type scale tokens (S-FND-13)', () => {
  let tokens: Map<string, string>;

  beforeAll(async () => {
    tokens = resolveRootTokens(await compileStylesheet());
  }, 60_000);

  it.each([
    ['page', '1.25rem', '1.75rem', '600'],
    ['section', '1rem', '1.5rem', '600'],
    ['body', '0.875rem', '1.25rem', '400'],
    ['small', '0.8125rem', '1.125rem', '400'],
    ['caption', '0.75rem', '1rem', '400'],
    ['table', '0.8125rem', '1.125rem', '400'],
  ])('defines the %s style as size %s, line height %s and weight %s', (style, size, leading, weight) => {
    expect([
      tokens.get(`--jona-text-${style}-size`),
      tokens.get(`--jona-text-${style}-leading`),
      tokens.get(`--jona-text-${style}-weight`),
    ]).toEqual([size, leading, weight]);
  });

  it('sets tabular numerals for the table style', () => {
    expect(tokens.get('--jona-text-table-numeric')).toBe('tabular-nums');
  });
});

describe('density tokens (S-FND-16)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileStylesheet();
  }, 60_000);

  it('the control height is 44px below sm and 36px from sm', () => {
    expect(resolveRootTokens(css, { width: 375 }).get('--jona-control-h')).toBe('2.75rem');
    expect(resolveRootTokens(css, { width: 639 }).get('--jona-control-h')).toBe('2.75rem');
    expect(resolveRootTokens(css, { width: 640 }).get('--jona-control-h')).toBe('2.25rem');
    expect(resolveRootTokens(css, { width: 1920 }).get('--jona-control-h')).toBe('2.25rem');
  });

  it('defines the row, toolbar, topbar and tabs heights as 36, 40, 48 and 40px', () => {
    const tokens = resolveRootTokens(css);

    expect(pick(tokens, ['--jona-row-h', '--jona-toolbar-h', '--jona-topbar-h', '--jona-tabs-h'])).toEqual({
      '--jona-row-h': '2.25rem',
      '--jona-toolbar-h': '2.5rem',
      '--jona-topbar-h': '3rem',
      '--jona-tabs-h': '2.5rem',
    });
  });

  it('[data-jona-density] overrides the control height at every width, and nothing else', () => {
    const compact = { 'data-jona-density': 'compact' };
    const touch = { 'data-jona-density': 'touch' };

    expect(resolveRootTokens(css, { attrs: compact, width: 375 }).get('--jona-control-h')).toBe('2.25rem');
    expect(resolveRootTokens(css, { attrs: touch, width: 1920 }).get('--jona-control-h')).toBe('2.75rem');
    const densityRules = tokenRules(css).filter((rule) => rule.selectors.some((selector) => selector.includes('data-jona-density')));
    expect(densityRules).toHaveLength(2);
    densityRules.forEach((rule) => expect([...rule.decls.keys()]).toEqual(['--jona-control-h']));
  });
});

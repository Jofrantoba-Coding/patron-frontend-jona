/**
 * WCAG contrast of the semantic token pairs in each mode (R-FND-3; S-FND-7).
 * Values are resolved from the compiled stylesheet, following `var()`
 * references down to the palette triplets.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.js';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { contrastRatio, resolveRootTokens, rgbOf } from '../css/tokenCascade';
import { utilityStyle } from '../css/utilityStyle';
import { BACKDROP } from '../../theme/tokenClasses';
import { JStepper } from '../../molecules/JStepper';

async function compileStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), {
    from,
  });
  return result.root;
}

const PAIRS: [string, string, number][] = [
  ['--jona-fg', '--jona-surface', 4.5],
  ['--jona-fg', '--jona-surface-muted', 4.5],
  ['--jona-fg-muted', '--jona-surface', 4.5],
  ['--jona-fg-muted', '--jona-surface-muted', 4.5],
  ['--jona-focus', '--jona-surface', 3],
  ['--jona-line-strong', '--jona-surface', 3],
];

describe('token contrast (S-FND-7)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileStylesheet();
  }, 60_000);

  it.each([
    ['light', {}],
    ['dark', { 'data-theme-mode': 'dark' }],
  ])('%s mode: text pairs reach 4.5:1 and focus/line-strong reach 3:1', (_mode, attrs) => {
    const tokens = resolveRootTokens(css, { attrs });
    const failing = PAIRS.map(([fg, bg, minimum]) => ({
      pair: `${fg} on ${bg}`,
      ratio: Math.round(contrastRatio(rgbOf(tokens, fg), rgbOf(tokens, bg)) * 100) / 100,
      minimum,
    })).filter(({ ratio, minimum }) => ratio < minimum);

    expect(failing).toEqual([]);
  });

  it('computes the WCAG ratio of known colors', () => {
    expect(contrastRatio([255, 255, 255], [0, 0, 0])).toBeCloseTo(21, 5);
    expect(contrastRatio([100, 116, 139], [255, 255, 255])).toBeCloseTo(4.76, 2);
  });
});

/** The color a translucent layer gives over an opaque one. */
const over = (top: [number, number, number], alpha: number, bottom: [number, number, number]): [number, number, number] =>
  [0, 1, 2].map((i) => top[i] * alpha + bottom[i] * (1 - alpha)) as [number, number, number];

describe('modal backdrop (a5 deferred: visible over a dark page)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileStylesheet();
  }, 60_000);

  it('paints through the backdrop tokens', () => {
    expect(BACKDROP).toBe('bg-[rgb(var(--jona-backdrop)/var(--jona-backdrop-alpha))]');
  });

  it('keeps the 1.5.x light backdrop: neutral-900 at 50%', () => {
    const tokens = resolveRootTokens(css);

    expect(rgbOf(tokens, '--jona-backdrop')).toEqual(rgbOf(tokens, '--jona-neutral-900'));
    expect(tokens.get('--jona-backdrop-alpha')).toBe('0.5');
  });

  it.each([
    ['light', {}],
    ['dark', { 'data-theme-mode': 'dark' }],
    ['system dark', { 'data-theme-mode': 'system' }],
  ])('%s mode: a dialog surface beneath the backdrop dims by at least 1.3:1', (mode, attrs) => {
    const tokens = resolveRootTokens(css, { attrs, osDark: mode === 'system dark' });
    const raised = rgbOf(tokens, '--jona-surface-raised');
    const dimmed = over(rgbOf(tokens, '--jona-backdrop'), Number(tokens.get('--jona-backdrop-alpha')), raised);

    expect(contrastRatio(raised, dimmed)).toBeGreaterThanOrEqual(1.3);
  });
});

/** The `--jona-*` token a compiled `rgb(var(--jona-x) ...)` color value paints with. */
const tokenOf = (value: string | undefined): string => {
  const match = /var\((--jona-[\w-]+)\)/.exec(value ?? '');
  if (!match) throw new Error(`not a token color: ${value}`);
  return match[1];
};

describe('JStepper current step number (a10 finding: unreadable in dark)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileStylesheet();
  }, 60_000);

  it.each([
    ['light', {}],
    ['dark', { 'data-theme-mode': 'dark' }],
    ['system dark', { 'data-theme-mode': 'system' }],
  ])('%s mode: the number reaches 4.5:1 on its indicator surface', (mode, attrs) => {
    const steps = [
      { id: 'company', label: 'Company' },
      { id: 'branch', label: 'Branch' },
      { id: 'warehouse', label: 'Warehouse' },
    ];
    const { container } = render(createElement(JStepper, { steps, currentStep: 1 }));
    const indicator = container.querySelector('li[aria-current="step"] span') as Element;
    expect(indicator.textContent).toBe('2');

    const tokens = resolveRootTokens(css, { attrs, osDark: mode === 'system dark' });
    const number = rgbOf(tokens, tokenOf(utilityStyle(css, indicator, 1024, 'color')));
    const surface = rgbOf(tokens, tokenOf(utilityStyle(css, indicator, 1024, 'background-color')));

    expect(Math.round(contrastRatio(number, surface) * 100) / 100).toBeGreaterThanOrEqual(4.5);
  });
});

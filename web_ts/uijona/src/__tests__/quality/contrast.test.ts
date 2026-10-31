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
import { contrastRatio, resolveRootTokens, rgbOf } from '../css/tokenCascade';

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

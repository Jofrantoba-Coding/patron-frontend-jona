/**
 * Opt-in base styles (R-FND-5, D7; S-FND-14): `base.css` styles the body and
 * h1-h3 with the type scale; `index.css` adds nothing to them beyond preflight.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.js';

const STYLES = resolve(process.cwd(), 'src/styles');

async function compile(css: string, from: string): Promise<Root> {
  return (await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(css, { from })).root;
}

function declarationsOf(root: Root, selector: string): Record<string, string> {
  const decls: Record<string, string> = {};
  root.walkRules((rule) => {
    if (rule.selectors.map((s) => s.trim()).includes(selector)) rule.walkDecls((decl) => void (decls[decl.prop] = decl.value));
  });
  return decls;
}

/** `selector { decls }` of every rule that targets body or h1-h3. */
function headingAndBodyRules(root: Root): string[] {
  const rules: string[] = [];
  root.walkRules((rule) => {
    if (!rule.selectors.some((s) => /(^|[\s,>+~])(body|h[1-3])\b/.test(s.trim()))) return;
    const decls: string[] = [];
    rule.walkDecls((decl) => void decls.push(`${decl.prop}:${decl.value}`));
    rules.push(`${rule.selector} { ${decls.join('; ')} }`);
  });
  return rules;
}

const scale = (style: string, weight = style) => ({
  'font-size': `var(--jona-text-${style}-size)`,
  'line-height': `var(--jona-text-${style}-leading)`,
  'font-weight': `var(--jona-text-${weight}-weight)`,
});

describe('base.css (S-FND-14)', () => {
  const base = postcss.parse(readFileSync(resolve(STYLES, 'base.css'), 'utf8'));

  it('styles body with the body text style, the fg color and the surface background', () => {
    expect(declarationsOf(base, 'body')).toEqual({
      ...scale('body'),
      color: 'rgb(var(--jona-fg))',
      'background-color': 'rgb(var(--jona-surface))',
    });
  });

  it.each([
    ['h1', scale('page')],
    ['h2', scale('section')],
    ['h3', scale('body', 'section')],
  ])('styles %s with the type scale', (selector, expected) => {
    expect(declarationsOf(base, selector)).toEqual(expected);
  });

  it('index.css has no body or h1-h3 rule beyond preflight', async () => {
    const preflight = headingAndBodyRules(await compile('@tailwind base;', resolve(STYLES, 'preflight.css')));
    const index = headingAndBodyRules(
      await compile(readFileSync(resolve(STYLES, 'index.css'), 'utf8'), resolve(STYLES, 'index.css')),
    );

    expect(preflight.length).toBeGreaterThan(0);
    expect(index.filter((rule) => !preflight.includes(rule))).toEqual([]);
    expect(readFileSync(resolve(STYLES, 'index.css'), 'utf8')).not.toContain('base.css');
  }, 60_000);
});

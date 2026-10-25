/**
 * Cascade contract of the shipped stylesheet (D1, D2; R-FND-2).
 *
 * The stylesheet is compiled in memory exactly as `build:css` does
 * (`postcss-import` + Tailwind over `src/**`), then the resulting rules are
 * evaluated with a small cascade resolver: matching rule, media query,
 * `!important`, specificity, then source order.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import { render, screen } from '@testing-library/react';
import postcss, { type AtRule, type Root, type Rule } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.js';
import { JPanel } from '../../atoms/JPanel';
import { JSidebarLayout } from '../../layouts/JSidebarLayout';

const ENGINE_SELECTOR = /\.jpanel|\.jona-layout-mobile-grid|\.jona-gridbag|\.jona-group-layout|\.jona-spring-layout/;

/* The component state/slot selectors of 1.5.1, in emitted order (D1: unchanged). */
const COMPONENT_STATE_SELECTORS_151 = [
  '.jbutton',
  ".jbutton[data-jbutton-icon-position='right']",
  ".jbutton[data-jbutton-icon-position='top']",
  ".jbutton[data-jbutton-icon-position='bottom']",
  ".jbutton[data-jbutton-full-width='true']",
  '.jbutton-icon',
  '.jbutton-text',
  '.jtextbox-root',
  '.jtextbox',
  '.jtextbox-icon',
  '.jtextbox-icon--left',
  '.jtextbox-icon--right',
  ".jtextbox-root[data-jtextbox-has-icon-left='true']  .jtextbox",
  ".jtextbox-root[data-jtextbox-has-icon-right='true'] .jtextbox",
  ".jtextbox-root[data-jtextbox-error='true'] .jtextbox-icon",
  "[data-jlabel-variant='link']",
  "[data-jlabel-variant='link-muted']",
  "[data-jlabel-variant='link-button']",
  "[data-jlabel-variant='link-danger']",
  "[data-jlabel-variant^='link'][aria-disabled='true']",
  '.jcheckbox',
  '.jcheckbox:focus-visible',
  '.jcheckbox:disabled',
  ".jcheckbox[data-jcheckbox-error='true']",
  ".jcheckbox[data-jcheckbox-indeterminate='true']",
  '.jcombobox',
  '.jcombobox:focus-visible',
  ".jcombobox[data-jcombobox-error='true']",
  '.javatar',
  '.javatar img',
  '.jtextarea',
  ".jtextarea[data-jtextarea-autoresize='true']",
  '.jskeleton',
  '.jskeleton-wave',
  '.jprogress',
  '.jprogress-bar-shimmer',
  '.jprogress-bar-shimmer::after',
  '@media (max-width: 639.98px) .jtextbox',
  '@media (max-width: 639.98px) .jcombobox',
  '@media (max-width: 639.98px) .jtextarea',
];
const COMPONENT_STATE_FAMILY =
  /^(\.jbutton|\.jtextbox|\.jcheckbox|\.jcombobox|\.jtextarea|\[data-jlabel-|\.jskeleton|\.jprogress|\.javatar)/;

/* ── in-memory compile ─────────────────────────────────────────────────────── */

async function compileStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(
    readFileSync(from, 'utf8'),
    { from },
  );
  return result.root;
}

/* ── selector helpers ──────────────────────────────────────────────────────── */

type Specificity = [number, number, number];

const closingParen = (text: string, open: number): number => {
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === '(') depth += 1;
    if (text[i] === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return text.length - 1;
};

const splitTopLevel = (text: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '(' || text[i] === '[') depth += 1;
    if (text[i] === ')' || text[i] === ']') depth -= 1;
    if (text[i] === ',' && depth === 0) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts;
};

const addSpecificity = (a: Specificity, b: Specificity): Specificity => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const compareSpecificity = (a: Specificity, b: Specificity): number => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** Selectors Level 4 specificity of a selector without nesting beyond :where/:is/:not. */
function specificity(selector: string): Specificity {
  let total: Specificity = [0, 0, 0];
  let i = 0;
  while (i < selector.length) {
    const ch = selector[i];
    if (ch === '#') {
      total = addSpecificity(total, [1, 0, 0]);
      i = skipIdent(selector, i + 1);
    } else if (ch === '.') {
      total = addSpecificity(total, [0, 1, 0]);
      i = skipIdent(selector, i + 1);
    } else if (ch === '[') {
      total = addSpecificity(total, [0, 1, 0]);
      i = selector.indexOf(']', i) + 1;
    } else if (selector.startsWith('::', i)) {
      total = addSpecificity(total, [0, 0, 1]);
      i = skipIdent(selector, i + 2);
    } else if (ch === ':') {
      const nameEnd = skipIdent(selector, i + 1);
      const name = selector.slice(i + 1, nameEnd);
      if (selector[nameEnd] === '(') {
        const end = closingParen(selector, nameEnd);
        const inner = selector.slice(nameEnd + 1, end);
        if (name === 'not' || name === 'is') {
          const best = splitTopLevel(inner).map(specificity).sort(compareSpecificity).pop();
          total = addSpecificity(total, best ?? [0, 0, 0]);
        } else if (name !== 'where') {
          total = addSpecificity(total, [0, 1, 0]);
        }
        i = end + 1;
      } else {
        total = addSpecificity(total, [0, 1, 0]);
        i = nameEnd;
      }
    } else if (/[a-zA-Z]/.test(ch)) {
      total = addSpecificity(total, [0, 0, 1]);
      i = skipIdent(selector, i);
    } else {
      i += 1;
    }
  }
  return total;
}

function skipIdent(text: string, from: number): number {
  let i = from;
  while (i < text.length) {
    if (text[i] === '\\') i += 2;
    else if (/[\w-]/.test(text[i])) i += 1;
    else break;
  }
  return i;
}

const unescapeIdent = (ident: string): string => ident.replace(/\\(.)/g, '$1');

/**
 * Matches a compound selector (no combinators) against an element. Supports
 * type, class, attribute (`=`, `^=`, presence), `:where()`, `:is()` and `:not()`.
 * Any combinator or stateful pseudo-class makes the rule not apply.
 */
function matchesCompound(selector: string, el: Element): boolean {
  let i = 0;
  while (i < selector.length) {
    const ch = selector[i];
    if (/[\s>+~]/.test(ch)) return false;
    if (ch === '*') {
      i += 1;
    } else if (ch === '.') {
      const end = skipIdent(selector, i + 1);
      if (!el.classList.contains(unescapeIdent(selector.slice(i + 1, end)))) return false;
      i = end;
    } else if (ch === '[') {
      const end = selector.indexOf(']', i);
      const body = selector.slice(i + 1, end);
      const attr = /^([\w-]+)\s*(\^?=)?\s*(?:'([^']*)'|"([^"]*)"|([\w-]+))?$/.exec(body);
      if (!attr) return false;
      const [, name, op, single, double, bare] = attr;
      const actual = el.getAttribute(name);
      const expected = single ?? double ?? bare;
      if (actual === null) return false;
      if (op === '=' && actual !== expected) return false;
      if (op === '^=' && !actual.startsWith(expected ?? '')) return false;
      i = end + 1;
    } else if (ch === ':') {
      if (selector[i + 1] === ':') return false;
      const nameEnd = skipIdent(selector, i + 1);
      const name = selector.slice(i + 1, nameEnd);
      if (selector[nameEnd] !== '(') return false;
      const end = closingParen(selector, nameEnd);
      const options = splitTopLevel(selector.slice(nameEnd + 1, end));
      const anyMatch = options.some((option) => matchesCompound(option, el));
      if ((name === 'where' || name === 'is') && !anyMatch) return false;
      if (name === 'not' && anyMatch) return false;
      if (!['where', 'is', 'not'].includes(name)) return false;
      i = end + 1;
    } else if (/[a-zA-Z]/.test(ch)) {
      const end = skipIdent(selector, i);
      if (el.tagName.toLowerCase() !== selector.slice(i, end).toLowerCase()) return false;
      i = end;
    } else {
      return false;
    }
  }
  return true;
}

const mediaApplies = (params: string, width: number): boolean => {
  const conditions = Array.from(params.matchAll(/\((min|max)-width:\s*([\d.]+)px\)/g));
  if (conditions.length === 0) return false;
  return conditions.every(([, kind, px]) => (kind === 'min' ? width >= Number(px) : width <= Number(px)));
};

const ruleApplies = (rule: Rule, width: number): boolean => {
  let parent = rule.parent;
  while (parent && parent.type !== 'root') {
    if (parent.type !== 'atrule') return false;
    const atRule = parent as AtRule;
    if (atRule.name !== 'media' || !mediaApplies(atRule.params, width)) return false;
    parent = atRule.parent;
  }
  return true;
};

interface Candidate {
  selector: string;
  value: string;
  important: boolean;
  specificity: Specificity;
  order: number;
}

/** The value of `property` that wins the cascade for `el` at a viewport width. */
function resolveProperty(root: Root, el: Element, property: string, width: number): Candidate | undefined {
  const candidates: Candidate[] = [];
  let order = 0;
  root.walkRules((rule) => {
    order += 1;
    if (!ruleApplies(rule, width)) return;
    const decl = rule.nodes.filter((node) => node.type === 'decl' && node.prop === property).pop();
    if (!decl || decl.type !== 'decl') return;
    rule.selectors
      .filter((selector) => matchesCompound(selector, el))
      .forEach((selector) => {
        candidates.push({
          selector,
          value: decl.value,
          important: Boolean(decl.important),
          specificity: specificity(selector),
          order,
        });
      });
  });
  candidates.sort(
    (a, b) =>
      Number(a.important) - Number(b.important) ||
      compareSpecificity(a.specificity, b.specificity) ||
      a.order - b.order,
  );
  return candidates.pop();
}

const selectorsOf = (root: Root): string[] => {
  const selectors: string[] = [];
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && /keyframes/.test((rule.parent as AtRule).name)) return;
    selectors.push(...rule.selectors);
  });
  return selectors;
};

/* ── tests ─────────────────────────────────────────────────────────────────── */

describe('stylesheet cascade (D1, D2)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileStylesheet();
  }, 60_000);

  it('S-FND-3: every layout-engine selector has zero specificity through :where()', () => {
    const engineSelectors = selectorsOf(css).filter((selector) => ENGINE_SELECTOR.test(selector));

    expect(engineSelectors.length).toBeGreaterThan(100);
    const notWrapped = engineSelectors.filter(
      (selector) => !selector.startsWith(':where(') || closingParen(selector, ':where'.length) !== selector.length - 1,
    );
    expect(notWrapped).toEqual([]);
    const aboveZero = engineSelectors.filter((selector) => compareSpecificity(specificity(selector), [0, 0, 0]) > 0);
    expect(aboveZero).toEqual([]);
  });

  it('S-FND-4: lg:hidden beats a box JPanel from 1024 px', () => {
    render(React.createElement(JPanel, { layout: 'box', className: 'lg:hidden', 'data-testid': 'panel' }, 'x'));
    const panel = screen.getByTestId('panel');

    expect(resolveProperty(css, panel, 'display', 1024)?.value).toBe('none');
    expect(resolveProperty(css, panel, 'display', 1920)?.value).toBe('none');
    expect(resolveProperty(css, panel, 'display', 375)?.value).toBe('flex');
  });

  it('S-FND-4: a responsive display utility (sm:grid) beats a box JPanel from 640 px', () => {
    render(React.createElement(JPanel, { layout: 'box', className: 'sm:grid', 'data-testid': 'panel' }, 'x'));
    const panel = screen.getByTestId('panel');

    expect(resolveProperty(css, panel, 'display', 640)?.value).toBe('grid');
    expect(resolveProperty(css, panel, 'display', 375)?.value).toBe('flex');
  });

  it('S-FND-5: the JSidebarLayout "Abrir menú" bar is hidden from lg and shown below', () => {
    render(
      React.createElement(
        JSidebarLayout,
        { nav: [{ items: [{ key: 'home', label: 'Inicio' }] }] },
        React.createElement('p', null, 'contenido'),
      ),
    );
    const bar = screen.getByRole('button', { name: 'Abrir menú' }).parentElement as HTMLElement;

    expect(bar.classList.contains('jpanel')).toBe(true);
    expect(resolveProperty(css, bar, 'display', 1024)?.value).toBe('none');
    expect(resolveProperty(css, bar, 'display', 1023)?.value).toBe('flex');
    expect(resolveProperty(css, bar, 'display', 375)?.value).toBe('flex');
  });

  it('S-FND-23: the JTextBox left-icon padding still beats px-3', () => {
    const iconRule = resolveRule(css, ".jtextbox-root[data-jtextbox-has-icon-left='true']  .jtextbox");
    const pxRule = resolveRule(css, '.px-3');

    expect(iconRule.decls['padding-left']).toBe('2.25rem');
    expect(pxRule.decls['padding-left']).toBe('0.75rem');
    expect(compareSpecificity(iconRule.specificity, pxRule.specificity)).toBeGreaterThan(0);
  });

  it('S-FND-23: the component state and slot selectors are byte-identical to 1.5.1', () => {
    const componentSelectors: string[] = [];
    css.walkRules((rule) => {
      if (rule.parent?.type === 'atrule' && /keyframes/.test((rule.parent as AtRule).name)) return;
      const media = rule.parent?.type === 'atrule' ? `@${(rule.parent as AtRule).name} ${(rule.parent as AtRule).params} ` : '';
      rule.selectors
        .filter((selector) => COMPONENT_STATE_FAMILY.test(selector))
        .forEach((selector) => componentSelectors.push(media + selector));
    });

    expect(componentSelectors).toEqual(COMPONENT_STATE_SELECTORS_151);
  });

  it('D2: [hidden] is display:none !important in the base layer, ahead of every utility', () => {
    const hiddenRule = resolveRule(css, "[hidden]:where(:not([hidden='until-found']))");

    expect(hiddenRule.decls.display).toBe('none');
    expect(hiddenRule.important.display).toBe(true);
    expect(hiddenRule.order).toBeLessThan(resolveRule(css, '.flex').order);
  });

  it('D2: the hidden attribute hides an element that also carries flex', () => {
    render(React.createElement('div', { className: 'flex', hidden: true, 'data-testid': 'hidden' }));
    const el = screen.getByTestId('hidden');

    expect(resolveProperty(css, el, 'display', 375)?.value).toBe('none');
    expect(resolveProperty(css, el, 'display', 1920)?.value).toBe('none');
  });
});

interface ResolvedRule {
  decls: Record<string, string>;
  important: Record<string, boolean>;
  specificity: Specificity;
  order: number;
}

/** The last rule (outside media queries) whose selector list contains `selector`. */
function resolveRule(root: Root, selector: string): ResolvedRule {
  let found: ResolvedRule | undefined;
  let order = 0;
  root.walkRules((rule) => {
    order += 1;
    if (rule.parent?.type !== 'root' || !rule.selectors.includes(selector)) return;
    const decls: Record<string, string> = {};
    const important: Record<string, boolean> = {};
    rule.walkDecls((decl) => {
      decls[decl.prop] = decl.value;
      important[decl.prop] = Boolean(decl.important);
    });
    found = { decls, important, specificity: specificity(selector), order };
  });
  if (!found) throw new Error(`No top-level rule for selector ${selector}`);
  return found;
}

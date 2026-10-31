/**
 * Resolves the `--jona-*` custom properties that the document root gets from
 * the compiled stylesheet, for a given root state (attributes, OS color
 * scheme, viewport width). Test helper for the token tests (R-FND-3..6).
 *
 * Only the selector forms the token sheet uses are understood: `:root`,
 * `[attr='value']`, `:not([attr='value'])` and a descendant `[data-jona-scope]`
 * (which never matches the root). Any other form throws, so a new selector
 * shape fails loudly instead of being ignored.
 */
import type { AtRule, Root, Rule } from 'postcss';

export interface RootState {
  /** attributes on the document root, for example `{ 'data-theme-mode': 'dark' }` */
  attrs?: Record<string, string>;
  /** the OS reports `prefers-color-scheme: dark` */
  osDark?: boolean;
  /** viewport width in px (default 1024) */
  width?: number;
}

export interface TokenRule {
  selectors: string[];
  media: string | null;
  decls: Map<string, string>;
}

/** Every rule that declares a `--jona-*` property, in source order. */
export function tokenRules(root: Root): TokenRule[] {
  const rules: TokenRule[] = [];
  root.walkRules((rule: Rule) => {
    const decls = new Map<string, string>();
    rule.walkDecls((decl) => {
      if (decl.prop.startsWith('--jona-') || decl.prop === 'color-scheme') decls.set(decl.prop, decl.value.trim());
    });
    if (![...decls.keys()].some((prop) => prop.startsWith('--jona-'))) return;
    const parent = rule.parent as AtRule | Root | undefined;
    const media = parent && parent.type === 'atrule' && (parent as AtRule).name === 'media' ? (parent as AtRule).params : null;
    rules.push({ selectors: rule.selectors.map((selector) => selector.trim()), media, decls });
  });
  return rules;
}

const COMPOUND = /^(?::root|\[[\w-]+='[\w-]+'\]|:not\(\[[\w-]+='[\w-]+'\]\))/;

/** The specificity weight of a root selector, or null when it cannot match the root. */
function matchRoot(selector: string, attrs: Record<string, string>): number | null {
  if (/\s/.test(selector)) {
    if (/\s\[data-jona-scope\]$/.test(selector)) return null;
    throw new Error(`unsupported token selector: ${selector}`);
  }
  if (selector === '[data-jona-scope]') return null;
  let rest = selector;
  let weight = 0;
  let matches = true;
  while (rest.length > 0) {
    const part = COMPOUND.exec(rest)?.[0];
    if (!part) throw new Error(`unsupported token selector: ${selector}`);
    rest = rest.slice(part.length);
    weight += 1;
    const attr = /\[([\w-]+)='([\w-]+)'\]/.exec(part);
    if (!attr) continue;
    const equal = attrs[attr[1]] === attr[2];
    if (part.startsWith(':not(') ? equal : !equal) matches = false;
  }
  return matches ? weight : null;
}

function matchMedia(media: string | null, state: Required<RootState>): boolean {
  if (media === null) return true;
  const scheme = /^\(prefers-color-scheme:\s*(dark|light)\)$/.exec(media);
  if (scheme) return (scheme[1] === 'dark') === state.osDark;
  const minWidth = /^\(min-width:\s*(\d+)px\)$/.exec(media);
  if (minWidth) return state.width >= Number(minWidth[1]);
  throw new Error(`unsupported token media query: ${media}`);
}

/** The cascaded value of every `--jona-*` property on the root for `state`. */
export function resolveRootTokens(root: Root, state: RootState = {}): Map<string, string> {
  const full: Required<RootState> = { attrs: {}, osDark: false, width: 1024, ...state };
  const winners = new Map<string, { value: string; weight: number }>();
  tokenRules(root).forEach((rule) => {
    if (!matchMedia(rule.media, full)) return;
    const weights = rule.selectors.map((selector) => matchRoot(selector, full.attrs)).filter((w): w is number => w !== null);
    if (weights.length === 0) return;
    const weight = Math.max(...weights);
    rule.decls.forEach((value, prop) => {
      const current = winners.get(prop);
      if (!current || weight >= current.weight) winners.set(prop, { value, weight });
    });
  });
  return new Map([...winners].map(([prop, { value }]) => [prop, value]));
}

/** Follows `var()` references down to an `R G B` triplet. */
export function rgbOf(tokens: Map<string, string>, prop: string): [number, number, number] {
  let value = tokens.get(prop);
  for (let hops = 0; value !== undefined && hops < 10; hops += 1) {
    const reference = /^var\((--[\w-]+)\)$/.exec(value);
    if (!reference) break;
    value = tokens.get(reference[1]);
  }
  const triplet = value?.match(/^(\d+)\s+(\d+)\s+(\d+)$/);
  if (!triplet) throw new Error(`${prop} does not resolve to an RGB triplet (got ${String(value)})`);
  return [Number(triplet[1]), Number(triplet[2]), Number(triplet[3])];
}

const channel = (value: number): number => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: [number, number, number]): number =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** WCAG 2 contrast ratio of two colors. */
export function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

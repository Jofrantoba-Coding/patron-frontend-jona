/**
 * Resolves what the compiled stylesheet gives an element at a viewport width,
 * from its single-class utility rules only (no pseudo-classes, no combinators).
 * Utilities share one specificity, so the last matching rule in source order
 * wins; a `min-width` media rule applies from its breakpoint up.
 */
import type { AtRule, Root, Rule } from 'postcss';

/** CSS identifier unescape: hex escapes (`\2c `) and single-character escapes (`\:`). */
const unescapeCss = (ident: string): string =>
  ident.replace(/\\([0-9a-fA-F]{1,6} ?|.)/g, (_, escape: string) =>
    /^[0-9a-fA-F]{1,6} ?$/.test(escape) ? String.fromCodePoint(parseInt(escape, 16)) : escape,
  );

const SINGLE_CLASS = /^\.((?:\\[0-9a-fA-F]{1,6} ?|\\.|[\w-])+)$/;

const minWidthOf = (rule: Rule): number | null => {
  const parent = rule.parent;
  if (!parent || parent.type !== 'atrule') return 0;
  const media = parent as AtRule;
  if (media.name !== 'media') return null;
  const match = /^\(min-width:\s*(\d+)px\)$/.exec(media.params.trim());
  return match ? Number(match[1]) : null;
};

/** The `prop` value the element's utility classes resolve to at `viewport` px, if any. */
export function utilityStyle(root: Root, element: Element, viewport: number, prop: string): string | undefined {
  const classes = new Set(Array.from(element.classList));
  let value: string | undefined;
  root.walkRules((rule) => {
    const minWidth = minWidthOf(rule);
    if (minWidth === null || viewport < minWidth) return;
    const matches = rule.selectors.some((selector) => {
      const match = SINGLE_CLASS.exec(selector.trim());
      return !!match && classes.has(unescapeCss(match[1]));
    });
    if (!matches) return;
    rule.walkDecls(prop, (decl) => {
      value = decl.value;
    });
  });
  return value;
}

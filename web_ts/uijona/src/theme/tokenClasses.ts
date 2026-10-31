/**
 * Class constants for the semantic tokens of tokens.css (D5). Internal: lib
 * Views paint colors, control heights and titles only through these.
 *
 * Every value is a literal string (no interpolation), so the lib build and any
 * consumer Tailwind that scans `dist/**\/*.js` generate the same classes; the
 * consumer only needs `jona-ui/theme/tokens.css`. One class serves both
 * themes: the token changes under `data-theme-mode`, not the class.
 */

/* ── Surfaces ─────────────────────────────────────────────────────────────── */
export const SURFACE = 'bg-[rgb(var(--jona-surface))]';
export const SURFACE_MUTED = 'bg-[rgb(var(--jona-surface-muted))]';
export const SURFACE_RAISED = 'bg-[rgb(var(--jona-surface-raised))]';

/* ── Foreground ───────────────────────────────────────────────────────────── */
export const FG = 'text-[rgb(var(--jona-fg))]';
export const FG_MUTED = 'text-[rgb(var(--jona-fg-muted))]';
export const ON_PRIMARY = 'text-[rgb(var(--jona-on-primary))]';

/* ── Lines ────────────────────────────────────────────────────────────────── */
export const LINE = 'border-[rgb(var(--jona-line))]';
export const LINE_STRONG = 'border-[rgb(var(--jona-line-strong))]';

/* ── Focus and selection ──────────────────────────────────────────────────── */
export const FOCUS_RING = 'focus-visible:ring-[rgb(var(--jona-focus))]';
export const SELECTION = 'bg-[rgb(var(--jona-selection))]';

/* ── Density (D8) ─────────────────────────────────────────────────────────────
 * Both breakpoints, so twMerge also replaces a size's own `sm:` height. */
export const CONTROL_H = 'min-h-[var(--jona-control-h)] sm:min-h-[var(--jona-control-h)]';

/* ── Type scale (D7, R-FND-5) ─────────────────────────────────────────────── */
export const TEXT_PAGE = 'text-[1.25rem] leading-7 font-semibold';
export const TEXT_SECTION = 'text-base leading-6 font-semibold';
export const TEXT_BODY = 'text-sm leading-5';
export const TEXT_SMALL = 'text-[0.8125rem] leading-[1.125rem]';
export const TEXT_CAPTION = 'text-xs leading-4';
export const TEXT_TABLE = 'text-[0.8125rem] leading-[1.125rem] tabular-nums';

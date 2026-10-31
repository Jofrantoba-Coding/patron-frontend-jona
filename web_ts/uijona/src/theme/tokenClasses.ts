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
export const HOVER_SURFACE_MUTED = 'hover:bg-[rgb(var(--jona-surface-muted))]';
/** A translucent fg wash: a hover that shows on any surface, in both modes. */
export const HOVER_OVERLAY = 'hover:bg-[rgb(var(--jona-fg)/0.06)]';
export const FOCUS_OVERLAY = 'focus-visible:bg-[rgb(var(--jona-fg)/0.06)]';
/** Modal scrim: neutral-900 at 50% in light; black at 70% in dark, so it still dims a dark page. */
export const BACKDROP = 'bg-[rgb(var(--jona-backdrop)/var(--jona-backdrop-alpha))]';
/** Inverted pair for dark-on-light chrome (toasts, tooltips); flips with the mode. */
export const INVERSE = 'bg-[rgb(var(--jona-fg))] text-[rgb(var(--jona-surface))]';

/* ── Foreground ───────────────────────────────────────────────────────────── */
export const FG = 'text-[rgb(var(--jona-fg))]';
export const FG_MUTED = 'text-[rgb(var(--jona-fg-muted))]';
export const HOVER_FG = 'hover:text-[rgb(var(--jona-fg))]';
export const BEFORE_FG_MUTED = 'before:text-[rgb(var(--jona-fg-muted))]';
export const FG_MUTED_FILL = 'fill-[rgb(var(--jona-fg-muted))]';
export const PLACEHOLDER = 'placeholder:text-[rgb(var(--jona-fg-muted))]';
export const ON_PRIMARY = 'text-[rgb(var(--jona-on-primary))]';
export const ON_PRIMARY_BG = 'bg-[rgb(var(--jona-on-primary))]';
export const ON_PRIMARY_BORDER = 'border-[rgb(var(--jona-on-primary))]';

/* ── Lines ────────────────────────────────────────────────────────────────── */
export const LINE = 'border-[rgb(var(--jona-line))]';
export const MD_LINE = 'md:border-[rgb(var(--jona-line))]';
export const DIVIDE = 'divide-[rgb(var(--jona-line))]';
export const LINE_STRONG = 'border-[rgb(var(--jona-line-strong))]';
/** Control borders and tracks: line-strong at 45%, close to the 1.5.x neutral-300. */
export const CONTROL_BORDER = 'border-[rgb(var(--jona-line-strong)/0.45)]';
export const HOVER_CONTROL_BORDER = 'hover:border-[rgb(var(--jona-line-strong)/0.45)]';
export const LINE_BG = 'bg-[rgb(var(--jona-line))]';
export const LINE_STROKE = 'stroke-[rgb(var(--jona-line))]';
export const LINE_BG_STRONG = 'bg-[rgb(var(--jona-line-strong)/0.45)]';
export const HOVER_LINE_BG_STRONG = 'hover:bg-[rgb(var(--jona-line-strong)/0.45)]';

/* ── Focus and selection ──────────────────────────────────────────────────── */
export const FOCUS_RING = 'focus-visible:ring-[rgb(var(--jona-focus))]';
/** Focus color for elements that cannot carry a ring, such as table rows. */
export const FOCUS_OUTLINE = 'focus-visible:outline-[rgb(var(--jona-focus))]';
export const SELECTION = 'bg-[rgb(var(--jona-selection))]';
export const HOVER_SELECTION = 'hover:bg-[rgb(var(--jona-selection))]';
export const SELECTED_STATE = 'data-[state=selected]:bg-[rgb(var(--jona-selection))]';

/* ── Status tints (R-FND-3): 50 surface, 100 strong surface, 700 text ─────── */
export const DANGER_BG = 'bg-[rgb(var(--jona-danger-50))]';
export const DANGER_BG_STRONG = 'bg-[rgb(var(--jona-danger-100))]';
export const DANGER_FG = 'text-[rgb(var(--jona-danger-700))]';
export const HOVER_DANGER_FG = 'hover:text-[rgb(var(--jona-danger-700))]';
export const SUCCESS_BG = 'bg-[rgb(var(--jona-success-50))]';
export const SUCCESS_FG = 'text-[rgb(var(--jona-success-700))]';
export const WARNING_BG = 'bg-[rgb(var(--jona-warning-50))]';
export const WARNING_FG = 'text-[rgb(var(--jona-warning-700))]';

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

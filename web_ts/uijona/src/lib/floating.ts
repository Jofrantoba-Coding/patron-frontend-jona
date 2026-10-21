/**
 * Viewport-aware placement for portal panels (JCombobox, JMultiSelect, JDatePicker).
 *
 * Pure function: the Impl measures the trigger and the panel, this decides where
 * the panel goes. On a phone the trigger is often in the lower half of the
 * screen (or the on-screen keyboard eats the space below), so the panel flips
 * above the trigger instead of opening off-screen.
 *
 * Not part of the public API: consumed by Impl layers only.
 */

export interface FloatingAnchor {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

export interface FloatingSize {
  width: number;
  height: number;
}

export interface FloatingViewport {
  width: number;
  height: number;
}

export interface FloatingPosition {
  placement: 'bottom' | 'top';
  /** Set when placement is 'bottom' (CSS `top`). */
  top?: number;
  /** Set when placement is 'top' (CSS `bottom`), so a shrinking panel stays glued to the trigger. */
  bottom?: number;
  left: number;
}

export interface FloatingOptions {
  /** Distance between trigger and panel. */
  gap?: number;
  /** Minimum distance between panel and viewport edges. */
  margin?: number;
}

export function computeFloatingPosition(
  anchor: FloatingAnchor,
  floating: FloatingSize,
  viewport: FloatingViewport,
  { gap = 4, margin = 8 }: FloatingOptions = {},
): FloatingPosition {
  const spaceBelow = viewport.height - anchor.bottom - gap - margin;
  const spaceAbove = anchor.top - gap - margin;
  const fitsBelow = floating.height <= spaceBelow;
  const placement = fitsBelow || spaceBelow >= spaceAbove ? 'bottom' : 'top';

  const maxLeft = viewport.width - floating.width - margin;
  const left = Math.max(margin, Math.min(anchor.left, maxLeft));

  return placement === 'bottom'
    ? { placement, top: anchor.bottom + gap, left }
    : { placement, bottom: viewport.height - anchor.top + gap, left };
}

/** Converts a computed position into the fixed-position style of a portal panel. */
export function floatingStyle(position: FloatingPosition, extra: { width?: number } = {}): {
  position: 'fixed';
  top?: number;
  bottom?: number;
  left: number;
  width?: number;
  zIndex: number;
} {
  return {
    position: 'fixed',
    ...(position.placement === 'bottom' ? { top: position.top } : { bottom: position.bottom }),
    left: position.left,
    ...(extra.width !== undefined ? { width: extra.width } : {}),
    zIndex: 50,
  };
}

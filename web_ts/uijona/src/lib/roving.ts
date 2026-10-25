/**
 * Roving focus math for composite widgets (toolbar, grid, menus). Internal:
 * consumed by Impl layers only, not part of the public API.
 */

export interface RovingOptions {
  /** Horizontal uses ← / →; vertical uses ↑ / ↓. */
  orientation: 'horizontal' | 'vertical';
  /** PgUp / PgDn step. Without it the paging keys are not handled. */
  pageStep?: number;
  /** Indexes that cannot take focus are skipped (all are enabled by default). */
  isEnabled?: (index: number) => boolean;
}

/**
 * The index a key moves the roving focus to.
 *
 * Returns `null` when the key is not handled (the caller keeps the browser
 * default). At a bound the key is handled and the current index is returned,
 * so the caller prevents the default but changes nothing. From no focus (-1),
 * any move enters at the first enabled index (End at the last).
 */
export function nextRovingIndex(current: number, count: number, key: string, options: RovingOptions): number | null {
  if (count <= 0) return null;
  const { orientation, pageStep, isEnabled = () => true } = options;
  const enabled = Array.from({ length: count }, (_, index) => index).filter(isEnabled);
  if (enabled.length === 0) return null;

  const first = enabled[0];
  const last = enabled[enabled.length - 1];
  const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
  const paging = pageStep !== undefined && pageStep > 0;

  if (key === 'Home') return first;
  if (key === 'End') return last;
  const handled = key === nextKey || key === prevKey || (paging && (key === 'PageDown' || key === 'PageUp'));
  if (!handled) return null;
  if (current < 0) return first;

  if (key === nextKey) return enabled.find((index) => index > current) ?? current;
  if (key === prevKey) return [...enabled].reverse().find((index) => index < current) ?? current;

  const step = pageStep as number;
  if (key === 'PageDown') {
    const reachable = enabled.filter((index) => index > current && index <= current + step);
    return reachable.length > 0 ? reachable[reachable.length - 1] : current;
  }
  const reachable = enabled.filter((index) => index < current && index >= current - step);
  return reachable.length > 0 ? reachable[0] : current;
}

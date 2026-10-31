// themeInit.ts — stored theme mode bootstrap (R-FND-4, D6; S-FND-26)
import type { JonaThemeMode } from './InterThemeMode';

type MatchMedia = (query: string) => { matches: boolean };

/**
 * Reads the stored mode (missing or invalid -> `system`), resolves it against
 * `prefers-color-scheme` and sets `data-theme-mode` (the choice) and
 * `data-theme` (the resolved theme) on `root`. Returns the mode.
 *
 * Self-contained on purpose: `themeInitScript` serialises its source, so it
 * must not reference anything outside its own body.
 */
export function applyStoredThemeMode(
  storage: Storage,
  root: HTMLElement,
  storageKey?: string,
  matchMedia?: MatchMedia,
): JonaThemeMode {
  let stored: string | null = null;
  try {
    stored = storage.getItem(storageKey || 'jona-theme-mode');
  } catch (error) {
    stored = null;
  }
  const mode: JonaThemeMode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  const media =
    matchMedia || (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia.bind(window) : null);
  const dark = mode === 'dark' || (mode === 'system' && !!media && media('(prefers-color-scheme: dark)').matches);
  root.setAttribute('data-theme-mode', mode);
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  return mode;
}

/**
 * An inline pre-paint script for `index.html` that runs `applyStoredThemeMode`
 * on `<html>` before the app renders, so a stored dark mode never flashes light.
 */
export function themeInitScript(storageKey: string = 'jona-theme-mode'): string {
  const key = JSON.stringify(storageKey).replace(/</g, '\\u003c');
  return (
    '(function(){var s=null;try{s=window.localStorage}catch(e){}' +
    `(${applyStoredThemeMode.toString()})(s,document.documentElement,${key});})();`
  );
}

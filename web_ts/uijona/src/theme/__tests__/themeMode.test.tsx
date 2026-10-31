/**
 * Theme mode: provider, hook, stored-mode bootstrap and init script
 * (R-FND-4; S-FND-9, S-FND-10, S-FND-11, S-FND-26).
 */
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { applyStoredThemeMode, JonaThemeModeProvider, themeInitScript, useThemeMode, type JonaThemeMode } from '../index';

const QUERY = '(prefers-color-scheme: dark)';

/** A controllable `prefers-color-scheme` media query. */
function fakeMatchMedia(initialDark: boolean) {
  let dark = initialDark;
  const listeners = new Set<(event: { matches: boolean }) => void>();
  const matchMedia = (query: string) => ({
    get matches() {
      return query === QUERY && dark;
    },
    media: query,
    addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.delete(listener),
  });
  return {
    matchMedia,
    setDark(next: boolean) {
      dark = next;
      listeners.forEach((listener) => listener({ matches: next }));
    },
  };
}

function memoryStorage(entries: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(entries));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  };
}

const root = document.documentElement;
const attrs = () => [root.getAttribute('data-theme-mode'), root.getAttribute('data-theme')];

function Probe() {
  const { mode, resolved, setMode } = useThemeMode();
  return (
    <div>
      <output aria-label="mode">{mode}</output>
      <output aria-label="resolved">{resolved}</output>
      {(['system', 'light', 'dark'] as JonaThemeMode[]).map((next) => (
        <button key={next} type="button" onClick={() => setMode(next)}>
          {next}
        </button>
      ))}
    </div>
  );
}

let os: ReturnType<typeof fakeMatchMedia>;

beforeEach(() => {
  os = fakeMatchMedia(false);
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: os.matchMedia });
  window.localStorage.clear();
});

afterEach(() => {
  root.removeAttribute('data-theme-mode');
  root.removeAttribute('data-theme');
});

describe('applyStoredThemeMode (S-FND-26)', () => {
  it('applies a stored dark mode to the root', () => {
    const mode = applyStoredThemeMode(memoryStorage({ 'jona-theme-mode': 'dark' }), root);

    expect(mode).toBe('dark');
    expect(attrs()).toEqual(['dark', 'dark']);
  });

  it('reads an invalid value as system and resolves it from the OS', () => {
    const { matchMedia } = fakeMatchMedia(true);
    const mode = applyStoredThemeMode(memoryStorage({ 'jona-theme-mode': 'blue' }), root, undefined, matchMedia);

    expect(mode).toBe('system');
    expect(attrs()).toEqual(['system', 'dark']);
  });

  it('reads a missing value as system, with a custom key', () => {
    const storage = memoryStorage({ 'jona-theme-mode': 'dark' });

    expect(applyStoredThemeMode(storage, root, 'app-theme', fakeMatchMedia(false).matchMedia)).toBe('system');
    expect(attrs()).toEqual(['system', 'light']);
    expect(applyStoredThemeMode(memoryStorage({ 'app-theme': 'light' }), root, 'app-theme')).toBe('light');
  });

  it('falls back to system when the storage throws', () => {
    const blocked = memoryStorage();
    blocked.getItem = () => {
      throw new Error('SecurityError');
    };

    expect(applyStoredThemeMode(blocked, root)).toBe('system');
    expect(attrs()).toEqual(['system', 'light']);
  });
});

describe('themeInitScript (S-FND-26)', () => {
  it('serialises applyStoredThemeMode into a self-contained pre-paint script', () => {
    window.localStorage.setItem('jona-theme-mode', 'dark');

    new Function(themeInitScript())();

    expect(attrs()).toEqual(['dark', 'dark']);
  });

  it('uses the given storage key and the live OS preference', () => {
    window.localStorage.setItem('app-theme', 'system');
    os.setDark(true);

    new Function(themeInitScript('app-theme'))();

    expect(attrs()).toEqual(['system', 'dark']);
    expect(themeInitScript('</script><b>')).not.toContain('</script>');
  });
});

describe('JonaThemeModeProvider and useThemeMode', () => {
  it('S-FND-9: system follows the OS, live, with no reload', () => {
    os.setDark(true);
    render(<JonaThemeModeProvider><Probe /></JonaThemeModeProvider>);

    expect(screen.getByLabelText('mode')).toHaveTextContent('system');
    expect(screen.getByLabelText('resolved')).toHaveTextContent('dark');
    expect(attrs()).toEqual(['system', 'dark']);

    act(() => os.setDark(false));

    expect(screen.getByLabelText('resolved')).toHaveTextContent('light');
    expect(attrs()).toEqual(['system', 'light']);
  });

  it('S-FND-10: an explicit light mode wins over an OS that prefers dark', () => {
    os.setDark(true);
    render(<JonaThemeModeProvider defaultMode="light"><Probe /></JonaThemeModeProvider>);

    expect(screen.getByLabelText('resolved')).toHaveTextContent('light');
    expect(attrs()).toEqual(['light', 'light']);
  });

  it('S-FND-11: the chosen mode persists and is restored on remount', () => {
    const { unmount } = render(<JonaThemeModeProvider storageKey="app-theme"><Probe /></JonaThemeModeProvider>);

    act(() => screen.getByRole('button', { name: 'dark' }).click());

    expect(window.localStorage.getItem('app-theme')).toBe('dark');
    expect(attrs()).toEqual(['dark', 'dark']);
    unmount();

    render(<JonaThemeModeProvider storageKey="app-theme"><Probe /></JonaThemeModeProvider>);
    expect(screen.getByLabelText('mode')).toHaveTextContent('dark');
  });

  it('S-FND-11: a stored invalid value is read as system', () => {
    window.localStorage.setItem('jona-theme-mode', 'blue');
    render(<JonaThemeModeProvider defaultMode="dark"><Probe /></JonaThemeModeProvider>);

    expect(screen.getByLabelText('mode')).toHaveTextContent('system');
  });

  it('useThemeMode outside the provider throws a clear error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Probe />)).toThrow('useThemeMode must be used inside <JonaThemeModeProvider>');
    spy.mockRestore();
  });
});

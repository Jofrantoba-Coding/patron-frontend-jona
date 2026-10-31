// ThemeModeImpl.tsx — JONA Implementation (R-FND-4, D6)
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  InterThemeModeProvider,
  InterThemeModeValue,
  isThemeMode,
  JonaResolvedTheme,
  JonaThemeMode,
  THEME_MODE_DEFAULTS,
  THEME_MODE_QUERY,
} from './InterThemeMode';

const ThemeModeContext = createContext<InterThemeModeValue | null>(null);

/** Missing -> `defaultMode`; invalid -> `system`; unreadable storage -> `defaultMode`. */
function readStoredMode(storageKey: string, defaultMode: JonaThemeMode): JonaThemeMode {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(storageKey);
  } catch {
    stored = null;
  }
  if (stored === null) return defaultMode;
  return isThemeMode(stored) ? stored : 'system';
}

const mediaQuery = (): MediaQueryList | null =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(THEME_MODE_QUERY) : null;

export const JonaThemeModeProvider: React.FC<InterThemeModeProvider> = ({ defaultMode, storageKey, children }) => {
  const key = storageKey ?? THEME_MODE_DEFAULTS.storageKey;
  const [mode, setModeState] = useState<JonaThemeMode>(() =>
    readStoredMode(key, defaultMode ?? THEME_MODE_DEFAULTS.defaultMode),
  );
  const [systemDark, setSystemDark] = useState<boolean>(() => mediaQuery()?.matches ?? false);

  useEffect(() => {
    const query = mediaQuery();
    if (!query) return undefined;
    const onChange = (event: { matches: boolean }) => setSystemDark(event.matches);
    setSystemDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const resolved: JonaResolvedTheme = mode === 'dark' || (mode === 'system' && systemDark) ? 'dark' : 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-mode', mode);
    root.setAttribute('data-theme', resolved);
  }, [mode, resolved]);

  const setMode = useCallback(
    (next: JonaThemeMode) => {
      const valid = isThemeMode(next) ? next : 'system';
      try {
        window.localStorage.setItem(key, valid);
      } catch {
        // Storage unavailable: the choice lasts for this page only.
      }
      setModeState(valid);
    },
    [key],
  );

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export function useThemeMode(): InterThemeModeValue {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error('useThemeMode must be used inside <JonaThemeModeProvider>');
  return context;
}

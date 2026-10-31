// InterThemeMode.ts — JONA Interface (R-FND-4, D6)
import type React from 'react';

/** The user's choice. `system` follows `prefers-color-scheme`, live. */
export type JonaThemeMode = 'system' | 'light' | 'dark';

/** The theme that `mode` resolves to, set as `data-theme` on the root. */
export type JonaResolvedTheme = 'light' | 'dark';

export interface InterThemeModeProvider {
  /** Mode used when nothing is stored. Default `system`. */
  defaultMode?: JonaThemeMode;
  /** `localStorage` key of the persisted choice. Default `jona-theme-mode`. */
  storageKey?: string;
  children: React.ReactNode;
}

export interface InterThemeModeValue {
  mode: JonaThemeMode;
  resolved: JonaResolvedTheme;
  setMode: (mode: JonaThemeMode) => void;
}

export const THEME_MODE_DEFAULTS: Required<Pick<InterThemeModeProvider, 'defaultMode' | 'storageKey'>> = {
  defaultMode: 'system',
  storageKey: 'jona-theme-mode',
};

export const THEME_MODE_QUERY = '(prefers-color-scheme: dark)';

export const isThemeMode = (value: unknown): value is JonaThemeMode =>
  value === 'system' || value === 'light' || value === 'dark';

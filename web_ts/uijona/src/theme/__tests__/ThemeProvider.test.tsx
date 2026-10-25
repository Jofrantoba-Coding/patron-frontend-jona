/**
 * JonaThemeProvider overrides with the 1.6.0 tokens (R-FND-3, R-FND-4; S-FND-12).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import { render } from '@testing-library/react';
import { JonaThemeProvider, type JonaThemeTokens } from '../index';

const TOKENS_CSS = readFileSync(resolve(process.cwd(), 'src/theme/tokens.css'), 'utf8');

/* The JonaThemeTokens keys added in 1.6.0 (design, Interfaces) and the property each one sets. */
const NEW_KEYS: [keyof JonaThemeTokens, string][] = [
  ['white', '--jona-white'],
  ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
    (step): [keyof JonaThemeTokens, string] => [`accent${step}` as keyof JonaThemeTokens, `--jona-accent-${step}`],
  ),
  ...['danger', 'success', 'warning'].flatMap((tone) =>
    [50, 100, 700].map((step): [keyof JonaThemeTokens, string] => [`${tone}${step}` as keyof JonaThemeTokens, `--jona-${tone}-${step}`]),
  ),
  ['surface', '--jona-surface'],
  ['surfaceMuted', '--jona-surface-muted'],
  ['surfaceRaised', '--jona-surface-raised'],
  ['fg', '--jona-fg'],
  ['fgMuted', '--jona-fg-muted'],
  ['line', '--jona-line'],
  ['lineStrong', '--jona-line-strong'],
  ['focus', '--jona-focus'],
  ['selection', '--jona-selection'],
  ['onPrimary', '--jona-on-primary'],
];

const root = document.documentElement;

afterEach(() => {
  root.removeAttribute('data-theme-mode');
  root.removeAttribute('style');
  document.body.innerHTML = '';
});

describe('JonaThemeProvider (S-FND-12)', () => {
  it.each(['light', 'dark'])('applies a primary override on the root in %s mode, as in 1.5.1', (mode) => {
    root.setAttribute('data-theme-mode', mode);
    render(<JonaThemeProvider theme={{ primary600: '124 58 237' }}>x</JonaThemeProvider>);

    expect(root.style.getPropertyValue('--jona-primary-600')).toBe('124 58 237');
  });

  it('sets every 1.6.0 token key, each to a property that tokens.css declares', () => {
    const theme = Object.fromEntries(NEW_KEYS.map(([key], index) => [key, `${index} 1 2`])) as JonaThemeTokens;
    render(<JonaThemeProvider theme={theme}>x</JonaThemeProvider>);

    const applied = NEW_KEYS.map(([, prop], index) => [prop, root.style.getPropertyValue(prop)]);
    expect(applied).toEqual(NEW_KEYS.map(([, prop], index) => [prop, `${index} 1 2`]));
    expect(NEW_KEYS.filter(([, prop]) => !TOKENS_CSS.includes(`${prop}:`))).toEqual([]);
  });

  it('marks a non-root scope with data-jona-scope so the semantic tokens follow its overrides', () => {
    const scope = document.createElement('div');
    scope.id = 'app';
    document.body.appendChild(scope);

    const { unmount } = render(
      <JonaThemeProvider scope="#app" theme={{ neutral900: '1 2 3', surface: '4 5 6' }}>x</JonaThemeProvider>,
    );

    expect(scope.hasAttribute('data-jona-scope')).toBe(true);
    expect(scope.style.getPropertyValue('--jona-surface')).toBe('4 5 6');
    expect(root.hasAttribute('data-jona-scope')).toBe(false);

    unmount();
    expect(scope.hasAttribute('data-jona-scope')).toBe(false);
    expect(scope.style.getPropertyValue('--jona-neutral-900')).toBe('');
  });

  it('does not mark the root as a scope', () => {
    render(<JonaThemeProvider theme={{ fg: '1 2 3' }}>x</JonaThemeProvider>);

    expect(root.style.getPropertyValue('--jona-fg')).toBe('1 2 3');
    expect(root.hasAttribute('data-jona-scope')).toBe(false);
  });
});

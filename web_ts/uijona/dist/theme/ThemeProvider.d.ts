import React from 'react';
export type JonaThemeTokens = {
    primary50?: string;
    primary100?: string;
    primary200?: string;
    primary300?: string;
    primary400?: string;
    primary500?: string;
    primary600?: string;
    primary700?: string;
    primary800?: string;
    primary900?: string;
    danger400?: string;
    danger500?: string;
    danger600?: string;
    success400?: string;
    success500?: string;
    success600?: string;
    warning400?: string;
    warning500?: string;
    warning600?: string;
    neutral50?: string;
    neutral100?: string;
    neutral200?: string;
    neutral300?: string;
    neutral400?: string;
    neutral500?: string;
    neutral600?: string;
    neutral700?: string;
    neutral800?: string;
    neutral900?: string;
    radiusSm?: string;
    radius?: string;
    radiusMd?: string;
    radiusLg?: string;
    fontSans?: string;
    fontMono?: string;
};
export interface InterThemeProvider {
    theme?: JonaThemeTokens;
    /** CSS selector to scope the theme. Defaults to ":root" */
    scope?: string;
    children: React.ReactNode;
}
/**
 * JonaThemeProvider
 *
 * Wraps your app and injects CSS custom properties for the JONA design system.
 * Import the default theme CSS once at your app entry point:
 *
 *   import 'jona-ui/theme';
 *
 * Then optionally override tokens:
 *
 *   <JonaThemeProvider theme={{ primary600: '124 58 237' }}>
 *     <App />
 *   </JonaThemeProvider>
 */
export declare const JonaThemeProvider: React.FC<InterThemeProvider>;

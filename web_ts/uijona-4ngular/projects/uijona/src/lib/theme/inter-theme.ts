/**
 * Contrato de tema JONA. Los valores de color son tripletes RGB en texto ("R G B",
 * sin comas) para poder combinarse con `<alpha-value>` en Tailwind.
 */
export interface JonaThemeTokens {
  // Primary palette
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
  // Accent
  accent50?: string;
  accent100?: string;
  accent200?: string;
  accent300?: string;
  accent400?: string;
  accent500?: string;
  accent600?: string;
  accent700?: string;
  accent800?: string;
  accent900?: string;
  // Danger
  danger400?: string;
  danger500?: string;
  danger600?: string;
  // Success
  success400?: string;
  success500?: string;
  success600?: string;
  // Warning
  warning400?: string;
  warning500?: string;
  warning600?: string;
  // Neutral
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
  // Shape
  radiusSm?: string;
  radius?: string;
  radiusMd?: string;
  radiusLg?: string;
  // Typography
  fontSans?: string;
  fontMono?: string;
}

/** Mapa token del contrato → variable CSS. */
export const JONA_TOKEN_MAP: Record<keyof JonaThemeTokens, string> = {
  primary50: '--jona-primary-50',
  primary100: '--jona-primary-100',
  primary200: '--jona-primary-200',
  primary300: '--jona-primary-300',
  primary400: '--jona-primary-400',
  primary500: '--jona-primary-500',
  primary600: '--jona-primary-600',
  primary700: '--jona-primary-700',
  primary800: '--jona-primary-800',
  primary900: '--jona-primary-900',
  accent50: '--jona-accent-50',
  accent100: '--jona-accent-100',
  accent200: '--jona-accent-200',
  accent300: '--jona-accent-300',
  accent400: '--jona-accent-400',
  accent500: '--jona-accent-500',
  accent600: '--jona-accent-600',
  accent700: '--jona-accent-700',
  accent800: '--jona-accent-800',
  accent900: '--jona-accent-900',
  danger400: '--jona-danger-400',
  danger500: '--jona-danger-500',
  danger600: '--jona-danger-600',
  success400: '--jona-success-400',
  success500: '--jona-success-500',
  success600: '--jona-success-600',
  warning400: '--jona-warning-400',
  warning500: '--jona-warning-500',
  warning600: '--jona-warning-600',
  neutral50: '--jona-neutral-50',
  neutral100: '--jona-neutral-100',
  neutral200: '--jona-neutral-200',
  neutral300: '--jona-neutral-300',
  neutral400: '--jona-neutral-400',
  neutral500: '--jona-neutral-500',
  neutral600: '--jona-neutral-600',
  neutral700: '--jona-neutral-700',
  neutral800: '--jona-neutral-800',
  neutral900: '--jona-neutral-900',
  radiusSm: '--jona-radius-sm',
  radius: '--jona-radius',
  radiusMd: '--jona-radius-md',
  radiusLg: '--jona-radius-lg',
  fontSans: '--jona-font-sans',
  fontMono: '--jona-font-mono',
};

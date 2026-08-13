// JTimerStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JTimerVariant, JTimerSize, JTimerTone } from './InterJTimer';

export const VARIANT_CLASSES: Record<JTimerVariant, string> = {
  plain: 'bg-transparent',
  card: 'rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5',
  inline: 'inline-flex items-center gap-3',
};

export const SIZE_CLASSES: Record<JTimerSize, { display: string; label: string; button: string }> = {
  sm: { display: 'text-xl', label: 'text-xs', button: 'h-8 px-3 text-xs' },
  md: { display: 'text-3xl', label: 'text-sm', button: 'h-9 px-3 text-sm' },
  lg: { display: 'text-5xl', label: 'text-base', button: 'h-10 px-4 text-sm' },
};

export const TONE_CLASSES: Record<JTimerTone, string> = {
  neutral: 'text-neutral-900',
  success: 'text-success-700',
  warning: 'text-warning-700',
  danger: 'text-danger-700',
  info: 'text-primary-700',
};

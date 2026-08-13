// JStatCardStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { StatCardTone, StatCardTrend } from './InterJStatCard';

export const TONE_CLASSES: Record<StatCardTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-primary-50 text-primary-700',
};

export const TREND_CLASSES: Record<StatCardTrend, string> = {
  up: 'text-success-700',
  down: 'text-danger-700',
  flat: 'text-neutral-500',
};

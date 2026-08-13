// JProgressStyles.ts — JONA View (presentacion)
// Valores de presentacion del componente: clases Tailwind, valores CSS y geometria.
// Detalle de implementacion: NO forma parte de la API publica de la libreria.
import type { JProgressSize, JProgressVariant } from './InterJProgress';

export const JPROGRESS_BAR_HEIGHT: Record<JProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

export const JPROGRESS_BAR_FILL: Record<JProgressVariant, string> = {
  default: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

export const JPROGRESS_CIRCLE_DIAMETER: Record<JProgressSize, number> = {
  sm: 48,
  md: 72,
  lg: 104,
};

export const JPROGRESS_CIRCLE_STROKE_WIDTH: Record<JProgressSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
};

export const JPROGRESS_CIRCLE_COLOR: Record<JProgressVariant, string> = {
  default: '#2563eb',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export const JPROGRESS_CIRCLE_FONT_SIZE: Record<JProgressSize, number> = {
  sm: 10,
  md: 13,
  lg: 18,
};

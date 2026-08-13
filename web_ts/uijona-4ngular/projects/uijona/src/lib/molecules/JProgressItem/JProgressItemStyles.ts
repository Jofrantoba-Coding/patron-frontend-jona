// JProgressItemStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JProgressItemSize, JProgressItemVariant } from './InterJProgressItem';

export const TEXT_SIZE: Record<JProgressItemSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const CARD_PADDING: Record<JProgressItemSize, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export const VALUE_COLOR: Record<JProgressItemVariant, string> = {
  default: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-500',
  danger: 'text-danger-500',
};

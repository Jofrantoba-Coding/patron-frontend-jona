// JAlertStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JAlertVariant } from './InterJAlert';

export const JALERT_VARIANT_CLASSES: Record<JAlertVariant, string> = {
  default: 'bg-neutral-50 border-neutral-200 text-neutral-900',
  info: 'bg-primary-50 border-primary-300 text-primary-800',
  success: 'bg-green-50 border-green-300 text-green-800',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  danger: 'bg-red-50 border-danger-500 text-danger-700',
};

export const JALERT_DISMISS_VARIANT_CLASSES: Record<JAlertVariant, string> = {
  default: 'text-neutral-400 hover:text-neutral-700',
  info: 'text-primary-400 hover:text-primary-700',
  success: 'text-green-400 hover:text-green-700',
  warning: 'text-yellow-500 hover:text-yellow-800',
  danger: 'text-danger-400 hover:text-danger-700',
};

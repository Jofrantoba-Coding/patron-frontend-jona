// JChipStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JChipVariant } from './InterJChip';

export const JCHIP_VARIANT_CLASSES: Record<JChipVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-green-50 text-success-600 border-green-200',
  warning: 'bg-yellow-50 text-warning-600 border-yellow-200',
  danger: 'bg-red-50 text-danger-600 border-red-200',
};

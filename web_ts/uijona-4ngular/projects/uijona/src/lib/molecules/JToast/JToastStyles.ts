// JToastStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JToastVariant } from './InterJToast';

export const VARIANT_CLASSES: Record<JToastVariant, string> = {
  default: 'bg-neutral-900 text-white',
  success: 'bg-success-600 text-white',
  warning: 'bg-warning-500 text-white',
  danger: 'bg-danger-500 text-white',
};

// JBadgeStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JBadgeVariant } from './InterJBadge';

export const JBADGE_VARIANT_CLASSES: Record<JBadgeVariant, string> = {
  default: 'bg-primary-600 text-white border-transparent',
  secondary: 'bg-neutral-200 text-neutral-700 border-transparent',
  destructive: 'bg-danger-500 text-white border-transparent',
  outline: 'bg-transparent text-neutral-700 border-neutral-300',
  ghost: 'bg-neutral-100 text-neutral-600 border-transparent',
};

// JSkeletonStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JSkeletonVariant } from './InterJSkeleton';

export const JSKELETON_VARIANT_CLASSES: Record<JSkeletonVariant, string> = {
  pulse: 'animate-pulse bg-neutral-200',
  wave: 'jskeleton-wave',
  none: 'bg-neutral-200',
};

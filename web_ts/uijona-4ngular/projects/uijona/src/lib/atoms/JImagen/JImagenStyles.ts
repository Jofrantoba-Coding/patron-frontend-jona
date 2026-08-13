// JImagenStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JImagenFit, JImagenRadius, JImagenAspectRatio } from './InterJImagen';

export const JIMAGEN_FIT_CLASSES: Record<JImagenFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

export const JIMAGEN_RADIUS_CLASSES: Record<JImagenRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const JIMAGEN_ASPECT_RATIO_CLASSES: Record<JImagenAspectRatio, string | undefined> = {
  auto: undefined,
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
};

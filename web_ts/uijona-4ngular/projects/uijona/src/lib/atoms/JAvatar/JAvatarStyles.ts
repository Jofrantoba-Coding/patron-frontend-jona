// JAvatarStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JAvatarSize, JAvatarShape } from './InterJAvatar';

export const JAVATAR_SIZE_CLASSES: Record<JAvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

export const JAVATAR_SHAPE_CLASSES: Record<JAvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};

// JUserAvatarStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JUserAvatarSize } from './InterJUserAvatar';

export const SIZE: Record<JUserAvatarSize, { avatar: string; name: string; email: string }> = {
  sm: { avatar: 'w-7 h-7 text-xs', name: 'text-sm', email: 'text-xs' },
  md: { avatar: 'w-10 h-10 text-sm', name: 'text-sm', email: 'text-xs' },
  lg: { avatar: 'w-14 h-14 text-base', name: 'text-base', email: 'text-sm' },
};

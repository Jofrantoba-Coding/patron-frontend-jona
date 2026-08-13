// JDrawerStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JDrawerSide, JDrawerSize } from './InterJDrawer';

export const SIDE_PANEL: Record<JDrawerSide, string> = {
  right: 'inset-y-0 right-0 h-full flex-col',
  left: 'inset-y-0 left-0 h-full flex-col',
  top: 'inset-x-0 top-0 w-full flex-col',
  bottom: 'inset-x-0 bottom-0 w-full flex-col',
};

export const SIDE_OPEN: Record<JDrawerSide, string> = {
  right: 'translate-x-0',
  left: 'translate-x-0',
  top: 'translate-y-0',
  bottom: 'translate-y-0',
};

export const SIDE_HIDDEN: Record<JDrawerSide, string> = {
  right: 'translate-x-full',
  left: '-translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
};

export const SIZE: Record<JDrawerSize, Record<JDrawerSide, string>> = {
  sm: { right: 'w-64', left: 'w-64', top: 'h-48', bottom: 'h-48' },
  md: { right: 'w-80', left: 'w-80', top: 'h-64', bottom: 'h-64' },
  lg: { right: 'w-[28rem]', left: 'w-[28rem]', top: 'h-80', bottom: 'h-80' },
  full: { right: 'w-full', left: 'w-full', top: 'h-full', bottom: 'h-full' },
};

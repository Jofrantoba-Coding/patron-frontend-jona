// JSpinnerStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JSpinnerSize, JSpinnerColor } from './InterJSpinner';

export const JSPINNER_SIZE_CLASSES: Record<JSpinnerSize, string> = {
  sm: 'w-3.5 h-3.5 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-[3px]',
  xl: 'w-10 h-10 border-4',
};

export const JSPINNER_COLOR_CLASSES: Record<JSpinnerColor, string> = {
  current: 'border-current border-t-transparent',
  primary: 'border-primary-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  neutral: 'border-neutral-400 border-t-transparent',
};

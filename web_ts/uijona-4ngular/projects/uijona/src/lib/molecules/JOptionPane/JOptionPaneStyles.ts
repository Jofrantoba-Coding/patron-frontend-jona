// JOptionPaneStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JButtonVariant } from '../../atoms/JButton';
import type { JOptionPaneVariant } from './InterJOptionPane';

export const ICON_BG: Record<JOptionPaneVariant, string> = {
  danger: 'bg-danger-50',
  warning: 'bg-yellow-50',
  info: 'bg-primary-50',
};

export const ICON_COLOR: Record<JOptionPaneVariant, string> = {
  danger: 'text-danger-500',
  warning: 'text-yellow-500',
  info: 'text-primary-500',
};

export const CONFIRM_VARIANT: Record<JOptionPaneVariant, JButtonVariant> = {
  danger: 'destructive',
  warning: 'default',
  info: 'default',
};

export const ICON_PATH: Record<JOptionPaneVariant, string> = {
  danger: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  warning: 'M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
};

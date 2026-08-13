// JLabelStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JLabelVariant, JLabelSize, JLabelColor } from './InterJLabel';

export const JLABEL_VARIANT_CLASSES: Record<JLabelVariant, string> = {
  body: 'text-neutral-900',
  heading: 'font-semibold text-neutral-900',
  label: 'text-sm font-medium text-neutral-700',
  link: 'text-primary-600 underline-offset-4 hover:underline cursor-pointer',
  'link-muted': 'text-neutral-500 underline-offset-4 hover:underline cursor-pointer',
  'link-button':
    'inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 cursor-pointer',
  'link-danger': 'text-danger-500 underline-offset-4 hover:underline cursor-pointer',
  error: 'text-xs text-danger-500',
  description: 'text-xs text-neutral-500',
};

export const JLABEL_SIZE_CLASSES: Record<JLabelSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const JLABEL_COLOR_CLASSES: Record<JLabelColor, string> = {
  default: '',
  muted: 'text-neutral-500',
  primary: 'text-primary-600',
  danger: 'text-danger-500',
  success: 'text-success-600',
  warning: 'text-warning-600',
};

// JButtonStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consume desde el Impl y NO forma parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JButtonIconPosition, JButtonSize, JButtonVariant } from './InterJButton';

/** Clases base comunes a todas las variantes. */
export const JBUTTON_BASE_CLASSES = [
  'jbutton',
  'inline-flex items-center justify-center gap-2',
  'font-medium transition-colors duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ');

export const JBUTTON_VARIANT_CLASSES: Record<JButtonVariant, string> = {
  default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  outline:
    'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  destructive: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500',
  secondary:
    'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400',
  link: 'bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500',
  accent: 'bg-accent-600 text-white hover:bg-accent-700 focus-visible:ring-accent-500',
};

export const JBUTTON_SIZE_CLASSES: Record<JButtonSize, string> = {
  xs: 'min-h-6 px-2 py-0.5 text-xs rounded',
  sm: 'min-h-7 px-3 py-1 text-xs rounded-md',
  md: 'min-h-9 px-4 py-2 text-sm rounded-md',
  default: 'min-h-9 px-4 py-2 text-sm rounded-md',
  lg: 'min-h-11 px-6 py-2 text-base rounded-md',
  xl: 'min-h-14 px-8 py-3 text-lg rounded-lg',
  icon: 'h-9 w-9 p-0 rounded-md',
};

/**
 * La direccion del flex tambien se aplica desde `uijona.css` via
 * `[data-jbutton-icon-position]`; aqui se duplica en utilidades para que el
 * componente funcione aunque el consumidor no cargue la hoja de la libreria.
 */
export const JBUTTON_ICON_POSITION_CLASSES: Record<JButtonIconPosition, string> = {
  left: 'flex-row',
  right: 'flex-row-reverse',
  top: 'flex-col',
  bottom: 'flex-col-reverse',
};

// JPanelStyles.ts — JONA View (presentacion)
// Valores de presentacion del componente: clases Tailwind, valores CSS y geometria.
// Detalle de implementacion: NO forma parte de la API publica de la libreria.
import type {
  JPanelAlign,
  JPanelDirection,
  JPanelGap,
  JPanelJustify,
  JPanelPadding,
  JPanelRadius,
  JPanelVariant,
  JPanelWrap,
} from './InterJPanel';

export const JPANEL_VARIANT_CLASSES: Record<JPanelVariant, string> = {
  default: 'bg-white border border-neutral-200',
  outlined: 'bg-transparent border border-neutral-300',
  elevated: 'bg-white shadow-md border-0',
  flat: 'bg-neutral-50 border-0',
  ghost: 'bg-transparent border-0',
};

export const JPANEL_PADDING_CLASSES: Record<JPanelPadding, string> = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

export const JPANEL_RADIUS_CLASSES: Record<JPanelRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const JPANEL_GAP_VALUES: Record<JPanelGap, string> = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

export const JPANEL_ALIGN_VALUES: Record<JPanelAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

export const JPANEL_JUSTIFY_VALUES: Record<JPanelJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export const JPANEL_DIRECTION_VALUES: Record<JPanelDirection, string> = {
  row: 'row',
  column: 'column',
};

export const JPANEL_WRAP_VALUES: Record<JPanelWrap, string> = {
  nowrap: 'nowrap',
  wrap: 'wrap',
  reverse: 'wrap-reverse',
};

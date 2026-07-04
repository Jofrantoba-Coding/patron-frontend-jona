export type JPanelVariant = 'default' | 'outlined' | 'elevated' | 'flat' | 'ghost';
export type JPanelPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type JPanelRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type JPanelLayout =
  | 'none'
  | 'flow'
  | 'box'
  | 'grid'
  | 'border'
  | 'card'
  | 'gridbag'
  | 'group'
  | 'spring';
export type JPanelDirection = 'row' | 'column';
export type JPanelWrap = 'nowrap' | 'wrap' | 'reverse';
export type JPanelGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type JPanelAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JPanelJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type JPanelLayoutPlacement = 'responsive' | 'fixed';
export type JPanelGroupMode = 'sequential' | 'parallel';

/** Configuracion responsive por breakpoint. */
export interface JPanelResponsiveConfig {
  layout?: JPanelLayout;
  direction?: JPanelDirection;
  gap?: JPanelGap;
  alignItems?: JPanelAlign;
  justifyContent?: JPanelJustify;
  wrap?: boolean | JPanelWrap;
  columns?: number | string;
  rows?: number | string;
  autoFitMin?: string;
  placement?: JPanelLayoutPlacement;
  dense?: boolean;
  mode?: JPanelGroupMode;
  minHeight?: string;
}

/** Contrato publico de JPanel. */
export interface InterJPanel {
  variant?: JPanelVariant;
  padding?: JPanelPadding;
  radius?: JPanelRadius;
  layout?: JPanelLayout;
  direction?: JPanelDirection;
  gap?: JPanelGap;
  alignItems?: JPanelAlign;
  justifyContent?: JPanelJustify;
  wrap?: boolean | JPanelWrap;
  columns?: number | string;
  rows?: number | string;
  autoFitMin?: string;
  placement?: JPanelLayoutPlacement;
  dense?: boolean;
  mode?: JPanelGroupMode;
  minHeight?: string;
  mobileSmall?: JPanelResponsiveConfig;
  mobileLarge?: JPanelResponsiveConfig;
  tablet?: JPanelResponsiveConfig;
  desktop?: JPanelResponsiveConfig;
  tv?: JPanelResponsiveConfig;
}

export const JPANEL_DEFAULTS = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  layout: 'box',
  direction: 'column',
  gap: 'none',
  alignItems: 'stretch',
  justifyContent: 'start',
} as const satisfies Required<
  Pick<
    InterJPanel,
    'variant' | 'padding' | 'radius' | 'layout' | 'direction' | 'gap' | 'alignItems' | 'justifyContent'
  >
>;

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

export const JPANEL_RESPONSIVE_LAYOUTS = new Set<JPanelLayout>([
  'grid',
  'gridbag',
  'group',
  'spring',
]);

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

export const JPANEL_RESPONSIVE_LAYOUTS = new Set<JPanelLayout>([
  'grid',
  'gridbag',
  'group',
  'spring',
]);

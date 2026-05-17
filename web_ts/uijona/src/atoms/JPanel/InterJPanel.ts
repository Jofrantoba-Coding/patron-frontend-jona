import React from 'react';

export type JPanelVariant = 'default' | 'outlined' | 'elevated' | 'flat' | 'ghost';
export type JPanelPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type JPanelRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type JPanelLayout = 'none' | 'flow' | 'box' | 'grid' | 'border' | 'card' | 'gridbag' | 'group' | 'spring';
export type JPanelDirection = 'row' | 'column';
export type JPanelWrap = 'nowrap' | 'wrap' | 'reverse';
export type JPanelGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type JPanelAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JPanelJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type JPanelArea = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type JPanelLayoutPlacement = 'responsive' | 'fixed';
export type JPanelGroupMode = 'sequential' | 'parallel';
export type JPanelBreakpoint = 'mobileSmall' | 'mobileLarge' | 'tablet' | 'desktop' | 'tv';

export interface JPanelLayoutDefaultDoc {
  behavior: string;
  defaults: Record<string, string>;
  required: string[];
}

export const JPANEL_BREAKPOINTS: Record<JPanelBreakpoint, string> = {
  mobileSmall: '0px',
  mobileLarge: '480px',
  tablet: '640px',
  desktop: '1024px',
  tv: '1920px',
};

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

export interface InterJPanel {
  variant?: JPanelVariant;
  padding?: JPanelPadding;
  radius?: JPanelRadius;
  as?: React.ElementType;
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
  activeCard?: string | number;
  mobileSmall?: JPanelResponsiveConfig;
  mobileLarge?: JPanelResponsiveConfig;
  tablet?: JPanelResponsiveConfig;
  desktop?: JPanelResponsiveConfig;
  tv?: JPanelResponsiveConfig;
  area?: JPanelArea;
  card?: string | number;
  gridBagColumn?: number | string;
  gridBagRow?: number | string;
  gridBagColumnSpan?: number | string;
  gridBagRowSpan?: number | string;
  gridBagAlign?: string;
  gridBagJustify?: string;
  groupSpan?: number | string;
  groupAlign?: string;
  groupJustify?: string;
  springLeft?: number | string;
  springRight?: number | string;
  springTop?: number | string;
  springBottom?: number | string;
  springWidth?: number | string;
  springHeight?: number | string;
  'data-panel-area'?: JPanelArea;
  'data-panel-card'?: string | number;
  'data-gridbag-column'?: number | string;
  'data-gridbag-col'?: number | string;
  'data-gridbag-row'?: number | string;
  'data-gridbag-column-span'?: number | string;
  'data-gridbag-colspan'?: number | string;
  'data-gridbag-row-span'?: number | string;
  'data-gridbag-rowspan'?: number | string;
  'data-gridbag-align'?: string;
  'data-gridbag-justify'?: string;
  'data-group-span'?: number | string;
  'data-group-align'?: string;
  'data-group-justify'?: string;
  'data-spring-left'?: number | string;
  'data-spring-right'?: number | string;
  'data-spring-top'?: number | string;
  'data-spring-bottom'?: number | string;
  'data-spring-width'?: number | string;
  'data-spring-height'?: number | string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const JPANEL_DEFAULTS: Required<Pick<
  InterJPanel,
  'variant' | 'padding' | 'radius' | 'layout' | 'direction' | 'gap' | 'alignItems' | 'justifyContent'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  layout: 'box',
  direction: 'column',
  gap: 'none',
  alignItems: 'stretch',
  justifyContent: 'start',
};

export const JPANEL_LAYOUT_DEFAULTS: Record<JPanelLayout, JPanelLayoutDefaultDoc> = {
  none: {
    behavior: 'Renderiza un contenedor sin reglas de distribucion internas.',
    defaults: {
      layout: 'none',
      variant: JPANEL_DEFAULTS.variant,
      padding: JPANEL_DEFAULTS.padding,
      radius: JPANEL_DEFAULTS.radius,
    },
    required: [],
  },
  flow: {
    behavior: 'Distribuye hijos en una fila flexible con wrap natural, util para acciones, chips o toolbars.',
    defaults: {
      display: 'flex',
      direction: 'row',
      wrap: 'wrap',
      gap: JPANEL_DEFAULTS.gap,
      alignItems: JPANEL_DEFAULTS.alignItems,
      justifyContent: JPANEL_DEFAULTS.justifyContent,
      mobileSmall: 'base',
      mobileLarge: '>= 480px',
      tablet: '>= 640px',
      desktop: '>= 1024px',
      tv: '>= 1920px',
    },
    required: [],
  },
  box: {
    behavior: 'Distribuye hijos como stack o fila flexible. Es el layout por defecto de JPanel.',
    defaults: {
      display: 'flex',
      direction: JPANEL_DEFAULTS.direction,
      wrap: 'nowrap cuando direction=column, wrap cuando direction=row',
      gap: JPANEL_DEFAULTS.gap,
      alignItems: JPANEL_DEFAULTS.alignItems,
      justifyContent: JPANEL_DEFAULTS.justifyContent,
      mobileSmall: 'base',
      mobileLarge: '>= 480px',
      tablet: '>= 640px',
      desktop: '>= 1024px',
      tv: '>= 1920px',
    },
    required: [],
  },
  grid: {
    behavior: 'Distribuye hijos en una grilla mobile-first con auto-fit si no se definen columnas.',
    defaults: {
      display: 'grid',
      placement: 'responsive',
      autoFitMin: '12rem',
      gap: JPANEL_DEFAULTS.gap,
      alignItems: JPANEL_DEFAULTS.alignItems,
      justifyContent: JPANEL_DEFAULTS.justifyContent,
      mobileSmall: 'auto-fit base',
      mobileLarge: 'override opcional >= 480px',
      tablet: 'override opcional >= 640px',
      desktop: 'override opcional >= 1024px',
      tv: 'override opcional >= 1920px',
    },
    required: [],
  },
  border: {
    behavior: 'Distribuye zonas top, left, center, right y bottom como un border layout.',
    defaults: {
      display: 'grid',
      columns: 'auto minmax(0, 1fr) auto',
      rows: 'auto minmax(0, 1fr) auto',
      gap: JPANEL_DEFAULTS.gap,
    },
    required: ['Cada hijo que participa debe definir area o data-panel-area.'],
  },
  card: {
    behavior: 'Muestra una sola tarjeta hija. Sin activeCard muestra la primera tarjeta.',
    defaults: {
      display: 'block',
      activeCard: 'primer hijo valido',
      gap: JPANEL_DEFAULTS.gap,
    },
    required: ['Si se define activeCard, algun hijo debe definir card, data-panel-card o key con ese valor.'],
  },
  gridbag: {
    behavior: 'Distribuye como grilla responsive y permite constraints por hijo para posicion exacta en breakpoints mayores.',
    defaults: {
      display: 'grid',
      placement: 'responsive',
      autoFitMin: '12rem',
      dense: 'true',
      gap: JPANEL_DEFAULTS.gap,
    },
    required: [],
  },
  group: {
    behavior: 'Distribuye grupos en grilla responsive y permite spans por hijo.',
    defaults: {
      display: 'grid',
      placement: 'responsive',
      autoFitMin: '12rem',
      mode: 'sequential',
      gap: JPANEL_DEFAULTS.gap,
    },
    required: [],
  },
  spring: {
    behavior: 'Distribuye como grilla en mobile y aplica posicionamiento por constraints en tablet/desktop o placement fixed.',
    defaults: {
      display: 'grid mobile, absolute constraints en breakpoints mayores',
      placement: 'responsive',
      autoFitMin: '12rem',
      minHeight: '16rem',
      gap: JPANEL_DEFAULTS.gap,
    },
    required: ['Cada hijo posicionado debe definir al menos una constraint spring o data-spring-* para ubicarse.'],
  },
};

// InterLayoutBase.ts — JONA Contrato (compartido)
// Contrato publico comun a los layouts que envuelven JPanel con un `layout` fijo
// (JBoxLayout, JCardLayout, JFlowLayout, JGridLayout, JGridBagLayout,
// JGroupLayout, JSpringLayout). Cada layout no redefine el contrato: lo hereda.
import type { JStyle } from '../core/types';
import type {
  JPanelAlign,
  JPanelDirection,
  JPanelGap,
  JPanelGroupMode,
  JPanelJustify,
  JPanelLayoutPlacement,
  JPanelPadding,
  JPanelRadius,
  JPanelResponsiveConfig,
  JPanelVariant,
  JPanelWrap,
} from '../atoms/JPanel';

/** Contrato publico compartido por los layouts basados en JPanel. */
export interface InterLayoutBase {
  // Presentacion del contenedor
  variant?: JPanelVariant;
  padding?: JPanelPadding;
  radius?: JPanelRadius;

  // Distribucion
  gap?: JPanelGap;
  direction?: JPanelDirection;
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

  // Puntos de ruptura
  mobileSmall?: JPanelResponsiveConfig;
  mobileLarge?: JPanelResponsiveConfig;
  tablet?: JPanelResponsiveConfig;
  desktop?: JPanelResponsiveConfig;
  tv?: JPanelResponsiveConfig;

  // Estandar
  className?: string;
  style?: JStyle;
}

export const LAYOUT_BASE_DEFAULTS = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  alignItems: 'stretch',
  justifyContent: 'start',
} as const satisfies Required<
  Pick<InterLayoutBase, 'variant' | 'padding' | 'radius' | 'alignItems' | 'justifyContent'>
>;

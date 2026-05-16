import type {
  InterJPanel,
  JPanelAlign,
  JPanelArea,
  JPanelDirection,
  JPanelGap,
  JPanelGroupMode,
  JPanelJustify,
  JPanelLayout,
  JPanelLayoutPlacement,
  JPanelPadding,
  JPanelRadius,
  JPanelResponsiveConfig,
  JPanelVariant,
  JPanelWrap,
} from '../JPanel/InterJPanel';

export type InterPanelAtom = InterJPanel;
export type PanelVariant = JPanelVariant;
export type PanelPadding = JPanelPadding;
export type PanelRadius = JPanelRadius;
export type PanelLayout = JPanelLayout;
export type PanelDirection = JPanelDirection;
export type PanelWrap = JPanelWrap;
export type PanelGap = JPanelGap;
export type PanelAlign = JPanelAlign;
export type PanelJustify = JPanelJustify;
export type PanelArea = JPanelArea;
export type PanelLayoutPlacement = JPanelLayoutPlacement;
export type PanelGroupMode = JPanelGroupMode;
export type PanelResponsiveConfig = JPanelResponsiveConfig;

export const PANEL_ATOM_DEFAULTS: Required<Pick<InterPanelAtom, 'variant' | 'padding' | 'radius' | 'layout' | 'direction' | 'gap' | 'alignItems' | 'justifyContent'>> = {
  variant: 'default',
  padding: 'md',
  radius:  'md',
  layout: 'none',
  direction: 'row',
  gap: 'md',
  alignItems: 'stretch',
  justifyContent: 'start',
};

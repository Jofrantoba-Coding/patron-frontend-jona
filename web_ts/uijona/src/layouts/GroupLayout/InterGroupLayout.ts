import React from 'react';
import type {
  JPanelAlign,
  JPanelGap,
  JPanelJustify,
  JPanelLayoutPlacement,
  JPanelPadding,
  JPanelRadius,
  JPanelVariant,
} from '../../atoms/JPanel/JPanel';

export type GroupLayoutMode = 'sequential' | 'parallel';

export interface InterGroupLayout extends React.HTMLAttributes<HTMLDivElement> {
  variant?: JPanelVariant;
  padding?: JPanelPadding;
  radius?: JPanelRadius;
  gap?: JPanelGap;
  alignItems?: JPanelAlign;
  justifyContent?: JPanelJustify;
  columns?: number | string;
  autoFitMin?: string;
  mode?: GroupLayoutMode;
  placement?: JPanelLayoutPlacement;
}

export const GROUP_LAYOUT_DEFAULTS: Required<Pick<
  InterGroupLayout,
  'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'mode' | 'placement'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  gap: 'md',
  alignItems: 'stretch',
  justifyContent: 'start',
  autoFitMin: '12rem',
  mode: 'sequential',
  placement: 'responsive',
};

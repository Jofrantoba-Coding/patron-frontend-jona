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

export type JGroupLayoutMode = 'sequential' | 'parallel';

export interface InterJGroupLayout extends React.HTMLAttributes<HTMLDivElement> {
  variant?: JPanelVariant;
  padding?: JPanelPadding;
  radius?: JPanelRadius;
  gap?: JPanelGap;
  alignItems?: JPanelAlign;
  justifyContent?: JPanelJustify;
  columns?: number | string;
  autoFitMin?: string;
  mode?: JGroupLayoutMode;
  placement?: JPanelLayoutPlacement;
}

export const JGROUP_LAYOUT_DEFAULTS: Required<Pick<
  InterJGroupLayout,
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

import React from 'react';
import type {
  PanelGap,
  PanelLayoutPlacement,
  PanelPadding,
  PanelRadius,
  PanelVariant,
} from '../../atoms/PanelAtom/PanelAtom';

export interface InterSpringLayout extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  padding?: PanelPadding;
  radius?: PanelRadius;
  gap?: PanelGap;
  autoFitMin?: string;
  minHeight?: string;
  placement?: PanelLayoutPlacement;
}

export const SPRING_LAYOUT_DEFAULTS: Required<Pick<
  InterSpringLayout,
  'variant' | 'padding' | 'radius' | 'gap' | 'autoFitMin' | 'minHeight' | 'placement'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  gap: 'md',
  autoFitMin: '12rem',
  minHeight: '16rem',
  placement: 'responsive',
};

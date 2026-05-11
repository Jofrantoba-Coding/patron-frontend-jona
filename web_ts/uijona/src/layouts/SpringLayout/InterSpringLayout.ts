import React from 'react';
import type {
  PanelGap,
  PanelPadding,
  PanelRadius,
  PanelVariant,
} from '../../atoms/PanelAtom/PanelAtom';
import type { LayoutPlacement } from '../layoutPrimitives';

export interface InterSpringLayout extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  padding?: PanelPadding;
  radius?: PanelRadius;
  gap?: PanelGap;
  autoFitMin?: string;
  minHeight?: string;
  placement?: LayoutPlacement;
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

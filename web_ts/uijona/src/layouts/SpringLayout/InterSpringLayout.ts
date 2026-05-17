import React from 'react';
import type {
  JPanelGap,
  JPanelLayoutPlacement,
  JPanelPadding,
  JPanelRadius,
  JPanelVariant,
} from '../../atoms/JPanel/JPanel';

export interface InterSpringLayout extends React.HTMLAttributes<HTMLDivElement> {
  variant?: JPanelVariant;
  padding?: JPanelPadding;
  radius?: JPanelRadius;
  gap?: JPanelGap;
  autoFitMin?: string;
  minHeight?: string;
  placement?: JPanelLayoutPlacement;
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

import type { InterJPanel } from '../../atoms/JPanel/JPanel';

export interface InterGridLayout extends Omit<
  InterJPanel,
  'layout' | 'direction' | 'wrap' | 'activeCard'
> {}

export const GRID_LAYOUT_DEFAULTS: Required<Pick<
  InterGridLayout,
  'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'placement'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  gap: 'md',
  alignItems: 'stretch',
  justifyContent: 'start',
  autoFitMin: '12rem',
  placement: 'responsive',
};

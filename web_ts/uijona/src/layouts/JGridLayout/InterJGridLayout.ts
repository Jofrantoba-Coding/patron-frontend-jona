import type { InterJPanel } from '../../atoms/JPanel/JPanel';

export interface InterJGridLayout extends Omit<
  InterJPanel,
  'layout' | 'direction' | 'wrap' | 'activeCard'
> {}

export const JGRID_LAYOUT_DEFAULTS: Required<Pick<
  InterJGridLayout,
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

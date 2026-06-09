import type { InterJPanel } from '../../atoms/JPanel/JPanel';

export interface InterJFlowLayout extends Omit<
  InterJPanel,
  'layout' | 'direction' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'
> {}

export const JFLOW_LAYOUT_DEFAULTS: Required<Pick<
  InterJFlowLayout,
  'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  gap: 'md',
  alignItems: 'stretch',
  justifyContent: 'start',
  wrap: 'wrap',
};

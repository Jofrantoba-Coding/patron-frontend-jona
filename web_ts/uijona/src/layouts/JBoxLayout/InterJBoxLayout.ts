import type { InterJPanel } from '../../atoms/JPanel/JPanel';

export interface InterJBoxLayout extends Omit<
  InterJPanel,
  'layout' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'
> {}

export const JBOX_LAYOUT_DEFAULTS: Required<Pick<
  InterJBoxLayout,
  'variant' | 'padding' | 'radius' | 'direction' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  direction: 'column',
  gap: 'md',
  alignItems: 'stretch',
  justifyContent: 'start',
  wrap: 'nowrap',
};

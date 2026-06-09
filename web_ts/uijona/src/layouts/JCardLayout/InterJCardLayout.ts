import type { InterJPanel } from '../../atoms/JPanel/JPanel';

export interface InterJCardLayout extends Omit<
  InterJPanel,
  'layout' | 'direction' | 'wrap' | 'columns' | 'rows' | 'autoFitMin'
> {}

export const JCARD_LAYOUT_DEFAULTS: Required<Pick<
  InterJCardLayout,
  'variant' | 'padding' | 'radius' | 'gap'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  gap: 'none',
};

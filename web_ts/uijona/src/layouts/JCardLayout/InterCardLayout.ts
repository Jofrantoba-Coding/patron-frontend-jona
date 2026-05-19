import type { InterJPanel } from '../../atoms/JPanel/JPanel';

export interface InterCardLayout extends Omit<
  InterJPanel,
  'layout' | 'direction' | 'wrap' | 'columns' | 'rows' | 'autoFitMin'
> {}

export const CARD_LAYOUT_DEFAULTS: Required<Pick<
  InterCardLayout,
  'variant' | 'padding' | 'radius' | 'gap'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  gap: 'none',
};

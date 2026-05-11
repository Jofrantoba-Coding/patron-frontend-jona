import type { InterPanelAtom } from '../../atoms/PanelAtom/PanelAtom';

export interface InterCardLayout extends Omit<
  InterPanelAtom,
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

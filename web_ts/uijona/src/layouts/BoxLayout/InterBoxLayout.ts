import type { InterPanelAtom } from '../../atoms/PanelAtom/PanelAtom';

export interface InterBoxLayout extends Omit<
  InterPanelAtom,
  'layout' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'
> {}

export const BOX_LAYOUT_DEFAULTS: Required<Pick<
  InterBoxLayout,
  'variant' | 'padding' | 'radius' | 'direction' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'
>> = {
  variant: 'ghost',
  padding: 'none',
  radius: 'none',
  direction: 'row',
  gap: 'md',
  alignItems: 'stretch',
  justifyContent: 'start',
  wrap: 'nowrap',
};

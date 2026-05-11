import type { InterPanelAtom } from '../../atoms/PanelAtom/PanelAtom';

export interface InterFlowLayout extends Omit<
  InterPanelAtom,
  'layout' | 'direction' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'
> {}

export const FLOW_LAYOUT_DEFAULTS: Required<Pick<
  InterFlowLayout,
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

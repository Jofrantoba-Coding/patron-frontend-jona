import type { InterPanelAtom } from '../../atoms/PanelAtom/PanelAtom';
export interface InterCardLayout extends Omit<InterPanelAtom, 'layout' | 'direction' | 'wrap' | 'columns' | 'rows' | 'autoFitMin'> {
}
export declare const CARD_LAYOUT_DEFAULTS: Required<Pick<InterCardLayout, 'variant' | 'padding' | 'radius' | 'gap'>>;

import { InterPanelAtom } from '../../atoms/PanelAtom/PanelAtom';

export interface InterBoxLayout extends Omit<InterPanelAtom, 'layout' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'> {
}
export declare const BOX_LAYOUT_DEFAULTS: Required<Pick<InterBoxLayout, 'variant' | 'padding' | 'radius' | 'direction' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'>>;

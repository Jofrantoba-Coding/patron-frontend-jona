import { InterPanelAtom } from '../../atoms/PanelAtom/PanelAtom';
export interface InterFlowLayout extends Omit<InterPanelAtom, 'layout' | 'direction' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'> {
}
export declare const FLOW_LAYOUT_DEFAULTS: Required<Pick<InterFlowLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'>>;

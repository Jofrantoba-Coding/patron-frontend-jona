import { InterPanelAtom } from '../../atoms/PanelAtom/PanelAtom';
export interface InterGridLayout extends Omit<InterPanelAtom, 'layout' | 'direction' | 'wrap' | 'activeCard'> {
}
export declare const GRID_LAYOUT_DEFAULTS: Required<Pick<InterGridLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin'>>;

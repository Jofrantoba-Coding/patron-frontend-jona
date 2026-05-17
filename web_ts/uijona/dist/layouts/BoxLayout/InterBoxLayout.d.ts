import type { InterJPanel } from '../../atoms/JPanel/JPanel';
export interface InterBoxLayout extends Omit<InterJPanel, 'layout' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'> {
}
export declare const BOX_LAYOUT_DEFAULTS: Required<Pick<InterBoxLayout, 'variant' | 'padding' | 'radius' | 'direction' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'>>;

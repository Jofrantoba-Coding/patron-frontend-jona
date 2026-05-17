import type { InterJPanel } from '../../atoms/JPanel/JPanel';
export interface InterFlowLayout extends Omit<InterJPanel, 'layout' | 'direction' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'> {
}
export declare const FLOW_LAYOUT_DEFAULTS: Required<Pick<InterFlowLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'>>;

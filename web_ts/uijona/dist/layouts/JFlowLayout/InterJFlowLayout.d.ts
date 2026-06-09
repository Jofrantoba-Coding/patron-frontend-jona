import type { InterJPanel } from '../../atoms/JPanel/JPanel';
export interface InterJFlowLayout extends Omit<InterJPanel, 'layout' | 'direction' | 'columns' | 'rows' | 'autoFitMin' | 'activeCard'> {
}
export declare const JFLOW_LAYOUT_DEFAULTS: Required<Pick<InterJFlowLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'wrap'>>;

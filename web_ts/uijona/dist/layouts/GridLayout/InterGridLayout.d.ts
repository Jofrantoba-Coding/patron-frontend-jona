import type { InterJPanel } from '../../atoms/JPanel/JPanel';
export interface InterGridLayout extends Omit<InterJPanel, 'layout' | 'direction' | 'wrap' | 'activeCard'> {
}
export declare const GRID_LAYOUT_DEFAULTS: Required<Pick<InterGridLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'placement'>>;

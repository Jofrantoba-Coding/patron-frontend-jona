import type { InterJPanel } from '../../atoms/JPanel/JPanel';
export interface InterJGridLayout extends Omit<InterJPanel, 'layout' | 'direction' | 'wrap' | 'activeCard'> {
}
export declare const JGRID_LAYOUT_DEFAULTS: Required<Pick<InterJGridLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'placement'>>;

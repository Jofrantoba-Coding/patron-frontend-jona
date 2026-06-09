import React from 'react';
import type { JPanelGap, JPanelLayoutPlacement, JPanelPadding, JPanelRadius, JPanelVariant } from '../../atoms/JPanel/JPanel';
export interface InterJSpringLayout extends React.HTMLAttributes<HTMLDivElement> {
    variant?: JPanelVariant;
    padding?: JPanelPadding;
    radius?: JPanelRadius;
    gap?: JPanelGap;
    autoFitMin?: string;
    minHeight?: string;
    placement?: JPanelLayoutPlacement;
}
export declare const JSPRING_LAYOUT_DEFAULTS: Required<Pick<InterJSpringLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'autoFitMin' | 'minHeight' | 'placement'>>;

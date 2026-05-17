import React from 'react';
import type { JPanelAlign, JPanelGap, JPanelJustify, JPanelLayoutPlacement, JPanelPadding, JPanelRadius, JPanelVariant } from '../../atoms/JPanel/JPanel';
export interface InterGridBagLayout extends React.HTMLAttributes<HTMLDivElement> {
    variant?: JPanelVariant;
    padding?: JPanelPadding;
    radius?: JPanelRadius;
    gap?: JPanelGap;
    alignItems?: JPanelAlign;
    justifyContent?: JPanelJustify;
    columns?: number | string;
    rows?: number | string;
    autoFitMin?: string;
    dense?: boolean;
    placement?: JPanelLayoutPlacement;
}
export declare const GRID_BAG_LAYOUT_DEFAULTS: Required<Pick<InterGridBagLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'dense' | 'placement'>>;

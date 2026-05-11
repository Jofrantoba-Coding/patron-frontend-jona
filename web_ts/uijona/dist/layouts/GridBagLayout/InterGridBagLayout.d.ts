import React from 'react';
import { PanelAlign, PanelGap, PanelJustify, PanelLayoutPlacement, PanelPadding, PanelRadius, PanelVariant } from '../../atoms/PanelAtom/PanelAtom';
export interface InterGridBagLayout extends React.HTMLAttributes<HTMLDivElement> {
    variant?: PanelVariant;
    padding?: PanelPadding;
    radius?: PanelRadius;
    gap?: PanelGap;
    alignItems?: PanelAlign;
    justifyContent?: PanelJustify;
    columns?: number | string;
    rows?: number | string;
    autoFitMin?: string;
    dense?: boolean;
    placement?: PanelLayoutPlacement;
}
export declare const GRID_BAG_LAYOUT_DEFAULTS: Required<Pick<InterGridBagLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'dense' | 'placement'>>;

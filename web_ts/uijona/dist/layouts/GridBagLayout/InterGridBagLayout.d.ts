import React from 'react';
import { PanelAlign, PanelGap, PanelJustify, PanelPadding, PanelRadius, PanelVariant } from '../../atoms/PanelAtom/PanelAtom';
import { LayoutPlacement } from '../layoutPrimitives';
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
    placement?: LayoutPlacement;
}
export declare const GRID_BAG_LAYOUT_DEFAULTS: Required<Pick<InterGridBagLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'dense' | 'placement'>>;

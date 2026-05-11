import React from 'react';
import { PanelAlign, PanelGap, PanelJustify, PanelLayoutPlacement, PanelPadding, PanelRadius, PanelVariant } from '../../atoms/PanelAtom/PanelAtom';
export type GroupLayoutMode = 'sequential' | 'parallel';
export interface InterGroupLayout extends React.HTMLAttributes<HTMLDivElement> {
    variant?: PanelVariant;
    padding?: PanelPadding;
    radius?: PanelRadius;
    gap?: PanelGap;
    alignItems?: PanelAlign;
    justifyContent?: PanelJustify;
    columns?: number | string;
    autoFitMin?: string;
    mode?: GroupLayoutMode;
    placement?: PanelLayoutPlacement;
}
export declare const GROUP_LAYOUT_DEFAULTS: Required<Pick<InterGroupLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'mode' | 'placement'>>;

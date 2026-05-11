import React from 'react';
import { PanelAlign, PanelGap, PanelJustify, PanelPadding, PanelRadius, PanelVariant } from '../../atoms/PanelAtom/PanelAtom';
import { LayoutPlacement } from '../layoutPrimitives';
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
    placement?: LayoutPlacement;
}
export declare const GROUP_LAYOUT_DEFAULTS: Required<Pick<InterGroupLayout, 'variant' | 'padding' | 'radius' | 'gap' | 'alignItems' | 'justifyContent' | 'autoFitMin' | 'mode' | 'placement'>>;

import React from 'react';
export type PanelVariant = 'default' | 'outlined' | 'elevated' | 'flat' | 'ghost';
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type PanelRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export interface InterPanelAtom extends React.HTMLAttributes<HTMLDivElement> {
    variant?: PanelVariant;
    padding?: PanelPadding;
    radius?: PanelRadius;
    /** Renders as a different HTML element while keeping all div semantics. */
    as?: React.ElementType;
}
export declare const PANEL_ATOM_DEFAULTS: Required<Pick<InterPanelAtom, 'variant' | 'padding' | 'radius'>>;

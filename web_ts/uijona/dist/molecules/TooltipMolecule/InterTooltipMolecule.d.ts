import React from 'react';
export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
export interface InterTooltipMolecule {
    content: React.ReactNode;
    side?: TooltipSide;
    delayMs?: number;
    className?: string;
    children: React.ReactElement;
    onShow?: () => void;
    onHide?: () => void;
}
export declare const TOOLTIP_MOLECULE_DEFAULTS: Required<Pick<InterTooltipMolecule, 'side' | 'delayMs'>>;

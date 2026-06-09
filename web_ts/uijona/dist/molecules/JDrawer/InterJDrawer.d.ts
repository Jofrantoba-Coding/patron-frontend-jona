import React from 'react';
export type JDrawerSide = 'left' | 'right' | 'top' | 'bottom';
export interface InterJDrawer {
    open: boolean;
    side?: JDrawerSide;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    showCloseButton?: boolean;
    className?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
}
export declare const JDRAWER_DEFAULTS: Required<Pick<InterJDrawer, 'side' | 'size' | 'showCloseButton'>>;

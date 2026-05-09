import React from 'react';
export interface InterBorderLayout {
    north?: React.ReactNode;
    south?: React.ReactNode;
    east?: React.ReactNode;
    west?: React.ReactNode;
    center?: React.ReactNode;
    className?: string;
    northClassName?: string;
    southClassName?: string;
    eastClassName?: string;
    westClassName?: string;
    centerClassName?: string;
}
export declare const BORDER_LAYOUT_DEFAULTS: Required<Pick<InterBorderLayout, 'northClassName' | 'southClassName' | 'eastClassName' | 'westClassName' | 'centerClassName'>>;

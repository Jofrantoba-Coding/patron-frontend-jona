import React from 'react';
export interface InterJBorderLayout {
    north?: React.ReactNode;
    south?: React.ReactNode;
    east?: React.ReactNode;
    west?: React.ReactNode;
    center?: React.ReactNode;
    northClassName?: string;
    southClassName?: string;
    eastClassName?: string;
    westClassName?: string;
    centerClassName?: string;
    className?: string;
    style?: React.CSSProperties;
}
export declare const JBORDER_LAYOUT_DEFAULTS: {
    readonly northClassName: "px-4 py-3";
    readonly southClassName: "px-4 py-3 text-xs";
    readonly westClassName: "border-b border-neutral-200 p-4 sm:border-b-0 sm:border-r";
    readonly eastClassName: "border-t border-neutral-200 p-4 sm:border-t-0 sm:border-l";
    readonly centerClassName: "p-4 sm:p-6";
};

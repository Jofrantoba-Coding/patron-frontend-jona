import React from 'react';
export type JSpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type JSpinnerColor = 'current' | 'primary' | 'white' | 'neutral';
export interface InterJSpinner {
    size?: JSpinnerSize;
    color?: JSpinnerColor;
    label?: string;
    className?: string;
    style?: React.CSSProperties;
}
export declare const JSPINNER_DEFAULTS: {
    readonly size: "md";
    readonly color: "current";
    readonly label: "Loading";
};

import React from 'react';
export type JProgressVariant = 'default' | 'success' | 'warning' | 'danger';
export type JProgressType = 'bar' | 'circle';
export type JProgressSize = 'sm' | 'md' | 'lg';
export interface InterJProgress {
    value?: number;
    max?: number;
    variant?: JProgressVariant;
    type?: JProgressType;
    size?: JProgressSize;
    showLabel?: boolean;
    label?: string;
    animated?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare const JPROGRESS_DEFAULTS: {
    readonly value: 0;
    readonly max: 100;
    readonly variant: "default";
    readonly type: "bar";
    readonly size: "md";
    readonly showLabel: false;
    readonly animated: false;
};

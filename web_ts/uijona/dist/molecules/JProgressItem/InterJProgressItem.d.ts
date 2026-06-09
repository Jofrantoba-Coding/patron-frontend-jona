import React from 'react';
export type JProgressItemVariant = 'default' | 'success' | 'warning' | 'danger';
export type JProgressItemSize = 'sm' | 'md' | 'lg';
export interface InterJProgressItem {
    label: string;
    value: number;
    max?: number;
    variant?: JProgressItemVariant;
    size?: JProgressItemSize;
    showValue?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare const JPROGRESS_ITEM_DEFAULTS: {
    readonly max: 100;
    readonly variant: "default";
    readonly size: "md";
    readonly showValue: true;
};

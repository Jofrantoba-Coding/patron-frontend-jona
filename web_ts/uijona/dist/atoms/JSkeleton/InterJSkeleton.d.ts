import React from 'react';
export type JSkeletonVariant = 'pulse' | 'wave' | 'none';
export interface InterJSkeleton {
    circle?: boolean;
    variant?: JSkeletonVariant;
    className?: string;
    style?: React.CSSProperties;
}
export declare const JSKELETON_DEFAULTS: {
    readonly circle: false;
    readonly variant: "pulse";
};

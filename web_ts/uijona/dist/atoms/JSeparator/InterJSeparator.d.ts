import React from 'react';
export type JSeparatorOrientation = 'horizontal' | 'vertical';
export interface InterJSeparator {
    orientation?: JSeparatorOrientation;
    className?: string;
    style?: React.CSSProperties;
}
export declare const JSEPARATOR_DEFAULTS: {
    readonly orientation: "horizontal";
};

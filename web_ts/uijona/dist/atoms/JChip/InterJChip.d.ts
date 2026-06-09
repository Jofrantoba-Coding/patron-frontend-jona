import React from 'react';
export type JChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export interface InterJChip {
    variant?: JChipVariant;
    selected?: boolean;
    removable?: boolean;
    onRemove?: () => void;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
}
export declare const JCHIP_DEFAULTS: {
    readonly variant: "default";
    readonly removable: false;
};

import React from 'react';
export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export interface InterChipAtom extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: ChipVariant;
    selected?: boolean;
    removable?: boolean;
    onRemove?: () => void;
}
export declare const CHIP_ATOM_DEFAULTS: Required<Pick<InterChipAtom, 'variant' | 'selected' | 'removable'>>;

import React from 'react';
export interface InterTabsMolecule {
    value: string;
    variant?: 'pill' | 'line';
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    children: React.ReactNode;
    onChange?: (value: string) => void;
    onTabFocus?: (value: string) => void;
    onDisabledTabClick?: (value: string) => void;
}
export declare const TABS_MOLECULE_DEFAULTS: Required<Pick<InterTabsMolecule, 'variant' | 'orientation'>>;

import { default as React } from '../../../node_modules/react';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export interface InterDrawerMolecule {
    open: boolean;
    side?: DrawerSide;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    showCloseButton?: boolean;
    className?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
}
export declare const DRAWER_MOLECULE_DEFAULTS: Required<Pick<InterDrawerMolecule, 'side' | 'size' | 'showCloseButton'>>;

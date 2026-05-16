import { default as React } from '../../../node_modules/react';

export type PopoverAlign = 'start' | 'center' | 'end';
export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export interface InterPopoverMolecule {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: PopoverAlign;
    side?: PopoverSide;
    className?: string;
    onOpen?: () => void;
    onClose?: () => void;
}
export declare const POPOVER_MOLECULE_DEFAULTS: Required<Pick<InterPopoverMolecule, 'align' | 'side'>>;

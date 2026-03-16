import React from 'react';
import { InterEventsDialogMolecule } from './events/InterEventsDialogMolecule';
interface DialogMoleculeProps extends InterEventsDialogMolecule {
    open: boolean;
    title?: string;
    description?: string;
    showCloseButton?: boolean;
    className?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
}
export declare const DialogMolecule: React.FC<DialogMoleculeProps>;
export {};

import React from 'react';
import { InterDialogMolecule } from './InterDialogMolecule';
interface DialogMoleculeViewProps extends InterDialogMolecule {
    overlayRef: React.RefObject<HTMLDivElement>;
    dialogRef: React.RefObject<HTMLDivElement>;
    onOverlayClick: () => void;
    onCloseClick: () => void;
}
export declare const DialogMoleculeView: React.FC<DialogMoleculeViewProps>;
export {};

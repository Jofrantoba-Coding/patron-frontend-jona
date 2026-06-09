import React from 'react';
import { InterJDialog } from './InterJDialog';
interface JDialogViewProps extends InterJDialog {
    overlayRef: React.RefObject<HTMLDivElement>;
    dialogRef: React.RefObject<HTMLDivElement>;
    onOverlayClick: () => void;
    onCloseClick: () => void;
}
export declare const JDialogView: React.FC<JDialogViewProps>;
export {};

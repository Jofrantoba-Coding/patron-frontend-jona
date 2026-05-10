import React from 'react';
import { ConfirmDialogVariant } from './InterConfirmDialogMolecule';
interface ConfirmDialogMoleculeViewProps {
    open: boolean;
    title: string;
    description?: string;
    variant: ConfirmDialogVariant;
    confirmLabel: string;
    cancelLabel: string;
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
export declare const ConfirmDialogMoleculeView: React.FC<ConfirmDialogMoleculeViewProps>;
export {};

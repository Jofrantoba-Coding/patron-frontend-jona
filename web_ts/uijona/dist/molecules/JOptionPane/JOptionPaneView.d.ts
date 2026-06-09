import React from 'react';
import { JOptionPaneVariant } from './InterJOptionPane';
interface JOptionPaneViewProps {
    open: boolean;
    title: string;
    description?: string;
    variant: JOptionPaneVariant;
    confirmLabel: string;
    cancelLabel: string;
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
export declare const JOptionPaneView: React.FC<JOptionPaneViewProps>;
export {};

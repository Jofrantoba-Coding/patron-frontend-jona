import React from 'react';
export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning';
export interface ToastData {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}
interface ToastAtomProps extends ToastData {
    onDismiss: (id: string) => void;
}
export declare const ToastAtom: React.FC<ToastAtomProps>;
export {};

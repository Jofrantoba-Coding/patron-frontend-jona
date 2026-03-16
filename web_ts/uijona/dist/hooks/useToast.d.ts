import React from 'react';
import { ToastData } from '../atoms/ToastAtom';
interface ToastContextValue {
    toast: (opts: Omit<ToastData, 'id'>) => void;
    dismiss: (id: string) => void;
}
export declare const ToastProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare function useToast(): ToastContextValue;
export declare function useToastHelpers(): {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
};
export {};

import React from 'react';
import { JToastPosition } from '../../molecules/JToast';
import { InterUseToast } from './InterUseToast';
interface ToastProviderProps {
    children: React.ReactNode;
    position?: JToastPosition;
}
export declare const ToastProvider: React.FC<ToastProviderProps>;
export declare function useToast(): InterUseToast;
export declare function useToastHelpers(): {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
};
export {};

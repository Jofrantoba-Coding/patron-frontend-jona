import { default as React } from '../../../node_modules/react';
import { InterUseToast } from './InterUseToast';

export declare const ToastProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare function useToast(): InterUseToast;
export declare function useToastHelpers(): {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
};

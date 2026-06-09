import { JToastVariant } from '../../molecules/JToast';
export interface ToastData {
    id: string;
    message: string;
    title?: string;
    variant?: JToastVariant;
    duration?: number;
}
export interface InterUseToast {
    toast: (opts: Omit<ToastData, 'id'>) => void;
    dismiss: (id: string) => void;
}

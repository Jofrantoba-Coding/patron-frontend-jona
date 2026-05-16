import { ToastVariant } from '../../molecules/ToastMolecule';
export interface ToastData {
    id: string;
    message: string;
    title?: string;
    variant?: ToastVariant;
    duration?: number;
}
export interface InterUseToast {
    toast: (opts: Omit<ToastData, 'id'>) => void;
    dismiss: (id: string) => void;
}

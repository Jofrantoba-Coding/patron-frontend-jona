export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';
export interface InterToastAtom {
    id: string;
    message: string;
    title?: string;
    variant?: ToastVariant;
    duration?: number;
    onDismiss?: (id: string) => void;
}

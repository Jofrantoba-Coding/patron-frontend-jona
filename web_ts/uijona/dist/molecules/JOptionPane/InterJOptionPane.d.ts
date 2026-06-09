export type JOptionPaneVariant = 'danger' | 'warning' | 'info';
export interface InterJOptionPane {
    open: boolean;
    title: string;
    description?: string;
    variant?: JOptionPaneVariant;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
export declare const JOPTIONPANE_DEFAULTS: Required<Pick<InterJOptionPane, 'variant' | 'confirmLabel' | 'cancelLabel' | 'isLoading'>>;

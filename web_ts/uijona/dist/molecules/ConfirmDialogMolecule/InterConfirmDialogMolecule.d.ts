export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';
export interface InterConfirmDialogMolecule {
    open: boolean;
    title: string;
    description?: string;
    variant?: ConfirmDialogVariant;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
export declare const CONFIRM_DIALOG_MOLECULE_DEFAULTS: Required<Pick<InterConfirmDialogMolecule, 'variant' | 'confirmLabel' | 'cancelLabel' | 'isLoading'>>;

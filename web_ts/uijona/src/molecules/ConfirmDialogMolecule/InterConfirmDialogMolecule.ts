// InterConfirmDialogMolecule.ts — JONA Interface + defaults

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

export const CONFIRM_DIALOG_MOLECULE_DEFAULTS: Required<Pick<InterConfirmDialogMolecule,
  'variant' | 'confirmLabel' | 'cancelLabel' | 'isLoading'
>> = {
  variant: 'danger',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  isLoading: false,
};

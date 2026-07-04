export type JChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

/** Contrato publico de JChip. */
export interface InterJChip {
  variant?: JChipVariant;
  /** Estado seleccionado controlado. Si es undefined, el chip se auto-gestiona. */
  selected?: boolean;
  removable?: boolean;
  id?: string;
}

export const JCHIP_DEFAULTS = {
  variant: 'default',
  removable: false,
} as const satisfies Pick<InterJChip, 'variant' | 'removable'>;

export const JCHIP_VARIANT_CLASSES: Record<JChipVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-green-50 text-success-600 border-green-200',
  warning: 'bg-yellow-50 text-warning-600 border-yellow-200',
  danger: 'bg-red-50 text-danger-600 border-red-200',
};

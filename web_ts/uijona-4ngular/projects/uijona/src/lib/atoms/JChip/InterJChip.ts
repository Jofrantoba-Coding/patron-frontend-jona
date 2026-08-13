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


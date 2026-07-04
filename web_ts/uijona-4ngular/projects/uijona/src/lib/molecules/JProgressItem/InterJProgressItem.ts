export type JProgressItemVariant = 'default' | 'success' | 'warning' | 'danger';

export type JProgressItemSize = 'sm' | 'md' | 'lg';

/** Contrato publico de JProgressItem. */
export interface InterJProgressItem {
  label: string;
  value: number;
  max?: number;
  variant?: JProgressItemVariant;
  size?: JProgressItemSize;
  showValue?: boolean;
}

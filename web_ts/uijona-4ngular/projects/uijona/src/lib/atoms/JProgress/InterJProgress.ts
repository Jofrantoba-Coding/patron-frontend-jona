export type JProgressVariant = 'default' | 'success' | 'warning' | 'danger';
export type JProgressType = 'bar' | 'circle';
export type JProgressSize = 'sm' | 'md' | 'lg';

/** Contrato publico de JProgress. */
export interface InterJProgress {
  value?: number;
  max?: number;
  variant?: JProgressVariant;
  type?: JProgressType;
  size?: JProgressSize;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const JPROGRESS_DEFAULTS = {
  value: 0,
  max: 100,
  variant: 'default',
  type: 'bar',
  size: 'md',
  showLabel: false,
  animated: false,
} as const satisfies Pick<
  InterJProgress,
  'value' | 'max' | 'variant' | 'type' | 'size' | 'showLabel' | 'animated'
>;


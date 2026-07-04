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

export const JPROGRESS_BAR_HEIGHT: Record<JProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

export const JPROGRESS_BAR_FILL: Record<JProgressVariant, string> = {
  default: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

export const JPROGRESS_CIRCLE_DIAMETER: Record<JProgressSize, number> = {
  sm: 48,
  md: 72,
  lg: 104,
};

export const JPROGRESS_CIRCLE_STROKE_WIDTH: Record<JProgressSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
};

export const JPROGRESS_CIRCLE_COLOR: Record<JProgressVariant, string> = {
  default: '#2563eb',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export const JPROGRESS_CIRCLE_FONT_SIZE: Record<JProgressSize, number> = {
  sm: 10,
  md: 13,
  lg: 18,
};

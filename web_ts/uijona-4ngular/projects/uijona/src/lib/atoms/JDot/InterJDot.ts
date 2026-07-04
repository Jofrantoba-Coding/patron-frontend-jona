export type JDotSize = 'sm' | 'md' | 'lg';
export type JDotTone = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

/** Contrato publico de JDot. */
export interface InterJDot {
  size?: JDotSize;
  tone?: JDotTone;
  /** Anima un halo (ping) alrededor del punto — util para "en vivo"/"online". */
  pulse?: boolean;
  /** Si se define, el punto es anunciable (role=status). */
  ariaLabel?: string;
}

export const JDOT_DEFAULTS = {
  size: 'md',
  tone: 'primary',
  pulse: false,
} as const satisfies Required<Pick<InterJDot, 'size' | 'tone' | 'pulse'>>;

export const JDOT_SIZE_CLASSES: Record<JDotSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

export const JDOT_TONE_CLASSES: Record<JDotTone, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  neutral: 'bg-neutral-300',
};

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


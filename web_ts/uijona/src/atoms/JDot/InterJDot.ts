import React from 'react';

export type JDotSize = 'sm' | 'md' | 'lg';
export type JDotTone = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

export interface InterJDot {
  size?: JDotSize;
  tone?: JDotTone;
  /** Anima un halo (ping) alrededor del punto — útil para "en vivo"/"online". */
  pulse?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Si se define, el punto es anunciable (role=status). */
  'aria-label'?: string;
}

export const JDOT_DEFAULTS = {
  size: 'md',
  tone: 'primary',
  pulse: false,
} as const satisfies Required<Pick<InterJDot, 'size' | 'tone' | 'pulse'>>;

export const JDOT_TONES: Record<JDotTone, string> = {
  primary: 'Indicador primario/marca.',
  accent:  'Indicador de acento.',
  success: 'Éxito, online, operativo.',
  warning: 'Advertencia, degradado.',
  danger:  'Error, offline, crítico.',
  neutral: 'Neutro, inactivo.',
};

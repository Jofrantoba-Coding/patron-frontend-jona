// InterJHeroDynamic.ts — JONA Interface
import React from 'react';

export interface HeroDynamicCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

export interface InterJHeroDynamic extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  /** Parte fija del titular, p.ej. "Construimos". */
  titlePrefix: string;
  /** Palabras/verticales que rotan tras el prefijo. */
  rotatingWords: string[];
  subtitle?: string;
  ctas?: HeroDynamicCTA[];
  visual?: React.ReactNode;
  /** Milisegundos entre rotaciones. */
  intervalMs?: number;
}

export const JHERO_DYNAMIC_DEFAULTS = {
  intervalMs: 2200,
} as const satisfies Partial<InterJHeroDynamic>;

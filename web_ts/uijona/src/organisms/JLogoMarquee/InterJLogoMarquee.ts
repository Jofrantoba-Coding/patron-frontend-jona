// InterJLogoMarquee.ts — JONA Interface
import React from 'react';

export type JLogoMarqueeSpeed = 'slow' | 'normal' | 'fast';

export interface InterJLogoMarquee {
  /** Logos o etiquetas a desplazar (img, svg, texto…). */
  items: React.ReactNode[];
  /** Encabezado opcional sobre la franja. */
  label?: string;
  speed?: JLogoMarqueeSpeed;
  /** Pausa el desplazamiento al pasar el cursor. */
  pauseOnHover?: boolean;
  as?: 'section' | 'div';
  className?: string;
}

export const JLOGO_MARQUEE_DEFAULTS = {
  speed: 'normal',
  pauseOnHover: true,
  as: 'section',
} as const satisfies Partial<InterJLogoMarquee>;

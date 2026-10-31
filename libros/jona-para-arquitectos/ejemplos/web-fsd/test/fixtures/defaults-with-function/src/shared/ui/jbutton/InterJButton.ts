import type { MouseEvent } from 'react';

export interface InterJButton {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

// Violación: los DEFAULTS son valores de presentación, no manejadores.
export const JBUTTON_DEFAULTS = {
  variant: 'default',
  onClick: () => undefined,
} as const;

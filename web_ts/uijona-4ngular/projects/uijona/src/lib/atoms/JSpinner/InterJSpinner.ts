export type JSpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type JSpinnerColor = 'current' | 'primary' | 'white' | 'neutral';

/** Contrato publico de JSpinner. */
export interface InterJSpinner {
  size?: JSpinnerSize;
  color?: JSpinnerColor;
  label?: string;
}

export const JSPINNER_DEFAULTS = {
  size: 'md',
  color: 'current',
  label: 'Loading',
} as const satisfies Required<InterJSpinner>;


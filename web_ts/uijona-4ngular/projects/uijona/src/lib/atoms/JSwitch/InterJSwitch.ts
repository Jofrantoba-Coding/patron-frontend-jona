export type JSwitchSize = 'sm' | 'md' | 'lg';

/** Contrato publico de JSwitch. */
export interface InterJSwitch {
  checked?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  size?: JSwitchSize;
  id?: string;
}

export const JSWITCH_DEFAULTS = {
  hasError: false,
  disabled: false,
  size: 'md',
} as const satisfies Pick<InterJSwitch, 'hasError' | 'disabled' | 'size'>;


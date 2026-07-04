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

export const JSWITCH_TRACK_SIZE: Record<JSwitchSize, string> = {
  sm: 'w-8 h-4',
  md: 'w-11 h-6',
  lg: 'w-14 h-7',
};

export const JSWITCH_THUMB_SIZE: Record<JSwitchSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const JSWITCH_THUMB_TRANSLATE: Record<JSwitchSize, { on: string; off: string }> = {
  sm: { on: 'translate-x-4', off: 'translate-x-0.5' },
  md: { on: 'translate-x-5', off: 'translate-x-0.5' },
  lg: { on: 'translate-x-7', off: 'translate-x-0.5' },
};

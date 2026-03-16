// InterSwitchAtom.ts — JONA Interface

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface InterSwitchAtom {
  checked?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  size?: SwitchSize;
  className?: string;
  // Observer events
  onCheckedChange?: (checked: boolean) => void;
}

export const SWITCH_ATOM_DEFAULTS: Required<Pick<InterSwitchAtom, 'checked' | 'hasError' | 'disabled' | 'size'>> = {
  checked:  false,
  hasError: false,
  disabled: false,
  size:     'md',
};

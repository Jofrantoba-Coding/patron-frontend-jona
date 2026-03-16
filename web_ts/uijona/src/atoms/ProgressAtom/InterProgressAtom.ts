// InterProgressAtom.ts — JONA Interface

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

export interface InterProgressAtom {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
}

export const PROGRESS_ATOM_DEFAULTS: Required<Pick<InterProgressAtom, 'value' | 'max' | 'variant' | 'showLabel'>> = {
  value:     0,
  max:       100,
  variant:   'default',
  showLabel: false,
};

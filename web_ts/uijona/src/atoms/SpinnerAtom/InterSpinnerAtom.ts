// InterSpinnerAtom.ts — JONA Interface

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface InterSpinnerAtom {
  size?: SpinnerSize;
  className?: string;
}

export const SPINNER_ATOM_DEFAULTS: Required<Pick<InterSpinnerAtom, 'size'>> = {
  size: 'md',
};

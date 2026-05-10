// InterRatingAtom.ts — JONA Interface + defaults

export interface InterRatingAtom {
  value?: number;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  // Observer events
  onChange?: (value: number) => void;
  onHover?: (value: number | null) => void;
}

export const RATING_ATOM_DEFAULTS: Required<Pick<InterRatingAtom, 'max' | 'readOnly' | 'size' | 'value'>> = {
  value: 0,
  max: 5,
  readOnly: false,
  size: 'md',
};

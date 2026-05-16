// InterRatingMolecule.ts — JONA Interface + defaults

export interface InterRatingMolecule {
  value?: number;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  // Observer events
  onChange?: (value: number) => void;
  onHover?: (value: number | null) => void;
}

export const RATING_MOLECULE_DEFAULTS: Required<Pick<InterRatingMolecule, 'max' | 'readOnly' | 'size' | 'value'>> = {
  value: 0,
  max: 5,
  readOnly: false,
  size: 'md',
};

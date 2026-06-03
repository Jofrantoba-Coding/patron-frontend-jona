// InterJRating.ts — JONA Interface
export interface InterJRating {
  value?:     number;
  max?:       number;
  readOnly?:  boolean;
  size?:      'sm' | 'md' | 'lg';
  className?: string;
  onChange?:  (value: number) => void;
  onHover?:   (value: number | null) => void;
}

export const JRATING_DEFAULTS: Required<Pick<InterJRating, 'max' | 'readOnly' | 'size'>> = {
  max:      5,
  readOnly: false,
  size:     'md',
};

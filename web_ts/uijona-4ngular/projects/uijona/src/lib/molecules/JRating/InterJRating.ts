export type JRatingSize = 'sm' | 'md' | 'lg';

/** Contrato publico de JRating. */
export interface InterJRating {
  value?: number;
  max?: number;
  readOnly?: boolean;
  size?: JRatingSize;
}

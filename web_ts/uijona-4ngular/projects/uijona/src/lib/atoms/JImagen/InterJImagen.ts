export type JImagenFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type JImagenRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type JImagenAspectRatio = 'auto' | 'square' | 'video' | 'wide' | 'portrait';

export const JIMAGEN_FITS: readonly JImagenFit[] = [
  'contain',
  'cover',
  'fill',
  'none',
  'scale-down',
];
export const JIMAGEN_RADII: readonly JImagenRadius[] = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
export const JIMAGEN_ASPECT_RATIOS: readonly JImagenAspectRatio[] = [
  'auto',
  'square',
  'video',
  'wide',
  'portrait',
];

/** Contrato publico de JImagen. */
export interface InterJImagen {
  src: string;
  alt: string;
  fit?: JImagenFit;
  radius?: JImagenRadius;
  aspectRatio?: JImagenAspectRatio;
  block?: boolean;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
}

export const JIMAGEN_DEFAULTS = {
  fit: 'cover',
  radius: 'none',
  aspectRatio: 'auto',
  block: false,
  loading: 'lazy',
  decoding: 'async',
} as const satisfies Required<
  Pick<InterJImagen, 'fit' | 'radius' | 'aspectRatio' | 'block' | 'loading' | 'decoding'>
>;

export const JIMAGEN_FIT_CLASSES: Record<JImagenFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

export const JIMAGEN_RADIUS_CLASSES: Record<JImagenRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const JIMAGEN_ASPECT_RATIO_CLASSES: Record<JImagenAspectRatio, string | undefined> = {
  auto: undefined,
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
};

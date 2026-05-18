import React from 'react';

export type JImagenFit         = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type JImagenRadius      = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type JImagenAspectRatio = 'auto' | 'square' | 'video' | 'wide' | 'portrait';

export const JIMAGEN_FITS:         readonly JImagenFit[]         = ['contain', 'cover', 'fill', 'none', 'scale-down'];
export const JIMAGEN_RADII:        readonly JImagenRadius[]      = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
export const JIMAGEN_ASPECT_RATIOS: readonly JImagenAspectRatio[] = ['auto', 'square', 'video', 'wide', 'portrait'];

export interface InterJImagen {
  src:           string;
  alt:           string;
  fit?:          JImagenFit;
  radius?:       JImagenRadius;
  aspectRatio?:  JImagenAspectRatio;
  block?:        boolean;
  fallbackSrc?:  string;
  loading?:      'lazy' | 'eager';
  decoding?:     'async' | 'auto' | 'sync';
  className?:    string;
  style?:        React.CSSProperties;
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const JIMAGEN_DEFAULTS = {
  fit:         'cover',
  radius:      'none',
  aspectRatio: 'auto',
  block:       false,
  loading:     'lazy',
  decoding:    'async',
} as const satisfies Required<Pick<InterJImagen,
  'fit' | 'radius' | 'aspectRatio' | 'block' | 'loading' | 'decoding'>>;

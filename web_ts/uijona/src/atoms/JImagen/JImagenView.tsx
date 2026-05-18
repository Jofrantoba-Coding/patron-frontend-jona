import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/cn';
import { InterJImagen, JImagenAspectRatio, JImagenFit, JImagenRadius } from './InterJImagen';

interface JImagenViewProps extends InterJImagen {
  forwardedRef?: React.Ref<HTMLImageElement>;
}

const fitClasses: Record<JImagenFit, string> = {
  contain:      'object-contain',
  cover:        'object-cover',
  fill:         'object-fill',
  none:         'object-none',
  'scale-down': 'object-scale-down',
};

const radiusClasses: Record<JImagenRadius, string> = {
  none: 'rounded-none',
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  full: 'rounded-full',
};

const aspectRatioClasses: Record<JImagenAspectRatio, string | undefined> = {
  auto:     undefined,
  square:   'aspect-square',
  video:    'aspect-video',
  wide:     'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
};

export const JImagenView: React.FC<JImagenViewProps> = ({
  src,
  alt,
  fit         = 'cover',
  radius      = 'none',
  aspectRatio = 'auto',
  block       = false,
  loading     = 'lazy',
  decoding    = 'async',
  fallbackSrc,
  className,
  style,
  onImageError,
  forwardedRef,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => { setCurrentSrc(src); }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onImageError?.(e);
  };

  return (
    <img
      ref={forwardedRef}
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      data-jimagen-fit={fit}
      data-jimagen-radius={radius}
      data-jimagen-aspect={aspectRatio !== 'auto' ? aspectRatio : undefined}
      data-jimagen-block={block ? 'true' : undefined}
      className={cn(
        'jimagen',
        'max-w-full min-w-0 shrink-0',
        block ? 'block w-full' : 'inline-block',
        fitClasses[fit],
        radiusClasses[radius],
        aspectRatioClasses[aspectRatio],
        className
      )}
      style={style}
      onError={handleError}
    />
  );
};

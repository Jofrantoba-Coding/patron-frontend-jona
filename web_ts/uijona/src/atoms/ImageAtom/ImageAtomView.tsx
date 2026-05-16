// ImageAtomView.tsx - JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { ImageAspectRatio, ImageFit, ImageRadius, InterImageAtom } from './InterImageAtom';

const fitClasses: Record<ImageFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

const radiusClasses: Record<ImageRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const aspectRatioClasses: Record<ImageAspectRatio, string | undefined> = {
  auto: undefined,
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
};

type ImageAtomViewProps = Omit<InterImageAtom, 'fallbackSrc' | 'onImageError'>;

export const ImageAtomView = React.forwardRef<HTMLImageElement, ImageAtomViewProps>(
  (
    {
      fit,
      radius,
      aspectRatio,
      block,
      className,
      ...props
    },
    ref
  ) => (
    <img
      ref={ref}
      className={cn(
        'max-w-full min-w-0 shrink-0',
        block ? 'block w-full' : 'inline-block',
        fitClasses[fit!],
        radiusClasses[radius!],
        aspectRatioClasses[aspectRatio!],
        className
      )}
      {...props}
    />
  )
);
ImageAtomView.displayName = 'ImageAtomView';

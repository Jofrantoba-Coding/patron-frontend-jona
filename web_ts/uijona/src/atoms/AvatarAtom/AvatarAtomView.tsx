// AvatarAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterAvatarAtom, AvatarSize, AvatarShape } from './InterAvatarAtom';

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

const shapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};

interface AvatarAtomViewProps extends InterAvatarAtom {
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const AvatarAtomView: React.FC<AvatarAtomViewProps> = ({
  src, alt, initials, size, shape, className, onImageError,
}) => (
  <div
    className={cn(
      'relative inline-flex items-center justify-center overflow-hidden bg-primary-100 text-primary-700 font-semibold flex-shrink-0',
      sizeClasses[size!],
      shapeClasses[shape!],
      className
    )}
    aria-label={alt || initials}
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={onImageError}
      />
    ) : (
      <span aria-hidden="true">{initials ?? '?'}</span>
    )}
  </div>
);

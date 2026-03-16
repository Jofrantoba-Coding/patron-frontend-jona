// AvatarAtom.tsx — Level 1: Atom
// Displays an image avatar with fallback initials.
import React from 'react';
import { cn } from '../lib/cn';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarAtomProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

export const AvatarAtom: React.FC<AvatarAtomProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;

  const initials = fallback
    ? fallback.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-primary-600 text-white font-semibold flex-shrink-0',
        sizeClasses[size],
        className
      )}
      aria-label={alt || fallback}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
};

import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/cn';
import { InterJAvatar, JAvatarShape, JAvatarSize } from './InterJAvatar';

interface JAvatarViewProps extends InterJAvatar {
  forwardedRef?: React.Ref<HTMLDivElement>;
}

const sizeClasses: Record<JAvatarSize, string> = {
  xs: 'w-6  h-6  text-xs',
  sm: 'w-8  h-8  text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
};

const shapeClasses: Record<JAvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};

export const JAvatarView: React.FC<JAvatarViewProps> = ({
  src,
  alt   = '',
  initials,
  size  = 'md',
  shape = 'circle',
  className,
  style,
  onImageError,
  forwardedRef,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => { setImgError(false); }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgError(true);
    onImageError?.(e);
  };

  const showImage = !!src && !imgError;
  const label     = alt || initials || undefined;

  return (
    <div
      ref={forwardedRef}
      className={cn(
        'javatar',
        'bg-primary-100 text-primary-700 font-semibold',
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
      style={style}
      data-javatar-size={size}
      data-javatar-shape={shape}
      data-javatar-has-image={showImage ? 'true' : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {showImage ? (
        <img src={src} alt={alt} onError={handleError} />
      ) : (
        <span aria-hidden="true">{initials ?? '?'}</span>
      )}
    </div>
  );
};

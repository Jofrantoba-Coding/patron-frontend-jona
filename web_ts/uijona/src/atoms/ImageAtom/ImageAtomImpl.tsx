// ImageAtomImpl.tsx - JONA Implementation
import React from 'react';
import { IMAGE_ATOM_DEFAULTS, InterImageAtom } from './InterImageAtom';
import { ImageAtomView } from './ImageAtomView';

export const ImageAtomImpl = React.forwardRef<HTMLImageElement, InterImageAtom>(
  ({ src, fallbackSrc, onError, onImageError, ...props }, ref) => {
    const [currentSrc, setCurrentSrc] = React.useState(src);

    React.useEffect(() => {
      setCurrentSrc(src);
    }, [src]);

    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        onImageError?.(event);
        onError?.(event);
      },
      [currentSrc, fallbackSrc, onError, onImageError]
    );

    return (
      <ImageAtomView
        ref={ref}
        {...IMAGE_ATOM_DEFAULTS}
        {...props}
        src={currentSrc}
        onError={handleError}
      />
    );
  }
);
ImageAtomImpl.displayName = 'ImageAtom';

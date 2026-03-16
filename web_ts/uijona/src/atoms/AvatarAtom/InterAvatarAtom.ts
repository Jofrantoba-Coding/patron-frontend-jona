// InterAvatarAtom.ts — JONA Interface
import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface InterAvatarAtom {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  // Observer events
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const AVATAR_ATOM_DEFAULTS: Required<Pick<InterAvatarAtom, 'alt' | 'size' | 'shape'>> = {
  alt:   '',
  size:  'md',
  shape: 'circle',
};

// InterEventsAvatarAtom.ts — Observer: Event Contract for AvatarAtom
// Declares every event AvatarAtom can emit.
import React from 'react';

export interface InterEventsAvatarAtom {
  /** Fired when the avatar image fails to load (fallback is shown) */
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  /** Fired when the avatar is clicked (e.g. open profile menu) */
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

import React from 'react';

export interface InterEventsAvatarAtom {
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

// AvatarAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterAvatarAtom, AVATAR_ATOM_DEFAULTS } from './InterAvatarAtom';
import { AvatarAtomView } from './AvatarAtomView';

export const AvatarAtomImpl: React.FC<InterAvatarAtom> = (props) => (
  <AvatarAtomView {...AVATAR_ATOM_DEFAULTS} {...props} />
);
AvatarAtomImpl.displayName = 'AvatarAtom';

// BadgeAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterBadgeAtom, BADGE_ATOM_DEFAULTS } from './InterBadgeAtom';
import { BadgeAtomView } from './BadgeAtomView';

export const BadgeAtomImpl: React.FC<InterBadgeAtom> = (props) => (
  <BadgeAtomView {...BADGE_ATOM_DEFAULTS} {...props} />
);

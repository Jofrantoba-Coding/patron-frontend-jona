// ProgressAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterProgressAtom, PROGRESS_ATOM_DEFAULTS } from './InterProgressAtom';
import { ProgressAtomView } from './ProgressAtomView';

export const ProgressAtomImpl: React.FC<InterProgressAtom> = (props) => (
  <ProgressAtomView {...PROGRESS_ATOM_DEFAULTS} {...props} />
);
ProgressAtomImpl.displayName = 'ProgressAtom';

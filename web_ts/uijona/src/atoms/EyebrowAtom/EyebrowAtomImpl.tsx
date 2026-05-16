// EyebrowAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterEyebrowAtom, EYEBROW_ATOM_DEFAULTS } from './InterEyebrowAtom';
import { EyebrowAtomView } from './EyebrowAtomView';

export const EyebrowAtomImpl: React.FC<InterEyebrowAtom> = (props) => (
  <EyebrowAtomView {...EYEBROW_ATOM_DEFAULTS} {...props} />
);

// SpinnerAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterSpinnerAtom, SPINNER_ATOM_DEFAULTS } from './InterSpinnerAtom';
import { SpinnerAtomView } from './SpinnerAtomView';

export const SpinnerAtomImpl: React.FC<InterSpinnerAtom> = (props) => (
  <SpinnerAtomView {...SPINNER_ATOM_DEFAULTS} {...props} />
);

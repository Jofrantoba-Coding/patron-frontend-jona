// TextAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterTextAtom, TEXT_ATOM_DEFAULTS } from './InterTextAtom';
import { TextAtomView } from './TextAtomView';

export const TextAtomImpl: React.FC<InterTextAtom> = (props) => (
  <TextAtomView {...TEXT_ATOM_DEFAULTS} {...props} />
);
TextAtomImpl.displayName = 'TextAtom';

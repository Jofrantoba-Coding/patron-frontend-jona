// EmptyStateMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterEmptyStateMolecule } from './InterEmptyStateMolecule';
import { EmptyStateMoleculeView } from './EmptyStateMoleculeView';

export const EmptyStateMoleculeImpl: React.FC<InterEmptyStateMolecule> = (props) => (
  <EmptyStateMoleculeView {...props} />
);

EmptyStateMoleculeImpl.displayName = 'EmptyStateMolecule';

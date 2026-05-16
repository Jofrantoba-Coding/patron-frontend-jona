// NumberedStepMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterNumberedStepMolecule, NUMBERED_STEP_MOLECULE_DEFAULTS } from './InterNumberedStepMolecule';
import { NumberedStepMoleculeView } from './NumberedStepMoleculeView';

export const NumberedStepMoleculeImpl: React.FC<InterNumberedStepMolecule> = (props) => (
  <NumberedStepMoleculeView {...NUMBERED_STEP_MOLECULE_DEFAULTS} {...props} />
);

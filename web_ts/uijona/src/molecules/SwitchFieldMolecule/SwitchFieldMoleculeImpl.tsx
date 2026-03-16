// SwitchFieldMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterSwitchFieldMolecule, SWITCH_FIELD_MOLECULE_DEFAULTS } from './InterSwitchFieldMolecule';
import { SwitchFieldMoleculeView } from './SwitchFieldMoleculeView';

export const SwitchFieldMoleculeImpl: React.FC<InterSwitchFieldMolecule> = (props) => (
  <SwitchFieldMoleculeView {...SWITCH_FIELD_MOLECULE_DEFAULTS} {...props} />
);
SwitchFieldMoleculeImpl.displayName = 'SwitchFieldMolecule';

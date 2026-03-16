// CheckboxFieldMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterCheckboxFieldMolecule, CHECKBOX_FIELD_MOLECULE_DEFAULTS } from './InterCheckboxFieldMolecule';
import { CheckboxFieldMoleculeView } from './CheckboxFieldMoleculeView';

export const CheckboxFieldMoleculeImpl: React.FC<InterCheckboxFieldMolecule> = (props) => (
  <CheckboxFieldMoleculeView {...CHECKBOX_FIELD_MOLECULE_DEFAULTS} {...props} />
);
CheckboxFieldMoleculeImpl.displayName = 'CheckboxFieldMolecule';

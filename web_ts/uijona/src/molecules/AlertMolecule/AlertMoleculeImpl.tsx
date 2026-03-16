// AlertMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterAlertMolecule, ALERT_MOLECULE_DEFAULTS } from './InterAlertMolecule';
import { AlertMoleculeView } from './AlertMoleculeView';

export const AlertMoleculeImpl: React.FC<InterAlertMolecule> = (props) => (
  <AlertMoleculeView {...ALERT_MOLECULE_DEFAULTS} {...props} />
);
AlertMoleculeImpl.displayName = 'AlertMolecule';

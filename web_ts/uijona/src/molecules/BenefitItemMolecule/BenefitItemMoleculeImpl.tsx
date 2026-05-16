// BenefitItemMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterBenefitItemMolecule, BENEFIT_ITEM_MOLECULE_DEFAULTS } from './InterBenefitItemMolecule';
import { BenefitItemMoleculeView } from './BenefitItemMoleculeView';

export const BenefitItemMoleculeImpl: React.FC<InterBenefitItemMolecule> = (props) => (
  <BenefitItemMoleculeView {...BENEFIT_ITEM_MOLECULE_DEFAULTS} {...props} />
);

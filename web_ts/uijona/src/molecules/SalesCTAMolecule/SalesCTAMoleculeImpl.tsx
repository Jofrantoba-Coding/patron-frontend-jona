// SalesCTAMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterSalesCTAMolecule, SALES_CTA_MOLECULE_DEFAULTS } from './InterSalesCTAMolecule';
import { SalesCTAMoleculeView } from './SalesCTAMoleculeView';

export const SalesCTAMoleculeImpl: React.FC<InterSalesCTAMolecule> = (props) => (
  <SalesCTAMoleculeView {...SALES_CTA_MOLECULE_DEFAULTS} {...props} />
);

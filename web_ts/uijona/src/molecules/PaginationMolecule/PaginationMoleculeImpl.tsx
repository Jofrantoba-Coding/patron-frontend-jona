// PaginationMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterPaginationMolecule, PAGINATION_MOLECULE_DEFAULTS } from './InterPaginationMolecule';
import { PaginationMoleculeView } from './PaginationMoleculeView';

export const PaginationMoleculeImpl: React.FC<InterPaginationMolecule> = (props) => (
  <PaginationMoleculeView {...PAGINATION_MOLECULE_DEFAULTS} {...props} />
);
PaginationMoleculeImpl.displayName = 'PaginationMolecule';

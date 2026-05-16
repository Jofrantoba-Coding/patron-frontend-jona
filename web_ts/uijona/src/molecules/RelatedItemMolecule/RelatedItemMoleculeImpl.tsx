// RelatedItemMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterRelatedItemMolecule, RELATED_ITEM_MOLECULE_DEFAULTS } from './InterRelatedItemMolecule';
import { RelatedItemMoleculeView } from './RelatedItemMoleculeView';

export const RelatedItemMoleculeImpl: React.FC<InterRelatedItemMolecule> = (props) => (
  <RelatedItemMoleculeView {...RELATED_ITEM_MOLECULE_DEFAULTS} {...props} />
);

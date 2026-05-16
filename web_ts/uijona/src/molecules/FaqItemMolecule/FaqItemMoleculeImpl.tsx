// FaqItemMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterFaqItemMolecule, FAQ_ITEM_MOLECULE_DEFAULTS } from './InterFaqItemMolecule';
import { FaqItemMoleculeView } from './FaqItemMoleculeView';

export const FaqItemMoleculeImpl: React.FC<InterFaqItemMolecule> = (props) => (
  <FaqItemMoleculeView {...FAQ_ITEM_MOLECULE_DEFAULTS} {...props} />
);

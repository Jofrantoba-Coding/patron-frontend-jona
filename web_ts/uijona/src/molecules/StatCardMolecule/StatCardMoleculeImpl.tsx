import React from 'react';
import { InterStatCardMolecule, STAT_CARD_MOLECULE_DEFAULTS } from './InterStatCardMolecule';
import { StatCardMoleculeView } from './StatCardMoleculeView';

export const StatCardMoleculeImpl: React.FC<InterStatCardMolecule> = (props) => {
  const resolved = { ...STAT_CARD_MOLECULE_DEFAULTS, ...props };
  return <StatCardMoleculeView {...resolved} />;
};

StatCardMoleculeImpl.displayName = 'StatCardMolecule';

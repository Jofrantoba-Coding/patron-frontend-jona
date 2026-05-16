// MarketingHeroMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterMarketingHeroMolecule, MARKETING_HERO_MOLECULE_DEFAULTS } from './InterMarketingHeroMolecule';
import { MarketingHeroMoleculeView } from './MarketingHeroMoleculeView';

export const MarketingHeroMoleculeImpl: React.FC<InterMarketingHeroMolecule> = (props) => (
  <MarketingHeroMoleculeView {...MARKETING_HERO_MOLECULE_DEFAULTS} {...props} />
);

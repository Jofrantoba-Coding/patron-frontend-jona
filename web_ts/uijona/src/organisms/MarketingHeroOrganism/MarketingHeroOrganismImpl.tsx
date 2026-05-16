// MarketingHeroOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterMarketingHeroOrganism, MARKETING_HERO_ORGANISM_DEFAULTS } from './InterMarketingHeroOrganism';
import { MarketingHeroOrganismView } from './MarketingHeroOrganismView';

export const MarketingHeroOrganismImpl: React.FC<InterMarketingHeroOrganism> = (props) => (
  <MarketingHeroOrganismView {...MARKETING_HERO_ORGANISM_DEFAULTS} {...props} />
);

// MarketingCTAOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterMarketingCTAOrganism, MARKETING_CTA_ORGANISM_DEFAULTS } from './InterMarketingCTAOrganism';
import { MarketingCTAOrganismView } from './MarketingCTAOrganismView';

export const MarketingCTAOrganismImpl: React.FC<InterMarketingCTAOrganism> = (props) => (
  <MarketingCTAOrganismView {...MARKETING_CTA_ORGANISM_DEFAULTS} {...props} />
);

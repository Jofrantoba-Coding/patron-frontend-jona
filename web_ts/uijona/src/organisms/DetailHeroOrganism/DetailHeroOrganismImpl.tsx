// DetailHeroOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterDetailHeroOrganism, DETAIL_HERO_ORGANISM_DEFAULTS } from './InterDetailHeroOrganism';
import { DetailHeroOrganismView } from './DetailHeroOrganismView';

export const DetailHeroOrganismImpl: React.FC<InterDetailHeroOrganism> = (props) => (
  <DetailHeroOrganismView {...DETAIL_HERO_ORGANISM_DEFAULTS} {...props} />
);

// DetailCTAOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterDetailCTAOrganism, DETAIL_CTA_ORGANISM_DEFAULTS } from './InterDetailCTAOrganism';
import { DetailCTAOrganismView } from './DetailCTAOrganismView';

export const DetailCTAOrganismImpl: React.FC<InterDetailCTAOrganism> = (props) => (
  <DetailCTAOrganismView {...DETAIL_CTA_ORGANISM_DEFAULTS} {...props} />
);

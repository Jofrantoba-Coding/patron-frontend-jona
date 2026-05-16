// SiteFooterOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterSiteFooterOrganism, SITE_FOOTER_ORGANISM_DEFAULTS } from './InterSiteFooterOrganism';
import { SiteFooterOrganismView } from './SiteFooterOrganismView';

export const SiteFooterOrganismImpl: React.FC<InterSiteFooterOrganism> = (props) => (
  <SiteFooterOrganismView {...SITE_FOOTER_ORGANISM_DEFAULTS} {...props} />
);

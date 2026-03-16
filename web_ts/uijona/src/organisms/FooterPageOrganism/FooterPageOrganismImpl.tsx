// FooterPageOrganismImpl.tsx — JONA Impl (defaults spread)
import React from 'react';
import { InterFooterPageOrganism, FOOTER_PAGE_ORGANISM_DEFAULTS } from './InterFooterPageOrganism';
import { FooterPageOrganismView } from './FooterPageOrganismView';

export const FooterPageOrganismImpl: React.FC<InterFooterPageOrganism> = (props) => {
  const merged = { ...FOOTER_PAGE_ORGANISM_DEFAULTS, ...props };
  return <FooterPageOrganismView {...merged} />;
};

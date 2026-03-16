// HeaderPageOrganismImpl.tsx — JONA Impl (defaults spread)
import React from 'react';
import { InterHeaderPageOrganism, HEADER_PAGE_ORGANISM_DEFAULTS } from './InterHeaderPageOrganism';
import { HeaderPageOrganismView } from './HeaderPageOrganismView';

export const HeaderPageOrganismImpl: React.FC<InterHeaderPageOrganism> = (props) => {
  const merged = { ...HEADER_PAGE_ORGANISM_DEFAULTS, ...props };
  return <HeaderPageOrganismView {...merged} />;
};

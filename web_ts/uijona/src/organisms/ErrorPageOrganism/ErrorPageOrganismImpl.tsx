// ErrorPageOrganismImpl.tsx — JONA Layer: Implementation (applies defaults)
import React from 'react';
import { InterErrorPageOrganism, ERROR_PAGE_ORGANISM_DEFAULTS } from './InterErrorPageOrganism';
import { ErrorPageOrganismView } from './ErrorPageOrganismView';

export const ErrorPageOrganismImpl: React.FC<InterErrorPageOrganism> = (props) => {
  const merged: InterErrorPageOrganism = { ...ERROR_PAGE_ORGANISM_DEFAULTS, ...props };
  return <ErrorPageOrganismView {...merged} />;
};

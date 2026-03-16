// HeaderPageOrganism.tsx — JONA entry component
import React from 'react';
import { HeaderPageOrganismImpl } from './HeaderPageOrganismImpl';
import { InterHeaderPageOrganism } from './InterHeaderPageOrganism';

export const HeaderPageOrganism: React.FC<InterHeaderPageOrganism> = (props) => (
  <HeaderPageOrganismImpl {...props} />
);

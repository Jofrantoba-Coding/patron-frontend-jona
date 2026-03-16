// FooterPageOrganism.tsx — JONA entry component
import React from 'react';
import { FooterPageOrganismImpl } from './FooterPageOrganismImpl';
import { InterFooterPageOrganism } from './InterFooterPageOrganism';

export const FooterPageOrganism: React.FC<InterFooterPageOrganism> = (props) => (
  <FooterPageOrganismImpl {...props} />
);

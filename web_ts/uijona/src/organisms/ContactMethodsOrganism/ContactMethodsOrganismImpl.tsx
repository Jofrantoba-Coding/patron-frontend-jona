// ContactMethodsOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterContactMethodsOrganism, CONTACT_METHODS_ORGANISM_DEFAULTS } from './InterContactMethodsOrganism';
import { ContactMethodsOrganismView } from './ContactMethodsOrganismView';

export const ContactMethodsOrganismImpl: React.FC<InterContactMethodsOrganism> = (props) => (
  <ContactMethodsOrganismView {...CONTACT_METHODS_ORGANISM_DEFAULTS} {...props} />
);

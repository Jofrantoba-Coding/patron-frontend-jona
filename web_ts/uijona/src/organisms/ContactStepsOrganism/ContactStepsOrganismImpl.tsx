// ContactStepsOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterContactStepsOrganism, CONTACT_STEPS_ORGANISM_DEFAULTS } from './InterContactStepsOrganism';
import { ContactStepsOrganismView } from './ContactStepsOrganismView';

export const ContactStepsOrganismImpl: React.FC<InterContactStepsOrganism> = (props) => (
  <ContactStepsOrganismView {...CONTACT_STEPS_ORGANISM_DEFAULTS} {...props} />
);

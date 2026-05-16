// ContactMethodCardMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterContactMethodCardMolecule, CONTACT_METHOD_CARD_MOLECULE_DEFAULTS } from './InterContactMethodCardMolecule';
import { ContactMethodCardMoleculeView } from './ContactMethodCardMoleculeView';

export const ContactMethodCardMoleculeImpl: React.FC<InterContactMethodCardMolecule> = (props) => (
  <ContactMethodCardMoleculeView {...CONTACT_METHOD_CARD_MOLECULE_DEFAULTS} {...props} />
);

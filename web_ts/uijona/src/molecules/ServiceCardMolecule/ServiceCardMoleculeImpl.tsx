// ServiceCardMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterServiceCardMolecule, SERVICE_CARD_MOLECULE_DEFAULTS } from './InterServiceCardMolecule';
import { ServiceCardMoleculeView } from './ServiceCardMoleculeView';

export const ServiceCardMoleculeImpl: React.FC<InterServiceCardMolecule> = (props) => (
  <ServiceCardMoleculeView {...SERVICE_CARD_MOLECULE_DEFAULTS} {...props} />
);

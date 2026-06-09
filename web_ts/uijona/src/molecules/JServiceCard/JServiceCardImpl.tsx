// JServiceCardImpl.tsx — JONA Implementation
import React from 'react';
import { InterJServiceCard, JSERVICE_CARD_DEFAULTS } from './InterJServiceCard';
import { JServiceCardView } from './JServiceCardView';

export const JServiceCardImpl: React.FC<InterJServiceCard> = (props) => (
  <JServiceCardView {...JSERVICE_CARD_DEFAULTS} {...props} />
);

// JContactMethodCardImpl.tsx — JONA Implementation
import React from 'react';
import { InterJContactMethodCard, JCONTACT_METHOD_CARD_DEFAULTS } from './InterJContactMethodCard';
import { JContactMethodCardView } from './JContactMethodCardView';

export const JContactMethodCardImpl: React.FC<InterJContactMethodCard> = (props) => (
  <JContactMethodCardView {...JCONTACT_METHOD_CARD_DEFAULTS} {...props} />
);

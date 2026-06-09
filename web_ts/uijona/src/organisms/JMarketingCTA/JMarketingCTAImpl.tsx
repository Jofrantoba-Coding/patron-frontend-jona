// JMarketingCTAImpl.tsx — JONA Implementation
import React from 'react';
import { InterJMarketingCTA, JMARKETING_CTA_DEFAULTS } from './InterJMarketingCTA';
import { JMarketingCTAView } from './JMarketingCTAView';

export const JMarketingCTAImpl: React.FC<InterJMarketingCTA> = (props) => (
  <JMarketingCTAView {...JMARKETING_CTA_DEFAULTS} {...props} />
);

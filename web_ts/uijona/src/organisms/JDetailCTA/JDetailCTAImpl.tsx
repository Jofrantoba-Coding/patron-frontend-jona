// JDetailCTAImpl.tsx — JONA Implementation
import React from 'react';
import { InterJDetailCTA, JDETAIL_CTA_DEFAULTS } from './InterJDetailCTA';
import { JDetailCTAView } from './JDetailCTAView';

export const JDetailCTAImpl: React.FC<InterJDetailCTA> = (props) => (
  <JDetailCTAView {...JDETAIL_CTA_DEFAULTS} {...props} />
);

// JAlertImpl.tsx — JONA Implementation
import React from 'react';
import { InterJAlert, JALERT_DEFAULTS } from './InterJAlert';
import { JAlertView } from './JAlertView';

export const JAlertImpl: React.FC<InterJAlert> = (props) => (
  <JAlertView {...JALERT_DEFAULTS} {...props} />
);

JAlertImpl.displayName = 'JAlert';

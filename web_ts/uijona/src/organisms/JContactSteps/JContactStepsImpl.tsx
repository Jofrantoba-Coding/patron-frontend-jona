// JContactStepsImpl.tsx — JONA Implementation
import React from 'react';
import { InterJContactSteps, JCONTACT_STEPS_DEFAULTS } from './InterJContactSteps';
import { JContactStepsView } from './JContactStepsView';

export const JContactStepsImpl: React.FC<InterJContactSteps> = (props) => (
  <JContactStepsView {...JCONTACT_STEPS_DEFAULTS} {...props} />
);

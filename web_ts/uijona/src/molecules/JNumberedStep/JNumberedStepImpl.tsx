// JNumberedStepImpl.tsx — JONA Implementation
import React from 'react';
import { InterJNumberedStep, JNUMBERED_STEP_DEFAULTS } from './InterJNumberedStep';
import { JNumberedStepView } from './JNumberedStepView';

export const JNumberedStepImpl: React.FC<InterJNumberedStep> = (props) => (
  <JNumberedStepView {...JNUMBERED_STEP_DEFAULTS} {...props} />
);

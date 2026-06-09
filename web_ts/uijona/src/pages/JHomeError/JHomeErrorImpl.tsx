// JHomeErrorImpl.tsx — JONA Layer: Implementation (applies defaults)
import React from 'react';
import { InterJHomeError, JHOME_ERROR_DEFAULTS } from './InterJHomeError';
import { JHomeErrorView } from './JHomeErrorView';

export const JHomeErrorImpl: React.FC<InterJHomeError> = (props) => {
  const merged: InterJHomeError = { ...JHOME_ERROR_DEFAULTS, ...props };
  return <JHomeErrorView {...merged} />;
};

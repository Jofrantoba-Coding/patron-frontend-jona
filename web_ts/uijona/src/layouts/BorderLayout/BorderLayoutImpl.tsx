// BorderLayoutImpl.tsx — JONA Implementation (aplica defaults)
import React from 'react';
import { InterBorderLayout, BORDER_LAYOUT_DEFAULTS } from './InterBorderLayout';
import { BorderLayoutView } from './BorderLayoutView';

export const BorderLayoutImpl: React.FC<InterBorderLayout> = (props) => {
  const resolved = { ...BORDER_LAYOUT_DEFAULTS, ...props };
  return <BorderLayoutView {...resolved} />;
};

BorderLayoutImpl.displayName = 'BorderLayout';

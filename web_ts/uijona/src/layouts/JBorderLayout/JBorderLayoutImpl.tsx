// JBorderLayoutImpl.tsx — JONA Implementation (aplica defaults)
import React from 'react';
import { InterJBorderLayout, JBORDER_LAYOUT_DEFAULTS } from './InterJBorderLayout';
import { JBorderLayoutView } from './JBorderLayoutView';

export const JBorderLayoutImpl = React.forwardRef<HTMLDivElement, InterJBorderLayout>((props, ref) => {
  const resolved = { ...JBORDER_LAYOUT_DEFAULTS, ...props };
  return <JBorderLayoutView {...resolved} forwardedRef={ref} />;
});

JBorderLayoutImpl.displayName = 'JBorderLayout';

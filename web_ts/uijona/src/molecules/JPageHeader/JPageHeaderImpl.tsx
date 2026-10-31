// JPageHeaderImpl.tsx — JONA Implementation
import React from 'react';
import { InterJPageHeader, JPAGEHEADER_DEFAULTS } from './InterJPageHeader';
import { JPageHeaderView } from './JPageHeaderView';

export const JPageHeaderImpl = React.forwardRef<HTMLHeadingElement, InterJPageHeader>(
  ({ breadcrumbLabel, headingLevel, ...props }, ref) => (
    <JPageHeaderView
      {...props}
      breadcrumbLabel={breadcrumbLabel ?? JPAGEHEADER_DEFAULTS.breadcrumbLabel}
      headingLevel={headingLevel ?? JPAGEHEADER_DEFAULTS.headingLevel}
      forwardedRef={ref}
    />
  ),
);

JPageHeaderImpl.displayName = 'JPageHeader';

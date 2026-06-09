// JErrorPageImpl.tsx — JONA Layer: Implementation (applies defaults)
import React from 'react';
import { InterJErrorPage, JERROR_PAGE_DEFAULTS } from './InterJErrorPage';
import { JErrorPageView } from './JErrorPageView';

export const JErrorPageImpl: React.FC<InterJErrorPage> = (props) => {
  const merged: InterJErrorPage = { ...JERROR_PAGE_DEFAULTS, ...props };
  return <JErrorPageView {...merged} />;
};

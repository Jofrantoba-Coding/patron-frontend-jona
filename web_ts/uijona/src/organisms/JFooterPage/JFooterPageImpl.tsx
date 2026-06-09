// JFooterPageImpl.tsx — JONA Impl (defaults spread)
import React from 'react';
import { InterJFooterPage, JFOOTER_PAGE_DEFAULTS } from './InterJFooterPage';
import { JFooterPageView } from './JFooterPageView';

export const JFooterPageImpl: React.FC<InterJFooterPage> = (props) => {
  const merged = { ...JFOOTER_PAGE_DEFAULTS, ...props };
  return <JFooterPageView {...merged} />;
};

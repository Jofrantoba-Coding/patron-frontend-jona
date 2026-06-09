// JHeaderPageImpl.tsx — JONA Impl (defaults spread)
import React from 'react';
import { InterJHeaderPage, JHEADER_PAGE_DEFAULTS } from './InterJHeaderPage';
import { JHeaderPageView } from './JHeaderPageView';

export const JHeaderPageImpl: React.FC<InterJHeaderPage> = (props) => {
  const merged = { ...JHEADER_PAGE_DEFAULTS, ...props };
  return <JHeaderPageView {...merged} />;
};

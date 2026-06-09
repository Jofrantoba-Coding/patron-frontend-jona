// JSiteFooterImpl.tsx — JONA Implementation
import React from 'react';
import { InterJSiteFooter, JSITE_FOOTER_DEFAULTS } from './InterJSiteFooter';
import { JSiteFooterView } from './JSiteFooterView';

export const JSiteFooterImpl: React.FC<InterJSiteFooter> = (props) => (
  <JSiteFooterView {...JSITE_FOOTER_DEFAULTS} {...props} />
);

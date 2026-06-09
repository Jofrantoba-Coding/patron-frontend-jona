// JFooterPage.tsx — JONA entry component
import React from 'react';
import { JFooterPageImpl } from './JFooterPageImpl';
import { InterJFooterPage } from './InterJFooterPage';

export const JFooterPage: React.FC<InterJFooterPage> = (props) => (
  <JFooterPageImpl {...props} />
);

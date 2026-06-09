// JHeaderPage.tsx — JONA entry component
import React from 'react';
import { JHeaderPageImpl } from './JHeaderPageImpl';
import { InterJHeaderPage } from './InterJHeaderPage';

export const JHeaderPage: React.FC<InterJHeaderPage> = (props) => (
  <JHeaderPageImpl {...props} />
);

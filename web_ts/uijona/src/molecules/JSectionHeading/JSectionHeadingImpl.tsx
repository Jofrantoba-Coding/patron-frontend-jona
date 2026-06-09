// JSectionHeadingImpl.tsx — JONA Implementation
import React from 'react';
import { InterJSectionHeading, JSECTION_HEADING_DEFAULTS } from './InterJSectionHeading';
import { JSectionHeadingView } from './JSectionHeadingView';

export const JSectionHeadingImpl: React.FC<InterJSectionHeading> = (props) => (
  <JSectionHeadingView {...JSECTION_HEADING_DEFAULTS} {...props} />
);

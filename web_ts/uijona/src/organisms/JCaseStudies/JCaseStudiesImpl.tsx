// JCaseStudiesImpl.tsx — JONA Implementation (aplica defaults)
import React from 'react';
import { InterJCaseStudies, JCASE_STUDIES_DEFAULTS } from './InterJCaseStudies';
import { JCaseStudiesView } from './JCaseStudiesView';

export const JCaseStudiesImpl: React.FC<InterJCaseStudies> = (props) => (
  <JCaseStudiesView {...JCASE_STUDIES_DEFAULTS} {...props} />
);

JCaseStudiesImpl.displayName = 'JCaseStudies';

// JContactMethodsImpl.tsx — JONA Implementation
import React from 'react';
import { InterJContactMethods, JCONTACT_METHODS_DEFAULTS } from './InterJContactMethods';
import { JContactMethodsView } from './JContactMethodsView';

export const JContactMethodsImpl: React.FC<InterJContactMethods> = (props) => (
  <JContactMethodsView {...JCONTACT_METHODS_DEFAULTS} {...props} />
);

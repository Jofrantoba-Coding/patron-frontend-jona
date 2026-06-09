// JPaginationImpl.tsx — JONA Implementation
import React from 'react';
import { InterJPagination, JPAGINATION_DEFAULTS } from './InterJPagination';
import { JPaginationView } from './JPaginationView';

export const JPaginationImpl: React.FC<InterJPagination> = (props) => (
  <JPaginationView {...JPAGINATION_DEFAULTS} {...props} />
);
JPaginationImpl.displayName = 'JPagination';

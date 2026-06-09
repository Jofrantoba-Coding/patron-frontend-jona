// JEmptyStateImpl.tsx — JONA Implementation
import React from 'react';
import { InterJEmptyState } from './InterJEmptyState';
import { JEmptyStateView } from './JEmptyStateView';

export const JEmptyStateImpl: React.FC<InterJEmptyState> = (props) => (
  <JEmptyStateView {...props} />
);

JEmptyStateImpl.displayName = 'JEmptyState';

// JErrorSummaryImpl.tsx — JONA Implementation
import React from 'react';
import { InterJErrorSummary, JERRORSUMMARY_DEFAULTS } from './InterJErrorSummary';
import { JErrorSummaryView } from './JErrorSummaryView';

export const JErrorSummaryImpl: React.FC<InterJErrorSummary> = ({ title, errors, onSelect }) => {
  if (errors.length === 0) return null;
  return (
    <JErrorSummaryView
      title={title ?? JERRORSUMMARY_DEFAULTS.title}
      errors={errors}
      onSelect={(field) => onSelect?.(field)}
    />
  );
};

JErrorSummaryImpl.displayName = 'JErrorSummary';

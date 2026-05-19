import React from 'react';
import { SPRING_LAYOUT_DEFAULTS, type InterSpringLayout } from './InterSpringLayout';
import { SpringLayoutView } from './SpringLayoutView';

export const SpringLayoutImpl = React.forwardRef<HTMLDivElement, InterSpringLayout>(
  (props, ref) => (
    <SpringLayoutView ref={ref} {...SPRING_LAYOUT_DEFAULTS} {...props} />
  )
);

SpringLayoutImpl.displayName = 'JSpringLayout';

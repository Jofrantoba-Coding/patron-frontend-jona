import React from 'react';
import { FLOW_LAYOUT_DEFAULTS, type InterFlowLayout } from './InterFlowLayout';
import { FlowLayoutView } from './FlowLayoutView';

export const FlowLayoutImpl = React.forwardRef<HTMLDivElement, InterFlowLayout>(
  (props, ref) => <FlowLayoutView ref={ref} {...FLOW_LAYOUT_DEFAULTS} {...props} />
);

FlowLayoutImpl.displayName = 'FlowLayout';

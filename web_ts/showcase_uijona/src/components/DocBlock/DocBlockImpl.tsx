// DocBlockImpl.tsx — JONA Impl
import React from 'react';
import { DocBlockView } from './DocBlockView';
import { InterDocBlock } from './InterDocBlock';

export const DocBlockImpl: React.FC<InterDocBlock> = (props) => (
  <DocBlockView {...props} />
);

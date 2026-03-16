// DocBlock.tsx — JONA entry component
import React from 'react';
import { DocBlockImpl } from './DocBlockImpl';
import { InterDocBlock } from './InterDocBlock';

export const DocBlock: React.FC<InterDocBlock> = (props) => (
  <DocBlockImpl {...props} />
);

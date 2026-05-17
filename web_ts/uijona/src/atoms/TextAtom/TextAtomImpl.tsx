import React from 'react';
import { JLabelImpl } from '../JLabel/JLabelImpl';
import { InterTextAtom } from './InterTextAtom';

export const TextAtomImpl: React.FC<InterTextAtom> = ({ as, size, color, truncate, children, ...rest }) => (
  <JLabelImpl variant="body" as={as as any} size={size} color={color} truncate={truncate} {...rest}>
    {children}
  </JLabelImpl>
);
TextAtomImpl.displayName = 'TextAtom';

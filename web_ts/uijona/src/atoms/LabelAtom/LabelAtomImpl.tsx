import React from 'react';
import { JLabelImpl } from '../JLabel/JLabelImpl';
import { InterLabelAtom } from './InterLabelAtom';

export const LabelAtomImpl: React.FC<InterLabelAtom> = ({ required, disabled, children, ...rest }) => (
  <JLabelImpl variant="label" required={required} disabled={disabled} {...(rest as any)}>
    {children}
  </JLabelImpl>
);
LabelAtomImpl.displayName = 'LabelAtom';

import React from 'react';
import { JLabelImpl } from '../JLabel/JLabelImpl';
import { InterErrorMessageAtom, ErrorMessageType } from './InterErrorMessageAtom';
import type { JLabelVariant } from '../JLabel/InterJLabel';

const TYPE_MAP: Record<ErrorMessageType, JLabelVariant> = {
  'error':       'error',
  'description': 'description',
};

export const ErrorMessageAtomImpl: React.FC<InterErrorMessageAtom> = ({ message, type = 'error', id, className }) => (
  <JLabelImpl variant={TYPE_MAP[type]} message={message} id={id} className={className} />
);
ErrorMessageAtomImpl.displayName = 'ErrorMessageAtom';

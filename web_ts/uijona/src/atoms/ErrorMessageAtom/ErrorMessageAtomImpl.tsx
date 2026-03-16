// ErrorMessageAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterErrorMessageAtom } from './InterErrorMessageAtom';
import { ErrorMessageAtomView } from './ErrorMessageAtomView';

export const ErrorMessageAtomImpl: React.FC<InterErrorMessageAtom> = (props) => <ErrorMessageAtomView {...props} />;
ErrorMessageAtomImpl.displayName = 'ErrorMessageAtom';

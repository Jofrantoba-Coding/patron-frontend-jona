// SeparatorAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterSeparatorAtom } from './InterSeparatorAtom';
import { SeparatorAtomView } from './SeparatorAtomView';

export const SeparatorAtomImpl: React.FC<InterSeparatorAtom> = (props) => <SeparatorAtomView {...props} />;
SeparatorAtomImpl.displayName = 'SeparatorAtom';

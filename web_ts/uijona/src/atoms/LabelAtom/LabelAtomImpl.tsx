// LabelAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterLabelAtom } from './InterLabelAtom';
import { LabelAtomView } from './LabelAtomView';

export const LabelAtomImpl: React.FC<InterLabelAtom> = (props) => <LabelAtomView {...props} />;
LabelAtomImpl.displayName = 'LabelAtom';

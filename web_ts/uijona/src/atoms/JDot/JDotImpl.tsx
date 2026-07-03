// JDotImpl.tsx — JONA Implementation
import React from 'react';
import { InterJDot, JDOT_DEFAULTS } from './InterJDot';
import { JDotView } from './JDotView';

export const JDotImpl: React.FC<InterJDot> = (props) => <JDotView {...JDOT_DEFAULTS} {...props} />;

JDotImpl.displayName = 'JDot';

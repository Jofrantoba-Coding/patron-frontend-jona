// SkeletonAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterSkeletonAtom } from './InterSkeletonAtom';
import { SkeletonAtomView } from './SkeletonAtomView';

export const SkeletonAtomImpl: React.FC<InterSkeletonAtom> = (props) => <SkeletonAtomView {...props} />;
SkeletonAtomImpl.displayName = 'SkeletonAtom';

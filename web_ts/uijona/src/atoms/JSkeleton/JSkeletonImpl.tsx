import React from 'react';
import { JSKELETON_DEFAULTS, InterJSkeleton } from './InterJSkeleton';
import { JSkeletonView } from './JSkeletonView';

type JSkeletonImplProps = InterJSkeleton &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

export const JSkeletonImpl = React.forwardRef<HTMLDivElement, JSkeletonImplProps>(
  (props, ref) => <JSkeletonView {...JSKELETON_DEFAULTS} {...props} forwardedRef={ref} />
);

JSkeletonImpl.displayName = 'JSkeleton';

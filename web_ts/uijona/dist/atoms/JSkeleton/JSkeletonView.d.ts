import React from 'react';
import { InterJSkeleton } from './InterJSkeleton';
type JSkeletonViewProps = InterJSkeleton & {
    forwardedRef?: React.Ref<HTMLDivElement>;
};
export declare const JSkeletonView: React.FC<JSkeletonViewProps>;
export {};

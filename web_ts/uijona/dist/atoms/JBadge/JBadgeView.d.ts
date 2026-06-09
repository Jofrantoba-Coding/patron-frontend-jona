import React from 'react';
import { InterJBadge } from './InterJBadge';
type JBadgeViewProps = InterJBadge & Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children'> & {
    forwardedRef?: React.Ref<HTMLSpanElement>;
};
export declare const JBadgeView: React.FC<JBadgeViewProps>;
export {};

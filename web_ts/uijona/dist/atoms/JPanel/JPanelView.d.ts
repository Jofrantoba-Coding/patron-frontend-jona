import React from 'react';
import { InterJPanel } from './InterJPanel';
type JPanelViewProps = InterJPanel & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'> & {
    forwardedRef?: React.Ref<HTMLElement>;
};
export declare const JPanelView: React.FC<JPanelViewProps>;
export {};

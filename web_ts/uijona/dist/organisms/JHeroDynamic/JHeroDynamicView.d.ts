import React from 'react';
import { InterJHeroDynamic } from './InterJHeroDynamic';
type JHeroDynamicViewProps = Omit<InterJHeroDynamic, 'rotatingWords' | 'intervalMs'> & {
    word: string;
};
export declare const JHeroDynamicView: React.FC<JHeroDynamicViewProps>;
export {};

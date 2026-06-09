import React from 'react';
import { InterJSelectField } from './InterJSelectField';
type JSelectFieldViewProps = InterJSelectField & {
    forwardedRef?: React.Ref<HTMLSelectElement>;
    value?: string;
};
export declare const JSelectFieldView: React.FC<JSelectFieldViewProps>;
export {};

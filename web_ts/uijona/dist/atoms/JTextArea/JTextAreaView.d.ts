import React from 'react';
import { InterJTextArea } from './InterJTextArea';
interface JTextAreaViewProps extends InterJTextArea {
    forwardedRef?: React.Ref<HTMLTextAreaElement>;
}
export declare const JTextAreaView: React.FC<JTextAreaViewProps>;
export {};

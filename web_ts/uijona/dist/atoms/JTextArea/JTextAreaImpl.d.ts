import React from 'react';
import { InterJTextArea } from './InterJTextArea';
export declare const JTextAreaImpl: React.ForwardRefExoticComponent<InterJTextArea & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onFocus" | "onBlur" | "onKeyDown" | "onChange"> & React.RefAttributes<HTMLTextAreaElement>>;

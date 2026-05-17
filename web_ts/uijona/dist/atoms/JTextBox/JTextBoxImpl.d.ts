import React from 'react';
import { InterJTextBox } from './InterJTextBox';
export declare const JTextBoxImpl: React.ForwardRefExoticComponent<InterJTextBox & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onBlur" | "onKeyDown" | "value" | "defaultValue" | "onChange"> & React.RefAttributes<HTMLInputElement>>;

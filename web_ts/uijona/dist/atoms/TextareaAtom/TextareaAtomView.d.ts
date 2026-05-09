import { default as React } from '../../../node_modules/react';
import { InterTextareaAtom } from './InterTextareaAtom';

interface TextareaAtomViewProps extends Omit<InterTextareaAtom, 'onChange' | 'onBlur'> {
    forwardedRef?: React.Ref<HTMLTextAreaElement>;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    [key: string]: unknown;
}
export declare const TextareaAtomView: React.FC<TextareaAtomViewProps>;
export {};

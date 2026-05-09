import React from 'react';
import { InterToastAtom } from './InterToastAtom';
interface ToastAtomViewProps extends Omit<InterToastAtom, 'className'> {
    className?: string;
    onDismissClick?: () => void;
}
export declare const ToastAtomView: React.FC<ToastAtomViewProps>;
export {};

import { default as React } from '../../../node_modules/react';
import { InterToastAtom } from './InterToastAtom';

interface ToastAtomViewProps extends Omit<InterToastAtom, 'className'> {
    className?: string;
    onDismissClick?: () => void;
}
export declare const ToastAtomView: React.FC<ToastAtomViewProps>;
export {};

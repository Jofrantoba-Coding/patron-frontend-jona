import { default as React } from '../../../node_modules/react';
import { InterToastMolecule } from './InterToastMolecule';

interface ToastMoleculeViewProps extends Omit<InterToastMolecule, 'className'> {
    className?: string;
    onDismissClick?: () => void;
}
export declare const ToastMoleculeView: React.FC<ToastMoleculeViewProps>;
export {};

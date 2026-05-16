import { default as React } from '../../../node_modules/react';
import { InterDrawerMolecule } from './InterDrawerMolecule';

interface DrawerMoleculeViewProps extends Required<Pick<InterDrawerMolecule, 'open' | 'side' | 'size' | 'showCloseButton' | 'onClose'>> {
    title?: string;
    description?: string;
    className?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onOverlayClick: () => void;
}
export declare const DrawerMoleculeView: React.FC<DrawerMoleculeViewProps>;
export {};

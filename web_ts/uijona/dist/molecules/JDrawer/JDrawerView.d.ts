import React from 'react';
import { InterJDrawer } from './InterJDrawer';
interface JDrawerViewProps extends Required<Pick<InterJDrawer, 'open' | 'side' | 'size' | 'showCloseButton' | 'onClose'>> {
    title?: string;
    description?: string;
    className?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onOverlayClick: () => void;
}
export declare const JDrawerView: React.FC<JDrawerViewProps>;
export {};

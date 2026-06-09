import React from 'react';
import { JToastVariant } from './InterJToast';
export interface JToastViewProps {
    id: string;
    message: string;
    title?: string;
    variant?: JToastVariant;
    className?: string;
    onDismissClick?: () => void;
}
export declare const JToastView: React.FC<JToastViewProps>;

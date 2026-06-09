import React from 'react';
import { InterJFileUpload } from './InterJFileUpload';
type JFileUploadViewProps = Omit<InterJFileUpload, 'files' | 'defaultFiles' | 'onFilesChange' | 'onReject' | 'onRemoveFile'> & {
    selectedFiles: File[];
    inputId: string;
    isDragging: boolean;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
    onDropZoneDragOver: React.DragEventHandler<HTMLLabelElement>;
    onDropZoneDragLeave: React.DragEventHandler<HTMLLabelElement>;
    onDropZoneDrop: React.DragEventHandler<HTMLLabelElement>;
    onRemoveClick: (file: File) => void;
};
export declare const JFileUploadView: React.FC<JFileUploadViewProps>;
export {};

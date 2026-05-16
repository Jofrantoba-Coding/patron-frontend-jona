import { default as React } from '../../../node_modules/react';
import { InterFileUploadMolecule } from './InterFileUploadMolecule';

type FileUploadMoleculeViewProps = Omit<InterFileUploadMolecule, 'files' | 'defaultFiles' | 'onFilesChange' | 'onReject' | 'onRemoveFile'> & {
    selectedFiles: File[];
    inputId: string;
    isDragging: boolean;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
    onDropZoneDragOver: React.DragEventHandler<HTMLLabelElement>;
    onDropZoneDragLeave: React.DragEventHandler<HTMLLabelElement>;
    onDropZoneDrop: React.DragEventHandler<HTMLLabelElement>;
    onRemoveClick: (file: File) => void;
};
export declare const FileUploadMoleculeView: React.FC<FileUploadMoleculeViewProps>;
export {};

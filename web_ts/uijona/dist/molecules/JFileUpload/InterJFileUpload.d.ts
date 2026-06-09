import React from 'react';
export interface JFileUploadReject {
    reason: 'max-files' | 'accept';
    files: File[];
}
export interface InterJFileUpload extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
    files?: File[];
    defaultFiles?: File[];
    label?: string;
    description?: string;
    helperText?: string;
    maxFiles?: number;
    dropzoneClassName?: string;
    fileListClassName?: string;
    onFilesChange?: (files: File[]) => void;
    onReject?: (reject: JFileUploadReject) => void;
    onRemoveFile?: (file: File, nextFiles: File[]) => void;
}
export declare const JFILE_UPLOAD_DEFAULTS: Required<Pick<InterJFileUpload, 'multiple' | 'label' | 'description'>>;

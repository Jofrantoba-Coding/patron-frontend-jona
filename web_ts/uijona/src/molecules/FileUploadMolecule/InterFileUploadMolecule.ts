import React from 'react';

export interface FileUploadReject {
  reason: 'max-files' | 'accept';
  files: File[];
}

export interface InterFileUploadMolecule
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  files?: File[];
  defaultFiles?: File[];
  label?: string;
  description?: string;
  helperText?: string;
  maxFiles?: number;
  dropzoneClassName?: string;
  fileListClassName?: string;
  onFilesChange?: (files: File[]) => void;
  onReject?: (reject: FileUploadReject) => void;
  onRemoveFile?: (file: File, nextFiles: File[]) => void;
}

export const FILE_UPLOAD_MOLECULE_DEFAULTS: Required<Pick<InterFileUploadMolecule, 'multiple' | 'label' | 'description'>> = {
  multiple: false,
  label: 'Upload files',
  description: 'Drag files here or choose from your device.',
};

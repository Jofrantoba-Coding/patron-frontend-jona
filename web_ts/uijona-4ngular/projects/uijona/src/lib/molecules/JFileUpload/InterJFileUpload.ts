export interface JFileUploadReject {
  reason: 'max-files' | 'accept';
  files: File[];
}

/** Contrato publico de JFileUpload. */
export interface InterJFileUpload {
  files?: File[];
  label?: string;
  description?: string;
  helperText?: string;
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

import React from 'react';
import { cn } from '../../lib/cn';
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

const UploadIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m17 8-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const FileUploadMoleculeView: React.FC<FileUploadMoleculeViewProps> = ({
  selectedFiles,
  inputId,
  isDragging,
  label,
  description,
  helperText,
  maxFiles,
  dropzoneClassName,
  fileListClassName,
  className,
  onInputChange,
  onDropZoneDragOver,
  onDropZoneDragLeave,
  onDropZoneDrop,
  onRemoveClick,
  disabled,
  ...inputProps
}) => (
  <div className={cn('flex w-full min-w-0 flex-col gap-3', className)}>
    <label
      htmlFor={inputId}
      onDragOver={onDropZoneDragOver}
      onDragLeave={onDropZoneDragLeave}
      onDrop={onDropZoneDrop}
      className={cn(
        'flex min-h-36 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-white px-4 py-6 text-center transition-colors',
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50',
        disabled && 'pointer-events-none opacity-50',
        dropzoneClassName
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
        <UploadIcon />
      </span>
      <span className="break-words text-sm font-medium text-neutral-900">{label}</span>
      {description && <span className="max-w-sm break-words text-sm text-neutral-500">{description}</span>}
      {maxFiles && <span className="text-xs text-neutral-400">Max {maxFiles} file{maxFiles === 1 ? '' : 's'}</span>}
      <input
        {...inputProps}
        id={inputId}
        type="file"
        disabled={disabled}
        aria-label={typeof label === 'string' ? label : 'Upload files'}
        onChange={onInputChange}
        className="sr-only"
      />
    </label>

    {helperText && <p className="break-words text-xs text-neutral-500">{helperText}</p>}

    {selectedFiles.length > 0 && (
      <ul className={cn('flex min-w-0 flex-col gap-2', fileListClassName)}>
        {selectedFiles.map((file) => (
          <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900">{file.name}</p>
              <p className="text-xs text-neutral-500">{formatBytes(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveClick(file)}
              className="shrink-0 rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

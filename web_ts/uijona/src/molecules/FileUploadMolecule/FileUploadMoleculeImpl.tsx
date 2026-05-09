import React, { useId, useState } from 'react';
import { FILE_UPLOAD_MOLECULE_DEFAULTS, InterFileUploadMolecule } from './InterFileUploadMolecule';
import { FileUploadMoleculeView } from './FileUploadMoleculeView';

const acceptsFile = (file: File, accept?: string) => {
  if (!accept) return true;
  const rules = accept.split(',').map((rule) => rule.trim()).filter(Boolean);
  if (rules.length === 0) return true;

  return rules.some((rule) => {
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule.toLowerCase());
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
};

export const FileUploadMoleculeImpl: React.FC<InterFileUploadMolecule> = ({
  files,
  defaultFiles = [],
  id,
  accept,
  multiple,
  maxFiles,
  onFilesChange,
  onReject,
  onRemoveFile,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? `jona-file-upload-${generatedId}`;
  const resolved = { ...FILE_UPLOAD_MOLECULE_DEFAULTS, ...props, accept, multiple, maxFiles };
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles);
  const [isDragging, setIsDragging] = useState(false);
  const selectedFiles = files ?? internalFiles;

  const commitFiles = (incoming: File[]) => {
    const accepted = incoming.filter((file) => acceptsFile(file, accept));
    const rejectedByAccept = incoming.filter((file) => !acceptsFile(file, accept));
    if (rejectedByAccept.length > 0) onReject?.({ reason: 'accept', files: rejectedByAccept });

    const nextFiles = multiple ? [...selectedFiles, ...accepted] : accepted.slice(0, 1);
    const limitedFiles = maxFiles ? nextFiles.slice(0, maxFiles) : nextFiles;
    if (maxFiles && nextFiles.length > maxFiles) onReject?.({ reason: 'max-files', files: nextFiles.slice(maxFiles) });

    if (files === undefined) setInternalFiles(limitedFiles);
    onFilesChange?.(limitedFiles);
  };

  const removeFile = (file: File) => {
    const nextFiles = selectedFiles.filter((item) => item !== file);
    if (files === undefined) setInternalFiles(nextFiles);
    onRemoveFile?.(file, nextFiles);
    onFilesChange?.(nextFiles);
  };

  return (
    <FileUploadMoleculeView
      {...resolved}
      id={inputId}
      inputId={inputId}
      selectedFiles={selectedFiles}
      isDragging={isDragging}
      onInputChange={(event) => {
        commitFiles(Array.from(event.target.files ?? []));
        event.target.value = '';
      }}
      onDropZoneDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDropZoneDragLeave={() => setIsDragging(false)}
      onDropZoneDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        commitFiles(Array.from(event.dataTransfer.files ?? []));
      }}
      onRemoveClick={removeFile}
    />
  );
};

FileUploadMoleculeImpl.displayName = 'FileUploadMolecule';

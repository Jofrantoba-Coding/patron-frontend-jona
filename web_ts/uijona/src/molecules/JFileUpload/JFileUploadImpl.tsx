// JFileUploadImpl.tsx — JONA Implementation
import React, { useId, useState } from 'react';
import { InterJFileUpload, JFILE_UPLOAD_DEFAULTS } from './InterJFileUpload';
import { JFileUploadView } from './JFileUploadView';

const acceptsFile = (file: File, accept?: string): boolean => {
  if (!accept) return true;
  const rules = accept.split(',').map((r) => r.trim()).filter(Boolean);
  if (rules.length === 0) return true;
  return rules.some((rule) => {
    if (rule.startsWith('.'))  return file.name.toLowerCase().endsWith(rule.toLowerCase());
    if (rule.endsWith('/*'))   return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
};

export const JFileUploadImpl: React.FC<InterJFileUpload> = ({
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
  const inputId     = id ?? `jona-file-upload-${generatedId}`;
  const resolved    = { ...JFILE_UPLOAD_DEFAULTS, ...props, accept, multiple, maxFiles };

  const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles);
  const [isDragging,    setIsDragging]    = useState(false);
  const selectedFiles = files ?? internalFiles;

  const commitFiles = (incoming: File[]) => {
    const accepted         = incoming.filter((f) => acceptsFile(f, accept));
    const rejectedByAccept = incoming.filter((f) => !acceptsFile(f, accept));
    if (rejectedByAccept.length > 0) onReject?.({ reason: 'accept', files: rejectedByAccept });

    const merged  = multiple ? [...selectedFiles, ...accepted] : accepted.slice(0, 1);
    const limited = maxFiles ? merged.slice(0, maxFiles) : merged;
    if (maxFiles && merged.length > maxFiles) onReject?.({ reason: 'max-files', files: merged.slice(maxFiles) });

    if (files === undefined) setInternalFiles(limited);
    onFilesChange?.(limited);
  };

  const removeFile = (file: File) => {
    const nextFiles = selectedFiles.filter((item) => item !== file);
    if (files === undefined) setInternalFiles(nextFiles);
    onRemoveFile?.(file, nextFiles);
    onFilesChange?.(nextFiles);
  };

  return (
    <JFileUploadView
      {...resolved}
      id={inputId}
      inputId={inputId}
      selectedFiles={selectedFiles}
      isDragging={isDragging}
      onInputChange={(event) => {
        commitFiles(Array.from(event.target.files ?? []));
        event.target.value = '';
      }}
      onDropZoneDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
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

JFileUploadImpl.displayName = 'JFileUpload';

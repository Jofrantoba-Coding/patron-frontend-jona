import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FileUploadMolecule } from './FileUploadMolecule';

const meta: Meta<typeof FileUploadMolecule> = {
  title: 'Molecules/FileUploadMolecule',
  component: FileUploadMolecule,
  tags: ['autodocs'],
  args: {
    label: 'Upload documents',
    description: 'PDF, PNG or JPG up to your application limit.',
    accept: '.pdf,image/*',
    multiple: true,
    maxFiles: 3,
    onFilesChange: fn(),
    onReject: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FileUploadMolecule>;

export const Default: Story = {};

export const WithHelper: Story = {
  args: {
    helperText: 'Selected files are kept in component state until the form is submitted.',
  },
};

export const Interactive: Story = {
  args: {
    onFilesChange: fn(),
  },
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="flex flex-col gap-3 w-96">
        <FileUploadMolecule
          label="Adjuntar documentos"
          description="PDF, PNG o JPG hasta 5 MB"
          accept=".pdf,image/*"
          multiple
          maxFiles={3}
          onFilesChange={(f) => { args.onFilesChange?.(f); setFiles(f); }}
          helperText={
            files.length > 0
              ? `${files.length} archivo(s) seleccionado(s). Listos para enviar.`
              : undefined
          }
        />
        {files.length > 0 && (
          <ul className="text-xs text-neutral-500 list-disc list-inside flex flex-col gap-1">
            {files.map((f) => (
              <li key={f.name}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};

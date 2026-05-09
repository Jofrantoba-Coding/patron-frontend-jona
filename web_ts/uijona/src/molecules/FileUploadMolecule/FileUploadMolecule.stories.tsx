import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FileUploadMolecule } from './FileUploadMolecule';

const meta: Meta<typeof FileUploadMolecule> = {
  title: 'Molecules/FileUploadMolecule',
  component: FileUploadMolecule,
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

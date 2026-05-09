import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SearchInputMolecule } from './SearchInputMolecule';

const meta: Meta<typeof SearchInputMolecule> = {
  title: 'Molecules/SearchInputMolecule',
  component: SearchInputMolecule,
  args: {
    placeholder: 'Search customers',
    onSearch: fn(),
    onChange: fn(),
    onClear: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SearchInputMolecule>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
    defaultValue: 'revenue',
  },
};
